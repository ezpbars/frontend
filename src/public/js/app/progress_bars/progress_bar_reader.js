import { parseProgressBar } from "/js/app/progress_bars/progress_bar.js";
import { newProgressBarFilters, progressBarFiltersToApi } from "/js/app/progress_bars/progress_bar_filters.js";
import { NAME_ALPHABETICAL_AZ } from "/js/app/progress_bars/progress_bar_sort.js";
import { sortHasAfter } from "/js/app/resources/sort_item.js";
import { AuthHelper } from "/js/auth_helper.js";
import { apiUrl } from "/js/fetch_helper.js";
import { Observable } from "/js/lib/observable.js";
import { ArrayListenerOf, newArrayListenerOf } from "/js/lib/replica_listener.js";

/**
 * loads progress bars matching the given filters and sorts with the option to
 * get the next page; automatically resets if the filters or sorts change
 */
export class ProgressBarReader {
    /**
     * creates a new reader with the default filter and sorts
     */
    constructor() {
        /**
         * the filters for the list of items
         * @type {Observable.<import("/js/app/progress_bars/progress_bar_filters.js").ProgressBarFilters>}
         * @readonly
         */
        this.filters = new Observable(newProgressBarFilters({}));
        /**
         * the sort for the list of items
         * @type {Observable.<import("/js/app/progress_bars/progress_bar_sort.js").ProgressBarSort>}
         * @readonly
         */
        this.sort = new Observable(NAME_ALPHABETICAL_AZ);
        /**
         * the maximum numebr of items to load at a time
         * @type {Observable.<number>}
         * @readonly
         */
        this.limit = new Observable(10);
        /**
         * the actual list of items
         * @type {ArrayListenerOf.<import("/js/app/progress_bars/progress_bar.js").ProgressBar>}
         * @readonly
         */
        this.items = newArrayListenerOf([]);
        /**
         * the sort for pagination id we've loaded a page and there is either a next or a previous page
         * @type {import("/js/app/progress_bars/progress_bar_sort.js").ProgressBarSort}
         * @private
         */
        this.nextPageSort = null;
        /**
         * if there is a next page; this does not sue listeners but does set its value
         * @type {Observable.<boolean>}
         * @readonly
         */
        this.hasNextPage = new Observable(false);
        /**
         * and internal counter to keep track of how many requests we've sent out
         * to avoid issues with interweaving requests
         * @type {number}
         * @private
         */
        this.requestCounter = 0;
        this.filters.addListener(this.reload.bind(this));
        this.sort.addListener(this.reload.bind(this));
        this.reload();
    }
    async load(filter, sort, limit, id) {
        if (this.requestCounter !== id) {
            return;
        }
        const response = await fetch(
            apiUrl("/api/1/progress_bars/search"),
            AuthHelper.auth({
                method: "POST",
                headers: { "content-type": "application/json; charset=UTF-8" },
                body: JSON.stringify({
                    filters: progressBarFiltersToApi(filter),
                    sort,
                    limit
                })
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
         * @type {Array.<import("/js/app/progress_bars/progress_bar.js").ProgressBar>}
         */
        let newItems = [];
        for (let item of data.items) {
            newItems.push(parseProgressBar(item));
        }
        this.items.splice(this.items.get().length, 0, ...newItems);
    }
    /**
     * loads the first page matching the current sort filters
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
}
