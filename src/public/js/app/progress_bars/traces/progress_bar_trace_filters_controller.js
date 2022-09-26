import { ProgressBarReader } from "/js/app/progress_bars/progress_bar_reader.js";
import { SORT_OPTIONS } from "/js/app/progress_bars/traces/progress_bar_trace_sort.js";
import { FormGroup } from "/js/app/resources/form_group.js";
import { SearchController } from "/js/app/resources/search_controller.js";
import { Observable } from "/js/lib/observable.js";

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
    render() {
        this.element.classList.add("progress-bar-trace-filters-controller", "elevation-medium");
        this.element.appendChild(new FormGroup((() => {
            const searchController = new SearchController(
                "name",
                new ProgressBarReader(),
                (f) => f.name,
                (f, v) => Object.assign({}, f, { name: v })
            );
            searchController.value.addListener((progressBar) => {
                if (progressBar !== null) {
                    this.filters.value = Object.assign(
                        {},
                        this.filters.value,
                        {
                            progressBarName: { operator: "eq", value: progressBar.get("name") }
                        }
                    );
                } else if (this.filters.value.progressBarName !== null) {
                    this.filters.value = Object.assign(
                        {},
                        this.filters.value,
                        {
                            progressBarName: null
                        }
                    );
                }
            });
            return searchController.element;
        })(), "Progress Bar").element);
        this.element.appendChild(new FormGroup((() => {
            const select = document.createElement("select");
            for (let sortOption of SORT_OPTIONS) {
                select.appendChild((() => {
                    const option = document.createElement("option");
                    option.value = sortOption.name;
                    option.textContent = sortOption.name;
                    return option;
                })());
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
        })(), "sort").element);
    }
}
