import { SAMPLING_TECHNIQUE_NATIVE_TO_API } from "/js/app/progress_bars/progress_bar.js";
import { ITERATED_TECHNIQUE_NATIVE_TO_API, ONE_OFF_TECHNIQUE_NATIVE_TO_API } from "/js/app/progress_bars/steps/progress_bar_step.js";
import { ProgressBarStepView } from "/js/app/progress_bars/steps/progress_bar_step_view.js";
import { Controls } from "/js/app/resources/controls.js";
import { ResourceSection } from "/js/app/resources/resource_section.js";
import { AuthHelper } from "/js/auth_helper.js";
import { apiUrl } from "/js/fetch_helper.js";
import { Observable } from "/js/lib/observable.js";
import { ListenerOf, ReplicaListener } from "/js/lib/replica_listener.js";

const SAMPLING_TECHNIQUE_NATIVE_TO_PRETTY = {
    "systematic": "Systematic",
    "simpleRandom": "Simple Random"
};
/**
 * shows a progress bar and controls
 */
export class ProgressBarView {
    /**
     * 
     * @param {import("/js/app/progress_bars/progress_bar.js").ProgressBar} progressBar the progress bar to show
     * @param {function() : any} onDelete funtion to call after the user deleted this progress bar
     */
    constructor(progressBar, onDelete) {
        /**
         * the element this view is attached to
         * @type {Element}
         */
        this.element = document.createElement("div");
        /**
         * the progress bar to show
         * @type {import("/js/app/progress_bars/progress_bar.js").ProgressBar}
         * @readonly
         */
        this.progressBar = progressBar;
        /**
         * the default step config view
         * @type {ProgressBarStepView}
         * @readonly
         */
        this.defaultStepConfigView = new ProgressBarStepView(progressBar.get("defaultStepConfig"), null);
        /**
         * if we are in editing mode
         * @type {Observable.<boolean>}
         * @readonly
         */
        this.editing = new Observable(false);
        /**
         * the function to call after the user deleted the progress bar
         * @type {function () : any}
         * @reaonly
         */
        this.onDelete = onDelete;
        this.render();
    }
    /**
     * hanldes deleting the progress bar and then calling the callback
     * @private
     */
    async _onDelete() {
        const response = await fetch(
            apiUrl("/api/1/progress_bars/?" + new URLSearchParams({ name: this.progressBar.get("name") }).toString()),
            AuthHelper.auth({ method: "DELETE" })
        );
        if (!response.ok) {
            throw response;
        }
        if (this.onDelete !== null) {
            this.onDelete();
        }
    }
    /**
     * handles switching to/from editing mode
     * @private
     */
    async _onEdit() {
        if (!this.editing.value) {
            this.editing.value = true;
            this.defaultStepConfigView.editing.value = true;
            return;
        }
        const dsc = this.progressBar.get("defaultStepConfig");
        const response = await fetch(
            apiUrl("/api/1/progress_bars/?" + new URLSearchParams({ name: this.progressBar.get("name") }).toString()),
            AuthHelper.auth({
                method: "PUT",
                headers: { "content-type": "application/json; charset=UTF-8" },
                body: JSON.stringify({
                    sampling_max_count: this.progressBar.get("samplingMaxCount"),
                    sampling_max_age_seconds: this.progressBar.get("samplingMaxAgeSeconds"),
                    sampling_technique: SAMPLING_TECHNIQUE_NATIVE_TO_API[this.progressBar.get("samplingTechnique")],
                    default_step_config: {
                        iterated: dsc.get("iterated"),
                        one_off_technique: ONE_OFF_TECHNIQUE_NATIVE_TO_API[dsc.get("oneOffTechnique")],
                        one_off_percentile: dsc.get("oneOffPercentile"),
                        iterated_technique: ITERATED_TECHNIQUE_NATIVE_TO_API[dsc.get("iteratedTechnique")],
                        iterated_percentile: dsc.get("iteratedPercentile")
                    }
                })
            })
        );
        if (!response.ok) {
            throw response;
        }
        this.editing.value = false;
        this.defaultStepConfigView.editing.value = false;
    }

