import { ProgressBarReader } from "/js/app/progress_bars/progress_bar_reader.js";
import { ProgressBarStepReader } from "/js/app/progress_bars/steps/progress_bar_step_reader.js";
import { POSITION_LAST_TO_FIRST } from "/js/app/progress_bars/steps/progress_bar_step_sort.js";
import { Collapse } from "/js/app/resources/collapse.js";
import { FormGroup } from "/js/app/resources/form_group.js";
import { SearchController } from "/js/app/resources/search_controller.js";
import { fromDateTimeLocalInputToDate } from "/js/date_utils.js";
import { Observable } from "/js/lib/observable.js";
import { simpleArrayListener } from "/js/lib/replica_listener.js";
import { shallowCompare } from "/js/object_utils.js";

/**
 * Shows a view where the user can manipulate the progress bar trace step
 * filters and sort options.
 */
export class ProgressBarTraceStepFiltersController {
    /**
     * @param {import("/js/app/progress_bars/traces/steps/progress_bar_trace_step_filters.js").ProgressBarTraceStepFilters} filters
     *   the initial filters
     * @param {import("/js/app/progress_bars/traces/steps/progress_bar_trace_step_sort.js").ProgressBarTraceStepSort} sort
     *   the initial sort
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
         * @type {Observable.<import("/js/app/progress_bars/traces/steps/progress_bar_trace_step_filters.js").ProgressBarTraceStepFilters>}
         * @readonly
         */
        this.filters = new Observable(filters);
        /**
         * the sort to show and allow editing of
         * @type {Observable.<import("/js/app/progress_bars/traces/steps/progress_bar_trace_step_sort.js").ProgressBarTraceStepSort>}
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
        this.element.classList.add("progress-bar-trace-step-filters-controller", "elevation-medium");
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
                            this.filters.value = Object.assign({}, this.filters.value, {
                                progressBarName: {
                                    operator: "eq",
                                    value: progressBar.get("name"),
                                },
                            });
                        } else if (this.filters.value.progressBarName !== null) {
                            this.filters.value = Object.assign({}, this.filters.value, {
                                progressBarName: null,
                            });
                        }
                    });
                    return searchController.element;
                })(),
                "Progress Bar"
            ).element
        );
        this.element.appendChild(
            (() => {
                const collapse = new Collapse(
                    new FormGroup(
                        (() => {
                            const reader = new ProgressBarStepReader();
                            reader.filters.value = Object.assign({}, reader.filters.value, {
                                position: {
                                    operator: "neq",
                                    value: 0,
                                },
                            });
                            const searchController = new SearchController(
                                "name",
                                reader,
                                (f) => f.name,
                                (f, v) => Object.assign({}, f, { name: v })
                            );
                            searchController.value.addListener((progressBarStep) => {
                                if (progressBarStep !== null) {
                                    this.filters.value = Object.assign({}, this.filters.value, {
                                        progressBarStepName: {
                                            operator: "eq",
                                            value: progressBarStep.get("name"),
                                        },
                                    });
                                } else if (this.filters.value.progressBarStepName !== null) {
                                    this.filters.value = Object.assign({}, this.filters.value, {
                                        progressBarStepName: null,
                                    });
                                }
                            });
                            this.filters.addListener((filters) => {
                                if (filters.progressBarName === null) {
                                    if (reader.filters.value.progressBarName !== null) {
                                        reader.filters.value = Object.assign({}, reader.filters.value, {
                                            progressBarName: null,
                                        });
                                    }
                                } else if (
                                    !shallowCompare(reader.filters.value.progressBarName, filters.progressBarName)
                                ) {
                                    reader.filters.value = Object.assign({}, reader.filters.value, {
                                        progressBarName: Object.assign({}, filters.progressBarName),
                                    });
                                }
                            });
                            return searchController.element;
                        })(),
                        "Step"
                    ).element,
                    {
                        visible:
                            this.filters.value.progressBarName !== null &&
                            this.filters.value.progressBarStepPosition === null,
                    }
                );
                this.filters.addListener((filters) => {
                    collapse.visible.value =
                        filters.progressBarName !== null && this.filters.value.progressBarStepPosition === null;
                });
                return collapse.element;
            })()
        );
        this.element.appendChild(
            (() => {
                const collapse = new Collapse(
                    new FormGroup(
                        (() => {
                            const input = document.createElement("input");
                            input.type = "number";
                            input.min = "1";
                            /** @type {function() : any} */
                            const onChange = (() => {
                                if (
                                    (collapse !== undefined && !collapse.visible.value) ||
                                    isNaN(input.valueAsNumber) ||
                                    !input.validity.valid
                                ) {
                                    if (this.filters.value.progressBarStepPosition !== null) {
                                        this.filters.value = Object.assign({}, this.filters.value, {
                                            progressBarStepPosition: null,
                                        });
                                    }
                                } else {
                                    const correctFilter = {
                                        operator: "eq",
                                        value: input.valueAsNumber,
                                    };
                                    if (!shallowCompare(this.filters.value.progressBarStepPosition, correctFilter)) {
                                        this.filters.value = Object.assign({}, this.filters.value, {
                                            progressBarStepPosition: correctFilter,
                                        });
                                    }
                                }
                            }).bind(this);
                            input.addEventListener("change", onChange);
                            input.addEventListener("keyup", onChange);
                            // collapse hasn't finished being created yet
                            setTimeout(() => {
                                collapse.visible.addListener(onChange);
                            }, 10);

