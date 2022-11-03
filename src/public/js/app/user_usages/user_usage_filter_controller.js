import { FormGroup } from "/js/app/resources/form_group.js";
import { SORT_OPTIONS } from "/js/app/user_usages/user_usage_sort.js";
import { Observable } from "/js/lib/observable.js";

export class UserUsageFilterController {
    /**
     *
     * @param {import("/js/app/user_usages/user_usage_filters.js").UserUsageFilters} filters
     * @param {import("/js/app/user_usages/user_usage_sort.js").UserUsageSort} sort
     */
    constructor(filters, sort) {
        /**
         * the element this view is attached to
         * @type {Element}
         */
        this.element = document.createElement("div");
        /**
         * the filters to show and allow editing of
         * @type {Observable.<import("/js/app/user_usages/user_usage_filters.js").UserUsageFilters>}
         * @readonly
         */
        this.filters = new Observable(filters);
        /**
         * the sort to show and allow editing of
         * @type {Observable.<import("/js/app/user_usages/user_usage_sort.js").UserUsageSort>}
         * @readonly
         */
        this.sort = new Observable(sort);
        this.render();
    }
    /**
     * Adds the appropriate contents to the element for this view. Should
     * only be called once
     * @private
     */
    render() {
        this.element.classList.add("user-usage-filters-controller", "elevation-medium");
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
