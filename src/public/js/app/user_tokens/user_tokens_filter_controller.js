import { FormGroup } from "/js/app/resources/form_group.js";
import { SORT_OPTIONS } from "/js/app/user_tokens/user_token_sort.js";
import { Observable } from "/js/lib/observable.js";

/**
 * responsible for showing and allowing the user to edit the user token filters object
 */
export class UserTokensFilterController {
    /**
     *
     * @param {import("/js/app/user_tokens/user_token_filters.js").UserTokenFilters} filters
     *   the filters to show and allow editing of
     * @param {import("/js/app/user_tokens/user_token_sort.js").UserTokenSort} sort
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
         * @type {Observable.<import("/js/app/user_tokens/user_token_filters.js").UserTokenFilters>}
         */
        this.filters = new Observable(filters);
        /**
         * the sort to show and allow editing of
         * @type {Observable.<import("/js/app/user_tokens/user_token_sort.js").UserTokenSort>}
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
        this.element.classList.add("user-tokens-filters-controller", "elevation-medium");
        this.element.appendChild(
            new FormGroup(
                (() => {
                    const input = document.createElement("input");
                    input.type = "checkbox";
                    input.name = "include-expired";
                    this.filters.addListenerAndInvoke((filters) => {
                        input.checked = filters.expiresAt === null;
                    });
                    input.addEventListener("change", (e) => {
                        if (!input.checked) {
                            this.filters.value = Object.assign({}, this.filters.value, {
                                expiresAt: { operator: "gtn", value: new Date() },
                            });
                        } else {
                            this.filters.value = Object.assign({}, this.filters.value, {
                                expiresAt: null,
                            });
                        }
                    });
                    return input;
                })(),
                "Include expired tokens"
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
