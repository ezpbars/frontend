import { Collapse } from "/js/app/resources/collapse.js";
import { Controls } from "/js/app/resources/controls.js";
import { DumbResourceSection } from "/js/app/resources/dumb_resource_section.js";
import { ResourceSection } from "/js/app/resources/resource_section.js";
import { ListenerOf, ReplicaListener } from "/js/lib/replica_listener.js";

/**
 * shows a progress bar trace step
 */
export class ProgressBarTraceStepView {
    /**
     *
     * @param {import("/js/app/progress_bars/traces/steps/progress_bar_trace_step.js").ProgressBarTraceStep} progressBarTraceStep
     *   the trace step to show
     */
    constructor(progressBarTraceStep) {
        /**
         * the element this view is attached to
         * @type {Element}
         * @readonly
         */
        this.element = document.createElement("div");
        /**
         * the trace step to show
         * @type {import("/js/app/progress_bars/traces/steps/progress_bar_trace_step.js").ProgressBarTraceStep}
         * @readonly
         */
        this.progressBarTraceStep = progressBarTraceStep;
        this.render();
    }

    /**
     * Adds the appropriate contents to the element for this view. Should
     * only be called once.
     * @private
     */
    render() {
        this.element.classList.add("progress-bar-trace-step-view", "elevation-medium");
        this.element.appendChild(
            (() => {
                const controls = new Controls({
                    contextMenu: {},
                });
                this.progressBarTraceStep.addListenerAndInvoke("progressBarName", (name) => {
                    controls.contextMenu.value = {
                        "Go to trace":
                            "/app/progress_bar_traces.html?" +
                            new URLSearchParams({
                                "progress-bar-trace": btoa(new URLSearchParams({ pbarName: name }).toString()),
                            }).toString(),
                        "Go to Progress Bar":
                            "/app/progress_bars.html?" +
                            new URLSearchParams({
                                "progress-bar": btoa(new URLSearchParams({ nameExact: name }).toString()),
                            }).toString(),
                    };
                });
                return controls.element;
            })()
        );
        this.element.appendChild(
            (() => {
                /** @type {ReplicaListener & ListenerOf.<string, "userSub">} */
                const data = this.progressBarTraceStep;
                return new ResourceSection(data, "userSub", {
                    label: "User Sub",
                    formatter: (userSub) => userSub,
                }).element;
            })()
        );
        this.element.appendChild(
            (() => {
                /** @type {ReplicaListener & ListenerOf.<string, "progressBarName">} */
                const data = this.progressBarTraceStep;
                return new ResourceSection(data, "progressBarName", {
                    label: "Progress Bar Name",
                    formatter: (progressBarName) => progressBarName,
                }).element;
            })()
        );
        this.element.appendChild(
            (() => {
                /** @type {ReplicaListener & ListenerOf.<string, "progressBarStepName">} */
                const data = this.progressBarTraceStep;
                return new ResourceSection(data, "progressBarStepName", {
                    label: "Step Name",
                    formatter: (progressBarStepName) => progressBarStepName,
                }).element;
            })()
        );
        this.element.appendChild(
            (() => {
                /** @type {ReplicaListener & ListenerOf.<number, "progressBarStepPosition">} */
                const data = this.progressBarTraceStep;
                return new ResourceSection(data, "progressBarStepPosition", {
                    label: "Step Position",
                    formatter: (progressBarStepPosition) => progressBarStepPosition.toString(),
                }).element;
            })()
        );
        this.element.appendChild(
            (() => {
                /** @type {ReplicaListener & ListenerOf.<string, "progressBarTraceUid">} */
                const data = this.progressBarTraceStep;
                return new ResourceSection(data, "progressBarTraceUid", {
                    label: "Trace UID",
                    formatter: (progressBarTraceUid) => progressBarTraceUid,
                }).element;
            })()
        );
        this.element.appendChild(
            (() => {
                /** @type {ReplicaListener & ListenerOf.<string, "uid">} */
                const data = this.progressBarTraceStep;
                return new ResourceSection(data, "uid", {
                    label: "UID",
                    formatter: (uid) => uid,
                }).element;
            })()
        );
        this.element.appendChild(
            (() => {
                /** @type {ReplicaListener & ListenerOf.<number, "iterations">} */
                const data = this.progressBarTraceStep;
                return new ResourceSection(data, "iterations", {
                    label: "Iterations",
                    formatter: (iterations) => (iterations === null ? "N/A" : iterations.toString()),
                }).element;
            })()
        );
        this.element.appendChild(
            (() => {
                /** @type {ReplicaListener & ListenerOf.<Date, "startedAt">} */
                const data = this.progressBarTraceStep;
                return new ResourceSection(data, "startedAt", {
                    label: "Started At",
                    formatter: (startedAt) => startedAt.toLocaleString(),
                }).element;
            })()
        );
        this.element.appendChild(
            (() => {
                /** @type {ReplicaListener & ListenerOf.<Date, "finishedAt">} */
                const data = this.progressBarTraceStep;
                return new ResourceSection(data, "finishedAt", {
                    label: "Finished At",
                    formatter: (finishedAt) => finishedAt.toLocaleString(),
                }).element;
            })()
        );
        this.element.appendChild(
            (() => {
                const view = new DumbResourceSection("Duration", "loading");
                const updateValue = () => {
                    const startedAt = this.progressBarTraceStep.get("startedAt");
                    const finishedAt = this.progressBarTraceStep.get("finishedAt");
                    view.value.value = `${(finishedAt.getTime() - startedAt.getTime()) / 1000} seconds`;
                };
                this.progressBarTraceStep.addListener("startedAt", updateValue);
                this.progressBarTraceStep.addListener("finishedAt", updateValue);
                updateValue();
                return view.element;
            })()
        );
        this.element.appendChild(
            (() => {
                const collapse = new Collapse(
                    (() => {
                        const view = new DumbResourceSection("Normalized Duration", "loading");
                        const updateValue = () => {
                            const startedAt = this.progressBarTraceStep.get("startedAt");
                            const finishedAt = this.progressBarTraceStep.get("finishedAt");
                            const iterations = this.progressBarTraceStep.get("iterations") || 1;
                            view.value.value = `${
                                (finishedAt.getTime() - startedAt.getTime()) / 1000 / iterations
                            } seconds per iteration`;
                        };
                        this.progressBarTraceStep.addListener("startedAt", updateValue);
                        this.progressBarTraceStep.addListener("finishedAt", updateValue);
                        this.progressBarTraceStep.addListener("iterations", updateValue);
                        updateValue();
                        return view.element;
                    })(),
                    { visible: this.progressBarTraceStep.get("iterations") !== null }
                );
                this.progressBarTraceStep.addListener("iterations", (iterations) => {
                    collapse.visible.value = iterations !== null;
                });
                return collapse.element;
            })()
        );
    }
}
