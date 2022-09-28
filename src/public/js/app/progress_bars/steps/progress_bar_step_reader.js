import { parseProgressBarStep } from "/js/app/progress_bars/steps/progress_bar_step.js";
import {
    newProgressBarStepFilters,
    progressBarStepFiltersToApi,
} from "/js/app/progress_bars/steps/progress_bar_step_filters.js";
import { SORT_OPTIONS } from "/js/app/progress_bars/steps/progress_bar_step_sort.js";
import { sortHasAfter } from "/js/app/resources/sort_item.js";
import { AuthHelper } from "/js/auth_helper.js";
import { debounce } from "/js/debounce.js";
import { apiUrl } from "/js/fetch_helper.js";
import { Observable } from "/js/lib/observable.js";
import { ArrayListenerOf, newArrayListenerOf } from "/js/lib/replica_listener.js";
import { PERSISTERS } from "/js/persist_utils.js";
import { filterToTerm, termToFilter } from "/js/search_utils.js";

/**
 * loads progress bar steps matching the given filters and sorts with the option
 * to get the next page; automatically resets if the filters or sorts change
 */
export class ProgressBarStepReader {
    /**
     * creates a new reader with the default filter and sorts
     * @param {object} [kwargs] keyword arguments
     * @param {number} [kwargs.debounceMs=1] the number of milliseconds to debounce
     *   reload requests; null to disable debouncing (runs synchronously), 0 to
     *   run as soon as js yields, higher numbers to delay
     * @param {"query" | "notPersisted"} [kwargs.persist = "notPersisted"] if set, where to persist the reader's state
     */
    constructor(kwargs) {
        kwargs = Object.assign({ debounceMs: 1, persist: "notPersisted" }, kwargs);
        /**
         * the number of milliseconds to debounce reload requests; null to disable debouncing
         * @type {number}
         * @readonly
         */
        this.debounceMs = kwargs.debounceMs;
        /**
         * the persister for the state
         * @type {import("/js/persist_utils.js").Persister}
         * @private
         */
        this.persister = PERSISTERS[kwargs.persist];
        const initialState = this.persister.retrieve("progress-bar-step", {
            pbarName: null,
            stepName: null,
            sort: "0",
        });
        /**
         * the filters for the list of items
         * @type {Observable.<import("/js/app/progress_bars/steps/progress_bar_step_filters.js").ProgressBarStepFilters>}
         * @readonly
         */
        this.filters = new Observable(
            newProgressBarStepFilters({
                progressBarName:
                    initialState.pbarName === null ? null : { operator: "eq", value: initialState.pbarName },
                name: termToFilter(initialState.stepName),
            })
        );
        /**
         * the sort for the list of items
         * @type {Observable.<import("/js/app/progress_bars/steps/progress_bar_step_sort.js").ProgressBarStepSort>}
         * @readonly
         */
        this.sort = new Observable(SORT_OPTIONS[parseInt(initialState.sort)].val);
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
        const reloadAfterDebounce = debounce(this.reload.bind(this), this.debounceMs);
        this.filters.addListener(reloadAfterDebounce);
        this.sort.addListener(reloadAfterDebounce);
        this.filters.addListener(this.persist.bind(this));
        this.sort.addListener(this.persist.bind(this));
        reloadAfterDebounce();
    }
    /**
     * updates the items to match the result from the given filter and sort so long as
     * the request counter matches the id throughout the entire process
     * @param {import("/js/app/progress_bars/steps/progress_bar_step_filters.js").ProgressBarStepFilters} filter
     *   the filter to use
     * @param {import("/js/app/progress_bars/steps/progress_bar_step_sort.js").ProgressBarStepSort} sort
     *   the sort to use
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
     * @returns {Promise.<any>} resolves when the request is completed or aborted
     */
    async loadNext() {
        const id = ++this.requestCounter;
        const newItems = await this.load(this.filters.value, this.nextPageSort, this.limit.value, id);
        if (newItems !== null && newItems !== undefined) {
            this.items.splice(newItems.length, 0, ...newItems);
        }
    }
    /**
     * persists the current state of the reader
     * @private
     */
    persist() {
        this.persister.store("progress-bar-step", {
            pbarName: this.filters.value.progressBarName === null ? null : this.filters.value.progressBarName.value,
            stepName: filterToTerm(this.filters.value.name),
            sort: SORT_OPTIONS.findIndex((option) => option.val === this.sort.value).toString(),
        });
    }
}
