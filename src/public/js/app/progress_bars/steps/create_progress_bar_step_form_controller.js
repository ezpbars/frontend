import { ProgressBarReader } from "/js/app/progress_bars/progress_bar_reader.js";
import {
    ITERATED_TECHNIQUE_NATIVE_TO_API,
    ONE_OFF_TECHNIQUE_NATIVE_TO_API,
    parseProgressBarStep,
} from "/js/app/progress_bars/steps/progress_bar_step.js";
import { Collapse } from "/js/app/resources/collapse.js";
import { FormGroup } from "/js/app/resources/form_group.js";
import { SearchController } from "/js/app/resources/search_controller.js";
import { AuthHelper } from "/js/auth_helper.js";
import { apiUrl } from "/js/fetch_helper.js";
import { Observable } from "/js/lib/observable.js";

export class CreateProgressBarStepFormController {
    /**
     *
     * @param {function(import("/js/app/progress_bars/steps/progress_bar_step.js").ProgressBarStep) : any} onCreated the function to call when the form is sumbitted
     */
    constructor(onCreated) {
        /**
         * the element this funciton is attached to
         * @type {Element}
         * @readonly
         */
        this.element = document.createElement("div");
        /**
         * the funtion to call after the form is submitted
         * @type {function(import("/js/app/progress_bars/steps/progress_bar_step.js").ProgressBarStep) : any}
         */
        this.onCreated = onCreated;
        this.render();
    }
    /**
     * Adds the appropriate contents to the element for this view. Should
     * only be called once
     * @private
     */
    render() {
        this.element.textContent = "";
        this.element.classList.add("elevation-medium");
        this.element.appendChild(
            (() => {
                const form = document.createElement("form");
                form.classList.add("progress-bar-step-create-form");
                /** @type {Observable.<import("/js/app/progress_bars/progress_bar.js").ProgressBar>} */
                const progressBar = new Observable(null);
                const name = new Observable("");
                /** @type {Observable.<"already exists" | "is default">} */
                const nameError = new Observable(null);
                /** @type {Observable.<?"iterated" | "oneOff">} */
                const iterated = new Observable(null);
                /** @type {Observable.<"percentile" | "harmonicMean" | "geometricMean" | "arithmeticMean">} */
                const oneOffTechnique = new Observable("percentile");
                const oneOffPercentile = new Observable(75);
                /** @type {Observable.<"bestFit.linear" | "percentile" | "harmonicMean" | "geometricMean" | "arithmeticMean">} */
                const iteratedTechnique = new Observable("bestFit.linear");
                const iteratedPercentile = new Observable(75);
                const running = new Observable(false);
                const ok = new Observable(false);
                const updateOk = () => {
                    ok.value =
                        progressBar.value !== null &&
                        name.value !== "" &&
                        nameError.value === null &&
                        iterated.value !== null &&
                        !running.value;
                };
                progressBar.addListener(updateOk);
                name.addListener(updateOk);
                nameError.addListener(updateOk);
                iterated.addListener(updateOk);
                running.addListener(updateOk);
                const updateName = async () => {
                    const nm = name.value;
                    nameError.value = null;
                    if (nm === "default") {
                        nameError.value = "is default";
                        return;
                    }
                    if (progressBar.value === null) {
                        return;
                    }
                    const pbarName = progressBar.value.get("name");
                    const response = await fetch(
                        apiUrl("/api/1/progress_bars/steps/search"),
                        AuthHelper.auth({
                            method: "POST",
                            headers: { "content-type": "application/json; charset=UTF-8" },
                            body: JSON.stringify({
                                filters: {
                                    name: {
                                        operator: "ieq",
                                        value: nm,
                                    },
                                    progress_bar_name: {
                                        operator: "ieq",
                                        value: pbarName,
                                    },
                                },
                            }),
                        })
                    );
                    if (!response.ok) {
                        return;
                    }
                    const data = await response.json();
                    if (data.items.length === 0) {
                        return;
                    }
                    if (progressBar.value !== null && progressBar.value.get("name") === pbarName && name.value === nm) {
                        nameError.value = "already exists";
                    }
                };
                name.addListener(updateName);
                progressBar.addListener(updateName);
                form.addEventListener("submit", async (e) => {
                    e.preventDefault();
                    running.value = true;
                    try {
                        const response = await fetch(
                            apiUrl(
                                "/api/1/progress_bars/steps/?" +
                                    new URLSearchParams({
                                        pbar_name: progressBar.value.get("name"),
                                        step_name: name.value,
                                    }).toString()
                            ),
                            AuthHelper.auth({
                                method: "POST",
                                headers: { "content-type": "application/json; charset=UTF-8" },
                                body: JSON.stringify({
                                    iterated: iterated.value === "iterated",
                                    one_off_technique: ONE_OFF_TECHNIQUE_NATIVE_TO_API[oneOffTechnique.value],
                                    one_off_percentile: oneOffPercentile.value,
                                    iterated_technique: ITERATED_TECHNIQUE_NATIVE_TO_API[iteratedTechnique.value],
                                    iterated_percentile: iteratedPercentile.value,
                                }),
                            })
                        );
                        if (!response.ok) {
                            throw response;
                        }
                        const data = await response.json();
                        await this.onCreated(parseProgressBarStep(data));
                    } finally {
                        running.value = false;
                    }
                });
                form.appendChild(
                    (() => {
                        const formGroup = new FormGroup(
                            (() => {
                                const search = new SearchController(
                                    "name",
                                    new ProgressBarReader(),
                                    (f) => f.name,
                                    (f, v) => Object.assign({}, f, { name: v })
                                );
                                search.value.addListener((pbar) => {
                                    progressBar.value = pbar;
                                });
                                return search.element;
                            })(),
                            "progress bar"
                        );
                        return formGroup.element;
                    })()
                );
                form.appendChild(
                    (() => {
                        const collapse = new Collapse(
                            (() => {
                                const formGroup = new FormGroup(
                                    (() => {
                                        const input = document.createElement("input");
                                        input.type = "text";
                                        input.required = true;
                                        input.addEventListener("change", (e) => {
                                            name.value = input.value;
                                        });
                                        return input;
                                    })(),
                                    "name"
                                );
                                nameError.addListener((error) => {
                                    formGroup.error.value = error;
                                });
                                return formGroup.element;
                            })(),
                            { visible: progressBar.value !== null }
                        );
                        progressBar.addListener((progressBar) => {
                            collapse.visible.value = progressBar !== null;
                        });
                        return collapse.element;
                    })()
                );
                form.appendChild(
                    (() => {
                        const collapse = new Collapse(
                            (() => {
                                const formGroup = new FormGroup(
                                    (() => {
                                        const select = document.createElement("select");
                                        select.appendChild(
                                            (() => {
                                                const option = document.createElement("option");
                                                option.disabled = true;
                                                option.selected = true;
                                                option.hidden = true;
                                                option.value = "no value";
                                                option.textContent = "-- select an option --";
                                                return option;
                                            })()
                                        );
                                        select.appendChild(
                                            (() => {
                                                const option = document.createElement("option");
                                                option.value = "iterated";
                                                option.textContent = "Iterated";
                                                return option;
                                            })()
                                        );
                                        select.appendChild(
                                            (() => {
                                                const option = document.createElement("option");
                                                option.value = "oneOff";
                                                option.textContent = "One-off";
                                                return option;
                                            })()
                                        );
                                        select.addEventListener("change", (e) => {
                                            const s = select.value;
                                            if (s !== "iterated" && s !== "oneOff") {
                                                throw "invalid iterated";
                                            }
                                            iterated.value = s;
                                        });
                                        return select;
                                    })(),
                                    "iterated"
                                );
                                iterated.addListenerAndInvoke((iterated) => {
                                    if (iterated === null) {
                                        formGroup.help.value = null;
                                    } else if (iterated === "iterated") {
                                        formGroup.help.value =
                                            "this step is repeated, potentially a different number of times, every trace";
                                    } else {
                                        formGroup.help.value = "this step occurs exactly once per trace";
                                    }
                                });
                                return formGroup.element;
                            })(),
                            { visible: progressBar.value !== null }
                        );
                        progressBar.addListener((progressBar) => {
                            collapse.visible.value = progressBar !== null;
                        });
                        return collapse.element;
                    })()
                );
                form.appendChild(
                    (() => {
                        const collapse = new Collapse(
                            (() => {
                                const formGroup = new FormGroup(
                                    (() => {
                                        const select = document.createElement("select");
                                        select.appendChild(
                                            (() => {
                                                const option = document.createElement("option");
                                                option.value = "percentile";
                                                option.textContent = "Percentile (recommended)";
                                                option.selected = true;
                                                return option;
                                            })()
                                        );
                                        select.appendChild(
                                            (() => {
                                                const option = document.createElement("option");
                                                option.value = "harmonicMean";
                                                option.textContent = "Harmonic Mean";
                                                return option;
                                            })()
                                        );
                                        select.appendChild(
                                            (() => {
                                                const option = document.createElement("option");
                                                option.value = "geometricMean";
                                                option.textContent = "Geometric Mean";
                                                return option;
                                            })()
                                        );
                                        select.appendChild(
                                            (() => {
                                                const option = document.createElement("option");
                                                option.value = "arithmeticMean";
                                                option.textContent = "Artihmetic Mean";
                                                return option;
                                            })()
                                        );
                                        select.addEventListener("change", (e) => {
                                            const s = select.value;
                                            if (
                                                s !== "percentile" &&
                                                s !== "harmonicMean" &&
                                                s !== "geometricMean" &&
                                                s !== "arithmeticMean"
                                            ) {
                                                throw "invalid one off technique";
                                            }
                                            oneOffTechnique.value = s;
                                        });
                                        return select;
                                    })(),
                                    "one off technique"
                                );
                                const updateHelp = () => {
                                    const technique = oneOffTechnique.value;
                                    const percentile = oneOffPercentile.value;
                                    if (technique === "percentile") {
                                        formGroup.help.value = `the step completes before the estimate in ${percentile}% of requests`;
                                    } else if (technique === "harmonicMean") {
                                        formGroup.help.value = (() => {
                                            const span = document.createElement("span");
                                            span.textContent = "we estimate the ";
                                            span.appendChild(
                                                (() => {
                                                    const anchor = document.createElement("a");
                                                    anchor.href = "https://en.wikipedia.org/wiki/Harmonic_mean";
                                                    anchor.textContent = "harmonic mean";
                                                    return anchor;
                                                })()
                                            );
                                            span.appendChild(document.createTextNode(" of the samples"));
                                            return span;
                                        })();
                                    } else if (technique === "geometricMean") {
                                        formGroup.help.value = (() => {
                                            const span = document.createElement("span");
                                            span.textContent = "we estimate the ";
                                            span.appendChild(
                                                (() => {
                                                    const anchor = document.createElement("a");
                                                    anchor.href = "https://en.wikipedia.org/wiki/Geometric_mean";
                                                    anchor.textContent = "gemoetric mean";
                                                    return anchor;
                                                })()
                                            );
                                            span.appendChild(document.createTextNode(" of the samples"));
                                            return span;
                                        })();
                                    } else {
                                        formGroup.help.value = (() => {
                                            const span = document.createElement("span");
                                            span.textContent = "we estimate the ";
                                            span.appendChild(
                                                (() => {
                                                    const anchor = document.createElement("a");
                                                    anchor.href = "https://en.wikipedia.org/wiki/Arithmetic_mean";
                                                    anchor.textContent = "arithmetic mean";
                                                    return anchor;
                                                })()
                                            );
                                            span.appendChild(document.createTextNode(" of the samples"));
                                            return span;
                                        })();
                                    }
                                };
                                oneOffTechnique.addListener(updateHelp);
                                oneOffPercentile.addListener(updateHelp);
                                updateHelp();
                                return formGroup.element;
                            })(),
                            { visible: progressBar.value !== null && iterated.value === "oneOff" }
                        );
                        const updateVisibility = () => {
                            collapse.visible.value = progressBar.value !== null && iterated.value === "oneOff";
                        };
                        progressBar.addListener(updateVisibility);
                        iterated.addListener(updateVisibility);
                        return collapse.element;
                    })()
                );
                form.appendChild(
                    (() => {
                        const collapse = new Collapse(
                            (() => {
                                const formGroup = new FormGroup(
                                    (() => {
                                        const input = document.createElement("input");
                                        input.type = "number";
                                        input.valueAsNumber = oneOffPercentile.value;
                                        input.setAttribute("min", "0");
                                        input.setAttribute("max", "100");
                                        input.setAttribute("step", "0.1");
                                        input.addEventListener("change", (e) => {
                                            oneOffPercentile.value = input.valueAsNumber;
                                        });
                                        return input;
                                    })(),
                                    "one off percentile"
                                );
                                return formGroup.element;
                            })(),
                            {
                                visible:
                                    progressBar.value !== null &&
                                    iterated.value === "oneOff" &&
                                    oneOffTechnique.value === "percentile",
                            }
                        );
                        const updateVisibility = () => {
                            collapse.visible.value =
                                progressBar.value !== null &&
                                iterated.value === "oneOff" &&
                                oneOffTechnique.value === "percentile";
                        };
                        progressBar.addListener(updateVisibility);
                        iterated.addListener(updateVisibility);
                        oneOffTechnique.addListener(updateVisibility);
                        return collapse.element;
                    })()
                );
                form.appendChild(
                    (() => {
                        const collapse = new Collapse(
                            (() => {
                                const formGroup = new FormGroup(
                                    (() => {
                                        const select = document.createElement("select");
                                        select.appendChild(
                                            (() => {
                                                const option = document.createElement("option");
                                                option.value = "bestFit.linear";
                                                option.textContent = "Best Fit (linear) (recommended)";
                                                option.selected = true;
                                                return option;
                                            })()
                                        );
                                        select.appendChild(
                                            (() => {
                                                const option = document.createElement("option");
                                                option.value = "percentile";
                                                option.textContent = "Percentile";
                                                return option;
                                            })()
                                        );
                                        select.appendChild(
                                            (() => {
                                                const option = document.createElement("option");
                                                option.value = "harmonicMean";
                                                option.textContent = "Harmonic Mean";
                                                return option;
                                            })()
                                        );
                                        select.appendChild(
                                            (() => {
                                                const option = document.createElement("option");
                                                option.value = "geometricMean";
                                                option.textContent = "Geometric Mean";
                                                return option;
                                            })()
                                        );
                                        select.appendChild(
                                            (() => {
                                                const option = document.createElement("option");
                                                option.value = "arithmeticMean";
                                                option.textContent = "Artihmetic Mean";
                                                return option;
                                            })()
                                        );
                                        return select;
                                    })(),
                                    "iterated technique"
                                );
                                const updateHelp = () => {
                                    const technique = iteratedTechnique.value;
                                    const percentile = iteratedPercentile.value;
                                    if (technique === "bestFit.linear") {
                                        formGroup.help.value =
                                            "solves for b, m in y = mx+b where x is the numebr of iterations and y is the time the step took via least squares regression";
                                    } else if (technique === "percentile") {
                                        formGroup.help.value = `based on time per iteration, the step completes before the estimate in ${percentile}% of requests`;
                                    } else if (technique === "harmonicMean") {
                                        formGroup.help.value = (() => {
                                            const span = document.createElement("span");
                                            span.textContent = "based on time per iteration, we estimate the ";
                                            span.appendChild(
                                                (() => {
                                                    const anchor = document.createElement("a");
                                                    anchor.href = "https://en.wikipedia.org/wiki/Harmonic_mean";
                                                    anchor.textContent = "harmonic mean";
                                                    return anchor;
                                                })()
                                            );
                                            span.appendChild(document.createTextNode(" of the samples"));
                                            return span;
                                        })();
                                    } else if (technique === "geometricMean") {
                                        formGroup.help.value = (() => {
                                            const span = document.createElement("span");
                                            span.textContent = "based on time per iteration, we estimate the ";
                                            span.appendChild(
                                                (() => {
                                                    const anchor = document.createElement("a");
                                                    anchor.href = "https://en.wikipedia.org/wiki/Geometric_mean";
                                                    anchor.textContent = "gemoetric mean";
                                                    return anchor;
                                                })()
                                            );
                                            span.appendChild(document.createTextNode(" of the samples"));
                                            return span;
                                        })();
                                    } else {
                                        formGroup.help.value = (() => {
                                            const span = document.createElement("span");
                                            span.textContent = "based on time per iteration, we estimate the ";
                                            span.appendChild(
                                                (() => {
                                                    const anchor = document.createElement("a");
                                                    anchor.href = "https://en.wikipedia.org/wiki/Arithmetic_mean";
                                                    anchor.textContent = "arithmetic mean";
                                                    return anchor;
                                                })()
                                            );
                                            span.appendChild(document.createTextNode(" of the samples"));
                                            return span;
                                        })();
                                    }
                                };
                                iteratedTechnique.addListener(updateHelp);
                                iteratedPercentile.addListener(updateHelp);
                                updateHelp();
                                return formGroup.element;
                            })(),
                            { visible: progressBar.value !== null && iterated.value === "iterated" }
                        );
                        const updateVisibility = () => {
                            collapse.visible.value = progressBar.value !== null && iterated.value === "iterated";
                        };
                        progressBar.addListener(updateVisibility);
                        iterated.addListener(updateVisibility);
                        return collapse.element;
                    })()
                );
                form.appendChild(
                    (() => {
                        const collapse = new Collapse(
                            (() => {
                                const formGroup = new FormGroup(
                                    (() => {
                                        const input = document.createElement("input");
                                        input.type = "number";
                                        input.valueAsNumber = iteratedPercentile.value;
                                        input.setAttribute("min", "0");
                                        input.setAttribute("max", "100");
                                        input.setAttribute("step", "0.1");
                                        input.addEventListener("change", (e) => {
                                            iteratedPercentile.value = input.valueAsNumber;
                                        });
                                        return input;
                                    })(),
                                    "iterated percentile"
                                );
                                return formGroup.element;
                            })(),
                            {
                                visible:
                                    progressBar.value !== null &&
                                    iterated.value === "iterated" &&
                                    iteratedTechnique.value === "percentile",
                            }
                        );
                        const updateVisibility = () => {
                            collapse.visible.value =
                                progressBar.value !== null &&
                                iterated.value === "iterated" &&
                                iteratedTechnique.value === "percentile";
                        };
                        progressBar.addListener(updateVisibility);
                        iterated.addListener(updateVisibility);
                        oneOffTechnique.addListener(updateVisibility);
                        return collapse.element;
                    })()
                );
                form.appendChild(
                    (() => {
                        const btn = document.createElement("button");
                        btn.type = "submit";
                        btn.textContent = "Submit";
                        ok.addListenerAndInvoke((ok) => {
                            btn.disabled = !ok;
                        });
                        return btn;
                    })()
                );
                return form;
            })()
        );
    }
}
