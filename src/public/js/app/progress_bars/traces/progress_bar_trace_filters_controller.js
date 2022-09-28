import { parseProgressBar } from "/js/app/progress_bars/progress_bar.js";
import { ProgressBarReader } from "/js/app/progress_bars/progress_bar_reader.js";
import { SORT_OPTIONS } from "/js/app/progress_bars/traces/progress_bar_trace_sort.js";
import { FormGroup } from "/js/app/resources/form_group.js";
import { SearchController } from "/js/app/resources/search_controller.js";
import { AuthHelper } from "/js/auth_helper.js";
import { apiUrl } from "/js/fetch_helper.js";
import { Observable } from "/js/lib/observable.js";

/**
 * responsible for showing and allowing the user to edit the progress bar trace filters and sort
 */
export class ProgressBarTraceFiltersController {
    /**
     *
     * @param {import("/js/app/progress_bars/traces/progress_bar_trace_filters.js").ProgressBarTraceFilters} filters
     *   the filters to show and allow editing of
     * @param {import("/js/app/progress_bars/traces/progress_bar_trace_sort.js").ProgressBarTraceSort} sort
     *   the sort to show and allow editing of
     */
    constructor(filters, sort) {
        /**
         * the element this view is attached to
         * @type {Element}
         * @readonly
         */
        this.element = document.createElement("div");
        /**
         * the filters to show and allow editing of
         * @type {Observable.<import("/js/app/progress_bars/traces/progress_bar_trace_filters.js").ProgressBarTraceFilters>}
         * @readonly
         */
        this.filters = new Observable(filters);
        /**
         * the sort to show and allow editing of
         *  @type {Observable.<import("/js/app/progress_bars/traces/progress_bar_trace_sort.js").ProgressBarTraceSort>}
         * @readonly
         */
        this.sort = new Observable(sort);
        this.render();
    }
    /**
     * adds the appropriate contents to the element for thsi view. Should
     * only be called once
     * @private
     */
    render() {
        this.element.classList.add("progress-bar-trace-filters-controller", "elevation-medium");
        this.element.appendChild(
            new FormGroup(
                (() => {
                    const searchController = new SearchController(
                        "name",
                        new ProgressBarReader(),
                        (f) => f.name,
                        (f, v) => Object.assign({}, f, { name: v })
                    );
                    searchController.value.addListener((progressBar) => {
                        if (progressBar !== null) {
                            if (
                                this.filters.value.progressBarName === null ||
                                this.filters.value.progressBarName.value !== progressBar.get("name")
                            ) {
                                this.filters.value = Object.assign({}, this.filters.value, {
                                    progressBarName: { operator: "eq", value: progressBar.get("name") },
                                });
                            }
                        } else if (this.filters.value.progressBarName !== null) {
                            this.filters.value = Object.assign({}, this.filters.value, {
                                progressBarName: null,
                            });
                        }
                    });
                    let requestCounter = 0;
                    this.filters.addListenerAndInvoke(async (filters) => {
                        if (filters.progressBarName !== null) {
                            if (
                                searchController.value.value === null ||
                                searchController.value.value.get("name") !== filters.progressBarName.value
                            ) {
                                const currentRequest = ++requestCounter;
                                const response = await fetch(
                                    apiUrl("/api/1/progress_bars/search"),
                                    AuthHelper.auth({
                                        method: "POST",
                                        headers: { "content-type": "application/json; charset=UTF-8" },
                                        body: JSON.stringify({
                                            filters: { name: filters.progressBarName },
                                            limit: 1,
                                        }),
                                    })
                                );
                                if (currentRequest !== requestCounter) {
                                    return;
                                }
                                if (!response.ok) {
                                    throw response;
                                }
                                const json = await response.json();
                                if (json.items.length === 0) {
                                    return;
                                }
                                if (currentRequest !== requestCounter) {
                                    return;
                                }
                                searchController.value.value = parseProgressBar(json.items[0]);
                            }
                        }
                    });
                    return searchController.element;
                })(),
                "Progress Bar"
            ).element
        );
        this.element.appendChild(
            new FormGroup(
                (() => {
                    const select = document.createElement("select");
                    for (let sortOption of SORT_OPTIONS) {
                        select.appendChild(
                            (() => {
                                const option = document.createElement("option");
                                option.value = sortOption.name;
                                option.textContent = sortOption.name;
                                return option;
                            })()
                        );
                    }
                    this.sort.addListenerAndInvoke((sort) => {
                        const sortOption = SORT_OPTIONS.find((opt) => opt.val === sort);
                        select.value = sortOption.name;
                    });
                    select.addEventListener("change", (e) => {
                        const sortOption = SORT_OPTIONS.find((opt) => opt.name === select.value);
                        this.sort.value = sortOption.val;
                    });
                    return select;
                })(),
                "sort"
            ).element
        );
    }
}
