import { parseProgressBarTraceStep } from "/js/app/progress_bars/traces/steps/progress_bar_trace_step.js";
import {
    newProgressBarTraceStepFilters,
    progressBarTraceStepFiltersToApi,
} from "/js/app/progress_bars/traces/steps/progress_bar_trace_step_filters.js";
import {
    FINISHED_AT_NEWEST_TO_OLDEST,
    SORT_OPTIONS,
} from "/js/app/progress_bars/traces/steps/progress_bar_trace_step_sort.js";
import { sortHasAfter } from "/js/app/resources/sort_item.js";
import { AuthHelper } from "/js/auth_helper.js";
import { apiUrl } from "/js/fetch_helper.js";
import { Observable } from "/js/lib/observable.js";
import { ArrayListenerOf, newArrayListenerOf } from "/js/lib/replica_listener.js";
import { PERSISTERS } from "/js/persist_utils.js";

/**
 * loads progress bar trace steps matching the given filters and sorts with the option
 * to load more; automatically resets if the filters or sorts change
 */
export class ProgressBarTraceStepReader {
    /**
     * creates a new reader with the default filter and sort
     * @param {object} kwargs the keyword arguments
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
        const initialState = this.persister.retrieve("progress-bar-trace-step", {
            pbarName: null,
            stepName: null,
            position: null,
            iterations: null,
            // in seconds since the unix epoch
            finishedAfter: null,
            sort: "0",
        });
        /**
         * the filters for the list of items
         * @type {Observable.<import("/js/app/progress_bars/traces/steps/progress_bar_trace_step_filters.js").ProgressBarTraceStepFilters>}
         * @readonly
         */
        this.filters = new Observable(
            newProgressBarTraceStepFilters({
                progressBarName:
                    initialState.pbarName === null ? null : { operator: "eq", value: initialState.pbarName },
                progressBarStepName:
                    initialState.stepName === null ? null : { operator: "eq", value: initialState.stepName },
                progressBarStepPosition:
                    initialState.position === null ? null : { operator: "eq", value: parseInt(initialState.position) },
                iterations:
                    initialState.iterations === null
                        ? null
                        : { operator: "eq", value: parseInt(initialState.iterations) },
                finishedAt:
                    initialState.finishedAfter === null
                        ? null
                        : { operator: "eq", value: new Date(parseFloat(initialState.finishedAfter) * 1000) },
            })
        );
        /**
         * the sort for the list of items
         * @type {Observable.<import("/js/app/progress_bars/traces/steps/progress_bar_trace_step_sort.js").ProgressBarTraceStepSort>}
         */
        this.sort = new Observable(SORT_OPTIONS[parseInt(initialState.sort)].val);
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
        this.filters.addListener(this.persist.bind(this));
        this.sort.addListener(this.persist.bind(this));
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
    /**
     * persists the current state of the reader
     * @private
     */
    persist() {
        this.persister.store("progress-bar-trace-step", {
            pbarName: this.filters.value.progressBarName === null ? null : this.filters.value.progressBarName.value,
            stepName:
                this.filters.value.progressBarStepName === null ? null : this.filters.value.progressBarStepName.value,
            position:
                this.filters.value.progressBarStepPosition === null
                    ? null
                    : this.filters.value.progressBarStepPosition.value.toString(),
            iterations: this.filters.value.iterations === null ? null : this.filters.value.iterations.value.toString(),
            finishedAfter:
                this.filters.value.finishedAt === null
                    ? null
                    : (this.filters.value.finishedAt.value.getTime() / 1000).toString(),
            sort: SORT_OPTIONS.findIndex((option) => option.val === this.sort.value).toString(),
        });
    }
}
