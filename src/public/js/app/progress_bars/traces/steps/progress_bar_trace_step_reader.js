import { parseProgressBarTraceStep } from "/js/app/progress_bars/traces/steps/progress_bar_trace_step.js";
import {
    newProgressBarTraceStepFilters,
    progressBarTraceStepFiltersToApi,
} from "/js/app/progress_bars/traces/steps/progress_bar_trace_step_filters.js";
import { FINISHED_AT_NEWEST_TO_OLDEST } from "/js/app/progress_bars/traces/steps/progress_bar_trace_step_sort.js";
import { sortHasAfter } from "/js/app/resources/sort_item.js";
import { AuthHelper } from "/js/auth_helper.js";
import { apiUrl } from "/js/fetch_helper.js";
import { Observable } from "/js/lib/observable.js";
import { ArrayListenerOf, newArrayListenerOf } from "/js/lib/replica_listener.js";

/**
 * loads progress bar trace steps matching the given filters and sorts with the option
 * to load more; automatically resets if the filters or sorts change
 */
export class ProgressBarTraceStepReader {
    /**
     * creates a new reader with the default filter and sort
     */
    constructor() {
        /**
         * the filters for the list of items
         * @type {Observable.<import("/js/app/progress_bars/traces/steps/progress_bar_trace_step_filters.js").ProgressBarTraceStepFilters>}
         * @readonly
         */
        this.filters = new Observable(newProgressBarTraceStepFilters({}));
        /**
         * the sort for the list of items
         * @type {Observable.<import("/js/app/progress_bars/traces/steps/progress_bar_trace_step_sort.js").ProgressBarTraceStepSort>}
         */
        this.sort = new Observable(FINISHED_AT_NEWEST_TO_OLDEST);
        /**
         * the maximum number of items to load
         * @type {Observable.<number>}
         * @readonly
         */
        this.limit = new Observable(10);
        /**
         * the actual list of items
         * @type {ArrayListenerOf.<import("/js/app/progress_bars/traces/steps/progress_bar_trace_step.js").ProgressBarTraceStep>}
         * @readonly
         */
        this.items = newArrayListenerOf([]);
        /**
         * the sort for pagination if we've loaded a pag3e and there is either a next or previous page
         * @type {import("/js/app/progress_bars/traces/steps/progress_bar_trace_step_sort.js").ProgressBarTraceStepSort}
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
     * updates the items to match the result from the given filter and sort so
     * long as the request counter matched the id throughout the entire process
     * @param {import("/js/app/progress_bars/traces/steps/progress_bar_trace_step_filters.js").ProgressBarTraceStepFilters} filter
     *   the filter to use
     * @param {import("/js/app/progress_bars/traces/steps/progress_bar_trace_step_sort.js").ProgressBarTraceStepSort} sort
     *   the sort ot use
     * @param {number} limit the maximum number of results to load
     * @param {number} id the value of the request counter for this request
     * @returns {Promise.<Array.<import("/js/app/progress_bars/traces/steps/progress_bar_trace_step.js").ProgressBarTraceStep>>} a promise which resolves when the request is complete or is aborted
     * @private
     */
    async load(filter, sort, limit, id) {
        if (this.requestCounter !== id) {
            return;
        }
        const response = await fetch(
            apiUrl("/api/1/progress_bars/traces/steps/search"),
            AuthHelper.auth({
                method: "POST",
                headers: { "content-type": "application/json; charset=UTF-8" },
                body: JSON.stringify({
                    filters: progressBarTraceStepFiltersToApi(filter),
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
         * @type {Array.<import("/js/app/progress_bars/traces/steps/progress_bar_trace_step.js").ProgressBarTraceStep>}
         */
        let newItems = [];
        for (let item of data.items) {
            newItems.push(parseProgressBarTraceStep(item));
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
}
