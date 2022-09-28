import { sortHasAfter } from "/js/app/resources/sort_item.js";
import { parseUserToken } from "/js/app/user_tokens/user_token.js";
import { newUserTokenFilters, userTokenFiltersToApi } from "/js/app/user_tokens/user_token_filters.js";
import { NAME_ALPHABETICAL_AZ, SORT_OPTIONS } from "/js/app/user_tokens/user_token_sort.js";
import { AuthHelper } from "/js/auth_helper.js";
import { apiUrl } from "/js/fetch_helper.js";
import { Observable } from "/js/lib/observable.js";
import { ArrayListenerOf, newArrayListenerOf } from "/js/lib/replica_listener.js";
import { PERSISTERS } from "/js/persist_utils.js";

/**
 * loads user tokens matching the given filters and sorts with the option to get
 * the next page; automatically resets if the filters or sorts change
 */
export class UserTokenReader {
    /**
     * creates a new reader with the default filter and sorts
     * @param {object} [kwargs] the keyword arguments
     * @param {"query" | "notPersisted"} [kwargs.persist = "notPersisted"] if set, where to persist the reader's state
     */
    constructor(kwargs) {
        kwargs = Object.assign({ persist: "notPersisted" }, kwargs);
        /**
         * the persister for the state
         * @type {import("/js/persist_utils.js").Persister}
         * @private
         */
        this.persister = PERSISTERS[kwargs.persist];
        const initialState = this.persister.retrieve("user-token", {
            includeExpired: "0",
            sort: "0",
        });
        /**
         * the filters for the list of items
         * @type {Observable.<import("/js/app/user_tokens/user_token_filters.js").UserTokenFilters>}
         * @readonly
         */
        this.filters = new Observable(
            newUserTokenFilters({
                expiresAt: initialState.includeExpired !== "1" ? { operator: "gtn", value: new Date() } : null,
            })
        );
        /**
         * the sort for the list of items
         * @type {Observable.<import("/js/app/user_tokens/user_token_sort.js").UserTokenSort>}
         * @readonly
         */
        this.sort = new Observable(SORT_OPTIONS[parseInt(initialState.sort)].val);
        /**
         * the maximum number of items to load at a time
         * @type {Observable.<number>}
         * @readonly
         */
        this.limit = new Observable(3);
        /**
         * the actual list of items
         * @type {ArrayListenerOf.<import("/js/app/user_tokens/user_token.js").UserToken>}
         * @readonly
         */
        this.items = newArrayListenerOf([]);
        /**
         * the sort for paginating if we've loaded a page and there is either a next or previous page
         * @type {import("/js/app/user_tokens/user_token_sort.js").UserTokenSort}
         * @private
         */
        this.nextPageSort = null;
        /**
         * if there is a next page; this does not use the listeners but does set its value
         * @type {Observable.<boolean>}
         * @readonly
         */
        this.hasNextPage = new Observable(false);
        /**
         * an internal counter to keep track of how many requests we've sent out
         * to avoid issues with interweaving requests
         * @type {number}
         * @private
         */
        this.requestCounter = 0;
        this.filters.addListener(this.reload.bind(this));
        this.sort.addListener(this.reload.bind(this));
        this.filters.addListener(this.persist.bind(this));
        this.sort.addListener(this.persist.bind(this));
        this.reload();
    }
    /**
     * updates the items to match the result from the given filter and sort so long as
     * the request counter matches the id throughout the entire process
     * @param {import("/js/app/user_tokens/user_token_filters.js").UserTokenFilters} filter
     *   the filter to use
     * @param {import("/js/app/user_tokens/user_token_sort.js").UserTokenSort} sort
     *   the sort to use
     * @param {number} limit the maxmimum number of results to load
     * @param {number} id the value of the request counter for this request
     * @returns {Promise.<any>} a promise which resolves when the request is complete or is aborted
     * @private
     */
    async load(filter, sort, limit, id) {
        if (this.requestCounter !== id) {
            return;
        }
        const response = await fetch(
            apiUrl("/api/1/users/tokens/search"),
            AuthHelper.auth({
                method: "POST",
                headers: { "content-type": "application/json; charset=UTF-8" },
                body: JSON.stringify({
                    filters: userTokenFiltersToApi(filter),
                    sort,
                    limit,
                }),
            })
        );
        if (this.requestCounter !== id) {
            return;
        }
        if (!response.ok) {
            throw response;
        }
        const data = await response.json();
        if (this.requestCounter !== id) {
            return;
        }
        this.nextPageSort = data.next_page_sort;
        this.hasNextPage.value = sortHasAfter(data.next_page_sort);
        /**
         * @type {Array.<import("/js/app/user_tokens/user_token.js").UserToken>}
         */
        let newItems = [];
        for (let item of data.items) {
            newItems.push(parseUserToken(item));
        }
        this.items.splice(this.items.get().length, 0, ...newItems);
    }
    /**
     * loads the first page matching the current sort and filters
     * @returns {Promise.<any>} resolves when the request is completed or aborted
     * @private
     */
    async reload() {
        const id = ++this.requestCounter;
        this.items.splice(0, this.items.get().length);
        return await this.load(this.filters.value, this.sort.value, this.limit.value, id);
    }
    /**
     * loads the next page; returns a rejected promise if there is no next page
     * @returns {Promise.<any>} resolves when the request is completed or aborted
     */
    async loadNext() {
        const id = ++this.requestCounter;
        return await this.load(this.filters.value, this.nextPageSort, this.limit.value, id);
    }
    /**
     * persists the current state of the reader
     * @private
     */
    persist() {
        this.persister.store("user-token", {
            includeExpired: this.filters.value.expiresAt ? "0" : "1",
            sort: SORT_OPTIONS.findIndex((option) => option.val === this.sort.value).toString(),
        });
    }
}
