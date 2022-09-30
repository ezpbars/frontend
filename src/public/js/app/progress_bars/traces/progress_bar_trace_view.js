import { Controls } from "/js/app/resources/controls.js";
import { ResourceSection } from "/js/app/resources/resource_section.js";
import { AuthHelper } from "/js/auth_helper.js";
import { apiUrl } from "/js/fetch_helper.js";
import { ListenerOf, ReplicaListener } from "/js/lib/replica_listener.js";

export class ProgressBarTraceView {
    /**
     *
     * @param {import("/js/app/progress_bars/traces/progress_bar_trace.js").ProgressBarTrace} progressBarTrace the progress bar trace to show
     * @param {function() : any} onDelete the function to call after the progress bar trace is deleted
     */
    constructor(progressBarTrace, onDelete) {
        /**
         * the element this view is attached to
         * @type {Element}
         * @readonly
         */
        this.element = document.createElement("div");
        /**
         * the progress bar trace to show
         * @type {import("/js/app/progress_bars/traces/progress_bar_trace.js").ProgressBarTrace}
         * @readonly
         */
        this.progressBarTrace = progressBarTrace;
        /**
         * the function to call after the progress bar trace is deleted
         * @type {function() : any}
         * @readonly
         */
        this.onDelete = onDelete;
        this.render();
    }
    /**
     * handles deleting the progress bar trace and the calling the callback
     * @private
     */
    async _onDelete() {
        const response = await fetch(
            apiUrl(
                "/api/1/progress_bars/traces/?" +
                    new URLSearchParams({
                        pbar_name: this.progressBarTrace.get("progressBarName"),
                        trace_uid: this.progressBarTrace.get("uid"),
                    })
            ),
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
     * adds the appropriate contents to the element for this view. Should
     * only be called once
     * @private
     */
    render() {
        this.element.classList.add("progress-bar-trace-view", "elevation-medium");
        this.element.appendChild(
            (() => {
                const controls = new Controls({
                    onDelete: this._onDelete.bind(this),
                    contextMenu: {},
                });
                this.progressBarTrace.addListenerAndInvoke("progressBarName", (name) => {
                    controls.contextMenu.value = {
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
                /** @type {ReplicaListener & ListenerOf.<string, "uid">} */
                const data = this.progressBarTrace;
                return new ResourceSection(data, "uid", {
                    label: "UID",
                    formatter: (uid) => uid,
                }).element;
            })()
        );
        this.element.appendChild(
            (() => {
                /** @type {ReplicaListener & ListenerOf.<string, "progressBarName">} */
                const data = this.progressBarTrace;
                return new ResourceSection(data, "progressBarName", {
                    label: "Progress Bar Name",
                    formatter: (progressBarName) => progressBarName,
                }).element;
            })()
        );
        this.element.appendChild(
            (() => {
                /** @type {ReplicaListener & ListenerOf.<Date, "createdAt">} */
                const data = this.progressBarTrace;
                return new ResourceSection(data, "createdAt", {
                    label: "Created At",
                    formatter: (createdAt) => createdAt.toLocaleString(),
                }).element;
            })()
        );
    }
}
