import { parseProgressBarStep } from "/js/app/progress_bars/steps/progress_bar_step.js";
import { newProgressBarStepFilters, progressBarStepFiltersToApi } from "/js/app/progress_bars/steps/progress_bar_step_filters.js";
import { PBAR_NAME_ALPHABETICAL_AZ } from "/js/app/progress_bars/steps/progress_bar_step_sort.js";
import { sortHasAfter } from "/js/app/resources/sort_item.js";
import { AuthHelper } from "/js/auth_helper.js";
import { apiUrl } from "/js/fetch_helper.js";
import { Observable } from "/js/lib/observable.js";
import { ArrayListenerOf, newArrayListenerOf } from "/js/lib/replica_listener.js";

/**
 * loads progress bar steps matching the given filters and sorts with the option
 * to get the next page; automatically resets if the filters or sorts change
 */
export class ProgressBarStepReader {
    /**
     * creates a new reader with the default filter and sorts
     */
    constructor() {
        /**
         * the filters for the list of items
         * @type {Observable.<import("/js/app/progress_bars/steps/progress_bar_step_filters.js").ProgressBarStepFilters>}
         * @readonly
         */
        this.filters = new Observable(newProgressBarStepFilters({}));
        /**
         * the sort for the list of items
         * @type {Observable.<import("/js/app/progress_bars/steps/progress_bar_step_sort.js").ProgressBarStepSort>}
         * @readonly
         */
        this.sort = new Observable(PBAR_NAME_ALPHABETICAL_AZ);
        /**
         * the maximum number of items to load at a time
         * @type {Observable.<number>}
         * @readonly
         */
        this.limit = new Observable(10);
        /**
         * the actual list of items
         * @type {ArrayListenerOf.<import("/js/app/progress_bars/steps/progress_bar_step.js").ProgressBarStep>}
         * @readonly
         */
        this.items = newArrayListenerOf([]);
        /**
         * the sort for pagination if we've loaded a page and there is either a next or previous page
         * @type {import("/js/app/progress_bars/steps/progress_bar_step_sort.js").ProgressBarStepSort}
         * @private
         */
        this.nextPageSort = null;
        /**
         * if there is a next page; this does not use listeners but does set its value
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
        this.reload();
    }
    /**
     * updates the items to match the result from the given filter and sort so long as
     * the request counter matched the id throughout the entire process
     * @param {import("/js/app/progress_bars/steps/progress_bar_step_filters.js").ProgressBarStepFilters} filter 
     *   the filter to use
     * @param {import("/js/app/progress_bars/steps/progress_bar_step_sort.js").ProgressBarStepSort} sort 
     *   the sort ot use
     * @param {number} limit the maximum number of results to load
     * @param {number} id the value of the request counter for this request
     * @returns {Promise.<Array.<import("/js/app/progress_bars/steps/progress_bar_step.js").ProgressBarStep>>} a promise which resolves when the request is complete or is aborted
     * @private
     */
    async load(filter, sort, limit, id) {
        if (this.requestCounter !== id) {
            return;
        }
        const response = await fetch(
            apiUrl("/api/1/progress_bars/steps/search"),
            AuthHelper.auth({
                method: "POST",
                headers: { "content-type": "application/json; charset=UTF-8" },
                body: JSON.stringify({
                    filters: progressBarStepFiltersToApi(filter),
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
         * @type {Array.<import("/js/app/progress_bars/steps/progress_bar_step.js").ProgressBarStep>}
         */
        let newItems = [];
        for (let item of data.items) {
            newItems.push(parseProgressBarStep(item));
        }
        return newItems;
    }
    /**
     * loads the first page matching the current sort filters
     * @returns {Promise.<any>} resolves when the request is completed or aborted
     */
    async reload() {
        const id = ++this.requestCounter;
        const newItems = await this.load(this.filters.value, this.sort.value, this.limit.value, id);
        if (newItems !== null && newItems !== undefined) {
            this.items.set(newItems);
        }
    }

    /**
     * loads the next page; returns a rejected promise if there is no next page
     * @returns {Promise.<any>} resolves when the request id completed or aborted
     */
    async loadNext() {
        const id = ++this.requestCounter;
        const newItems = await this.load(this.filters.value, this.nextPageSort, this.limit.value, id);
        if (newItems !== null && newItems !== undefined) {
            this.items.splice(newItems.length, 0, ...newItems);
        }
    }
}
