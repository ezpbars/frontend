import { SORT_OPTIONS } from "/js/app/progress_bars/progress_bar_sort.js";
import { FormGroup } from "/js/app/resources/form_group.js";
import { Observable } from "/js/lib/observable.js";

export class ProgressBarFilterController {
    /**
     * 
     * @param {import("/js/app/progress_bars/progress_bar_filters.js").ProgressBarFilters} filters 
     * @param {import("/js/app/progress_bars/progress_bar_sort.js").ProgressBarSort} sort 
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
         * @type {Observable.<import("/js/app/progress_bars/progress_bar_filters.js").ProgressBarFilters}
         * @readonly
         */
        this.filters = new Observable(filters);
        /**
         * the sort to show and allow editing of
         * @type {Observable.<import("/js/app/progress_bars/progress_bar_sort.js").ProgressBarSort}
         * @readonly
         */
        this.sort = new Observable(sort);
        this.render();
    }
    render() {
        this.element.classList.add("progress-bar-filters-controller", "elevation-medium");
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