                            const reader = new ProgressBarStepReader();
                            this.filters.addListenerAndInvoke((filters) => {
                                if (filters.progressBarName === null) {
                                    if (reader.filters.value.progressBarName !== null) {
                                        reader.filters.value = Object.assign({}, reader.filters.value, {
                                            progressBarName: null,
                                        });
                                    }
                                } else if (
                                    !shallowCompare(reader.filters.value.progressBarName, filters.progressBarName)
                                ) {
                                    reader.filters.value = Object.assign({}, reader.filters.value, {
                                        progressBarName: Object.assign({}, filters.progressBarName),
                                    });
                                }
                            });
                            reader.sort.value = POSITION_LAST_TO_FIRST;
                            reader.limit.value = 1;
                            reader.items.addListenerAndInvoke((items) => {
                                let newMax = 1;
                                if (items.length > 0) {
                                    newMax = items[0].get("position");
                                }

                                input.max = newMax.toString();
                                if (!isNaN(input.valueAsNumber) && input.valueAsNumber > newMax) {
                                    input.valueAsNumber = newMax;
                                    onChange();
                                }
                            });
                            return input;
                        })(),
                        "Step Position"
                    ).element,
                    {
                        visible:
                            this.filters.value.progressBarName !== null &&
                            this.filters.value.progressBarStepName === null,
                    }
                );
                this.filters.addListener((filters) => {
                    collapse.visible.value =
                        filters.progressBarName !== null && this.filters.value.progressBarStepName === null;
                });

                return collapse.element;
            })()
        );
        this.element.appendChild(
            new FormGroup(
                (() => {
                    const input = document.createElement("input");
                    input.type = "number";
                    /** @type {function() : any} */
                    const onChange = (() => {
                        if (isNaN(input.valueAsNumber) || !input.validity.valid) {
                            if (this.filters.value.iterations !== null) {
                                this.filters.value = Object.assign({}, this.filters.value, {
                                    iterations: null,
                                });
                            }
                        } else {
                            this.filters.value = Object.assign({}, this.filters.value, {
                                iterations: {
                                    operator: "eq",
                                    value: input.valueAsNumber,
                                },
                            });
                        }
                    }).bind(this);
                    input.addEventListener("change", onChange);
                    input.addEventListener("keyup", onChange);
                    return input;
                })(),
                "Iterations"
            ).element
        );
        this.element.appendChild(
            new FormGroup(
                (() => {
                    const input = document.createElement("input");
                    input.type = "datetime-local";
                    /** @type {function() : any} */
                    const onChange = (() => {
                        if (isNaN(input.valueAsNumber) || !input.validity.valid) {
                            if (this.filters.value.finishedAt !== null) {
                                this.filters.value = Object.assign({}, this.filters.value, {
                                    finishedAt: null,
                                });
                            }
                        } else {
                            this.filters.value = Object.assign({}, this.filters.value, {
                                finishedAt: {
                                    operator: "gte",
                                    value: fromDateTimeLocalInputToDate(input.valueAsNumber),
                                },
                            });
                        }
                    }).bind(this);
                    input.addEventListener("change", onChange);
                    input.addEventListener("keyup", onChange);
                    return input;
                })(),
                "Finished After"
            ).element
        );
    }
}
