import { sortHasAfter } from "/js/app/resources/sort_item.js";
import { parseUserUsage } from "/js/app/user_usages/user_usage.js";
import { newUserUsageFilters, userUsageFiltersToApi } from "/js/app/user_usages/user_usage_filters.js";
import { SORT_OPTIONS } from "/js/app/user_usages/user_usage_sort.js";
import { AuthHelper } from "/js/auth_helper.js";
import { apiUrl } from "/js/fetch_helper.js";
import { Observable } from "/js/lib/observable.js";
import { ArrayListenerOf, newArrayListenerOf } from "/js/lib/replica_listener.js";
import { PERSISTERS } from "/js/persist_utils.js";

export class UserUsagesReader {
    /**
     * creates a new reader with the default filter and sorts
     * @param {object} [kwargs] the keyword arguments
     * @param {"query" | "notPersisted"} [kwargs.persist="notPersisted"] if set, where to persist the reader's state
     */
    constructor(kwargs) {
        kwargs = Object.assign({ persist: "notPersisted" }, kwargs);
        /**
         * the persister for the state
         * @type {import("/js/persist_utils.js").Persister}
         * @private
         */
        this.persister = PERSISTERS[kwargs.persist];
        const initialState = this.persister.retrieve("user-usage", {
            periodStartedAt: null,
            sort: "0",
        });
        /**
         * the filters for the list of items
         * @type {Observable.<import("/js/app/user_usages/user_usage_filters.js").UserUsageFilters>}
         * @readonly
         */
        this.filters = new Observable(
            newUserUsageFilters({
                periodStartedAt:
                    initialState.periodStartedAt === null
                        ? null
                        : { operator: "lt", value: new Date(parseFloat(initialState.periodStartedAt)) },
            })
        );
        /**
         * the sort for the list of items
         * @type {Observable.<import("/js/app/user_usages/user_usage_sort.js").UserUsageSort>}
         * @readonly
         */
        this.sort = new Observable(SORT_OPTIONS[parseInt(initialState.sort)].val);
        /**
         * the maximum number of items to show
         * @type {Observable.<number>}
         * @readonly
         */
        this.limit = new Observable(10);
        /**
         * the actual list of items
         * @type {ArrayListenerOf.<import("/js/app/user_usages/user_usage.js").UserUsage>}
         * @readonly
         */
        this.items = newArrayListenerOf([]);
        /**
         * the sort for pagination if we've loaded a page and there is either a next or previous page
         * @type {import("/js/app/user_usages/user_usage_sort.js").UserUsageSort}
         * @private
         */
        this.nextPageSort = null;
        /**
         * if there is a next page; this does not use listeners but it does set its value
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
     *
     * @param {import("/js/app/user_usages/user_usage_filters.js").UserUsageFilters} filter
     *   the filter to use
     * @param {import("/js/app/user_usages/user_usage_sort.js").UserUsageSort} sort
     *   the sort to use
     * @param {number} limit the maximum number of results to load
     * @param {number} id the value of the request counter for this request
     * @returns {Promise.<Array.<import("/js/app/user_usages/user_usage.js").UserUsage>>} a promise which resolves when the request is complete or is aborted
     * @private
     */
    async load(filter, sort, limit, id) {
        if (this.requestCounter !== id) {
            return;
        }
        const response = await fetch(
            apiUrl("/api/1/user_usages/search"),
            AuthHelper.auth({
                method: "POST",
                headers: { "content-type": "application/json; charset=UTF-8" },
                body: JSON.stringify({
                    filters: userUsageFiltersToApi(filter),
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
         * @type {Array.<import("/js/app/user_usages/user_usage.js").UserUsage>}
         */
        let newItems = [];
        for (let item of data.items) {
            newItems.push(parseUserUsage(item));
        }
        return newItems;
    }
    /**
     * loads the first page matching the current sort filters
     * @returns {Promise.<any>} resolves when the request is completed or aborted
     * @private
     */
    async reload() {
        const id = ++this.requestCounter;
        const items = await this.load(this.filters.value, this.sort.value, this.limit.value, id);
        if (items !== undefined && items !== null) {
            this.items.set(items);
        }
    }
    /**
     * loads the next page; returns a rejected promise if there is no next page
     * @returns {Promise.<any>} resolves when the request is completed or aborted
     */
    async loadNext() {
        const id = ++this.requestCounter;
        const items = await this.load(this.filters.value, this.nextPageSort, this.limit.value, id);
        if (items !== undefined && items !== null) {
            this.items.splice(this.items.get().length, 0, ...items);
        }
    }
    /**
     * persists the current state of the reader
     * @private
     */
    persist() {
        this.persister.store("user-usage", {
            periodStartedAt:
                this.filters.value.periodStartedAt === null
                    ? null
                    : this.filters.value.periodStartedAt.value.getTime().toString(),
            sort: SORT_OPTIONS.findIndex((option) => option.val === this.sort.value).toString(),
        });
    }
}