    render() {
        this.element.classList.add("progress-bar-view", "elevation-medium");
        this.element.appendChild(new Controls({
            onDelete: this._onDelete.bind(this),
            onEdit: this._onEdit.bind(this),
            editing: this.editing
        }).element);
        this.element.appendChild((() => {
            /** @type {ReplicaListener & ListenerOf.<string, "uid">} */
            const data = this.progressBar;
            return (new ResourceSection(data, "uid", { formatter: (uid) => uid })).element;
        })());
        this.element.appendChild((() => {
            /** @type {ReplicaListener & ListenerOf.<string, "name">} */
            const data = this.progressBar;
            return (new ResourceSection(data, "name", { formatter: (name) => name })).element;
        })());
        this.element.appendChild((() => {
            /** @type {ReplicaListener & ListenerOf.<number, "samplingMaxCount">} */
            const data = this.progressBar;
            return (new ResourceSection(data, "samplingMaxCount", {
                edit: {
                    editingNode: (() => {
                        const input = document.createElement("input");
                        input.type = "number";
                        input.setAttribute("min", "10");
                        input.setAttribute("step", "1");
                        this.progressBar.addListenerAndInvoke("samplingMaxCount", (count) => {
                            input.valueAsNumber = count;
                        });
                        input.addEventListener("change", (e) => {
                            this.progressBar.set("samplingMaxCount", input.valueAsNumber);
                        });
                        return input;
                    })(),
                    editing: this.editing
                },
                formatter: (samplingMaxCount) => samplingMaxCount.toString()
            })).element;
        })());
        this.element.appendChild((() => {
            /** @type {ReplicaListener & ListenerOf.<number, "samplingMaxAgeSeconds">} */
            const data = this.progressBar;
            return (new ResourceSection(data, "samplingMaxAgeSeconds", {
                edit: {
                    editingNode: (() => {
                        const input = document.createElement("input");
                        input.type = "number";
                        input.setAttribute("min", "60");
                        input.setAttribute("step", "1");
                        this.progressBar.addListenerAndInvoke("samplingMaxAgeSeconds", (age) => {
                            input.valueAsNumber = age;
                        });
                        input.addEventListener("change", (e) => {
                            this.progressBar.set("samplingMaxAgeSeconds", input.valueAsNumber);
                        });
                        return input;
                    })(),
                    editing: this.editing
                },
                formatter: (samplingMaxAgeSeconds) => samplingMaxAgeSeconds.toString()
            })).element;
        })());
        this.element.appendChild((() => {
            /** @type {ReplicaListener & ListenerOf.<"systematic" | "simpleRandom", "samplingTechnique">} */
            const data = this.progressBar;
            return (new ResourceSection(data, "samplingTechnique", {
                edit: {
                    editingNode: (() => {
                        const select = document.createElement("select");
                        for (let native in SAMPLING_TECHNIQUE_NATIVE_TO_PRETTY) {
                            select.appendChild((() => {
                                const option = document.createElement("option");
                                option.value = native;
                                option.textContent = SAMPLING_TECHNIQUE_NATIVE_TO_PRETTY[native];
                                return option;
                            })());
                        }
                        this.progressBar.addListenerAndInvoke("samplingTechnique", (technique) => {
                            select.value = technique;
                        });
                        select.addEventListener("change", (e) => {
                            let selectValue = select.value;
                            if (selectValue !== "systematic" && selectValue !== "simpleRandom") {
                                throw `impossible select value ${selectValue}`;
                            }
                            /** @type {"systematic" | "simpleRandom"} */
                            const s = selectValue;
                            this.progressBar.set("samplingTechnique", s);
                        });
                        return select;
                    })(),
                    editing: this.editing
                },
                formatter: (technique) => SAMPLING_TECHNIQUE_NATIVE_TO_PRETTY[technique]
            })).element;
        })());
        this.element.appendChild(this.defaultStepConfigView.element);
    }
}
