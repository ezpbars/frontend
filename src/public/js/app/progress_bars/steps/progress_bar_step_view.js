import { Collapse } from "/js/app/resources/collapse.js";
import { Controls } from "/js/app/resources/controls.js";
import { ResourceSection } from "/js/app/resources/resource_section.js";
import { AuthHelper } from "/js/auth_helper.js";
import { apiUrl } from "/js/fetch_helper.js";
import { Observable } from "/js/lib/observable.js";
import { ListenerOf, ReplicaListener } from "/js/lib/replica_listener.js";

const ITERATED_TECHNIQUE_NATIVE_TO_PRETTY = {
    "percentile": "Percentile",
    "harmonicMean": "Harmonic Mean",
    "geometricMean": "Geometric Mean",
    "arithmeticMean": "Arithmetic Mean",
    "bestFit.linear": "Best Fit (linear)"
};
const ONE_OFF_TECHNIQUE_NATIVE_TO_PRETTY = {
    "percentile": "Percentile",
    "harmonicMean": "Harmonic Mean",
    "geometricMean": "Geometric Mean",
    "arithmeticMean": "Arithmetic Mean",
};

/**
 * shows a progress bar step and controls
 */
export class ProgressBarStepView {
    /**
     * 
     * @param {import("/js/app/progress_bars/steps/progress_bar_step.js").ProgressBarStep} progressBarStep the progress bar step to show
     * @param {function() : any} onDelete function to call after the user deleted this progress bar step
     */
    constructor(progressBarStep, onDelete) {
        /**
         * the element this view is attached to
         * @type {Element}
         * @readonly
         */
        this.element = document.createElement("div");
        /**
         * the progress bar step to show
         * @type {import("/js/app/progress_bars/steps/progress_bar_step.js").ProgressBarStep}
         * @readonly
         */
        this.progressBarStep = progressBarStep;
        /**
         * if we are in editing mdoe
         * @type {Observable.<boolean>}
         * @readonly
         */
        this.editing = new Observable(false);
        /**
         * the function to call after the user deleted the progress bar step
         * @type {function() : any}
         * @readonly
         */
        this.onDelete = onDelete;
        this.render();
    }
    async _onDelete() {
        // TODO: when endpoint is ready
    }
    async _onEdit() {
        // TODO when endpoint is ready
    }
    render() {
        this.element.classList.add("progress-bar-step-view", "elevation-medium");
        this.element.appendChild(new Controls({
            onDelete: this.progressBarStep.get("name") === "default" ? null : this._onDelete.bind(this),
            onEdit: this.progressBarStep.get("name") === "default" ? null : this._onEdit.bind(this),
            editing: this.editing
        }).element);
        this.element.appendChild((() => {
            /** @type {ReplicaListener & ListenerOf.<string, "uid">} */
            const data = this.progressBarStep;
            return (new ResourceSection(data, "uid", { formatter: (uid) => uid })).element;
        })());
        this.element.appendChild((() => {
            const collapse = new Collapse((() => {
                /** @type {ReplicaListener & ListenerOf.<string, "name">} */
                const data = this.progressBarStep;
                return (new ResourceSection(data, "name", { formatter: (name) => name })).element;
            })(), { visible: this.progressBarStep.get("name") !== "default" });
            this.progressBarStep.addListener("name", (name) => {
                collapse.visible.value = name !== "default";
            });
            return collapse.element;
        })());
        this.element.appendChild((() => {
            const collapse = new Collapse((() => {
                /** @type {ReplicaListener & ListenerOf.<number, "position">} */
                const data = this.progressBarStep;
                return (new ResourceSection(data, "position", { formatter: (position) => position.toString() })).element;
            })(), { visible: this.progressBarStep.get("name") !== "default" });
            this.progressBarStep.addListener("name", (name) => {
                collapse.visible.value = name !== "default";
            });
            return collapse.element;
        })());
        this.element.appendChild((() => {
            const collapse = new Collapse((() => {
                /** @type {ReplicaListener & ListenerOf.<number, "iterated">} */
                const data = this.progressBarStep;
                return (new ResourceSection(data, "iterated", { formatter: (iterated) => iterated.toString() })).element;
            })(), { visible: this.progressBarStep.get("name") !== "default" });
            this.progressBarStep.addListener("name", (name) => {
                collapse.visible.value = name !== "default";
            });
            return collapse.element;
        })());
        this.element.appendChild((() => {
            const collapse = new Collapse((() => {
                /** @type {ReplicaListener & ListenerOf.<"percentile" | "harmonicMean" | "geometricMean" | "arithmeticMean", "oneOffTechnique">} */
                const data = this.progressBarStep;
                return (new ResourceSection(data, "oneOffTechnique", {
                    edit: {
                        editingNode: (() => {
                            const select = document.createElement("select");
                            for (let native in ONE_OFF_TECHNIQUE_NATIVE_TO_PRETTY) {
                                select.appendChild((() => {
                                    const option = document.createElement("option");
                                    option.value = native;
                                    option.textContent = ONE_OFF_TECHNIQUE_NATIVE_TO_PRETTY[native];
                                    return option;
                                })());
                            }
                            this.progressBarStep.addListenerAndInvoke("oneOffTechnique", (technique) => {
                                select.value = technique;
                            });
                            select.addEventListener("change", (e) => {
                                let selectValue = select.value;
                                if (selectValue !== "percentile" && selectValue !== "harmonicMean" && selectValue !== "geometricMean" && selectValue !== "arithmeticMean") {
                                    throw `impossible select value: ${selectValue}`;
                                }
                                /** @type {"percentile" | "harmonicMean" | "geometricMean" | "arithmeticMean"} */
                                const s = selectValue;
                                this.progressBarStep.set("oneOffTechnique", s);
                            });
                            return select;
                        })(),
                        editing: this.editing
                    },
                    formatter: (technique) => ONE_OFF_TECHNIQUE_NATIVE_TO_PRETTY[technique]
                })).element;
            })(), { visible: this.progressBarStep.get("name") === "default" || this.progressBarStep.get("iterated") === 0 });
            return collapse.element;
        })());
        this.element.appendChild((() => {
            const collapse = new Collapse((() => {
                /** @type {ReplicaListener & ListenerOf.<number, "oneOffPercentile">} */
                const data = this.progressBarStep;
                return (new ResourceSection(data, "oneOffPercentile", {
                    edit: {
                        editingNode: (() => {
                            const input = document.createElement("input");
                            input.type = "number";
                            input.setAttribute("min", "0");
                            input.setAttribute("max", "100");
                            input.setAttribute("step", "0.1");
                            this.progressBarStep.addListenerAndInvoke("oneOffPercentile", (percentile) => {
                                input.valueAsNumber = percentile;
                            });
                            input.addEventListener("change", (e) => {
                                this.progressBarStep.set("oneOffPercentile", input.valueAsNumber);
                            });
                            return input;
                        })(),
                        editing: this.editing
                    },
                    formatter: (oneOffPercentile) => oneOffPercentile.toString()
                })).element;
            })(), { visible: this.progressBarStep.get("name") === "default" || (this.progressBarStep.get("iterated") === 0 && this.progressBarStep.get("oneOffTechnique") === "percentile") });
            return collapse.element;
        })());
        this.element.appendChild((() => {
            const collapse = new Collapse((() => {
                /** @type {ReplicaListener & ListenerOf.<"bestFit.linear" | "percentile" | "harmonicMean" | "geometricMean" | "arithmeticMean", "iteratedTechnique">} */
                const data = this.progressBarStep;
                return (new ResourceSection(data, "iteratedTechnique", {
                    edit: {
                        editingNode: (() => {
                            const select = document.createElement("select");
                            for (let native in ITERATED_TECHNIQUE_NATIVE_TO_PRETTY) {
                                select.appendChild((() => {
                                    const option = document.createElement("option");
                                    option.value = native;
                                    option.textContent = ITERATED_TECHNIQUE_NATIVE_TO_PRETTY[native];
                                    return option;
                                })());
                            }
                            this.progressBarStep.addListenerAndInvoke("iteratedTechnique", (technique) => {
                                select.value = technique;
                            });
                            select.addEventListener("change", (e) => {
                                let selectValue = select.value;
                                if (selectValue !== "bestFit.linear" && selectValue !== "percentile" && selectValue !== "harmonicMean" && selectValue !== "geometricMean" && selectValue !== "arithmeticMean") {
                                    throw `impossible select value: ${selectValue}`;
                                }
                                /** @type {"bestFit.linear" | "percentile" | "harmonicMean" | "geometricMean" | "arithmeticMean"} */
                                const s = selectValue;
                                this.progressBarStep.set("iteratedTechnique", s);
                            });
                            return select;
                        })(),
                        editing: this.editing
                    },
                    formatter: (technique) => ITERATED_TECHNIQUE_NATIVE_TO_PRETTY[technique]
                })).element;
            })(), { visible: this.progressBarStep.get("name") === "default" || this.progressBarStep.get("iterated") === 1 });
            return collapse.element;
        })());
        this.element.appendChild((() => {
            const collapse = new Collapse((() => {
                /** @type {ReplicaListener & ListenerOf.<number, "iteratedPercentile">} */
                const data = this.progressBarStep;
                return (new ResourceSection(data, "iteratedPercentile", {
                    edit: {
                        editingNode: (() => {
                            const input = document.createElement("input");
                            input.type = "number";
                            input.setAttribute("min", "0");
                            input.setAttribute("max", "100");
                            input.setAttribute("step", "0.1");
                            this.progressBarStep.addListenerAndInvoke("iteratedPercentile", (percentile) => {
                                input.valueAsNumber = percentile;
                            });
                            input.addEventListener("change", (e) => {
                                this.progressBarStep.set("iteratedPercentile", input.valueAsNumber);
                            });
                            return input;
                        })(),
                        editing: this.editing
                    },
                    formatter: (iteratedPercentile) => iteratedPercentile.toString()
                })).element;
            })(), { visible: this.progressBarStep.get("name") === "default" || (this.progressBarStep.get("iterated") === 1 && this.progressBarStep.get("iteratedTechnique") === "percentile") });
            return collapse.element;
        })());
        this.element.appendChild((() => {
            /** @type {ReplicaListener & ListenerOf.<Date, "createdAt">} */
            const data = this.progressBarStep;
            return (new ResourceSection(data, "createdAt", { formatter: (createdAt) => createdAt.toLocaleString() })).element;
        })());
    }
}
