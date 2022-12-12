import { ProgressBarsController } from "/js/app/progress_bars/progress_bars_controller.js";
import { ProgressBarStepsController } from "/js/app/progress_bars/steps/progress_bar_steps_controller.js";
import { ProgressBarTraceController } from "/js/app/progress_bars/traces/progress_bar_trace_controller.js";
import { ProgressBarTraceStepsController } from "/js/app/progress_bars/traces/steps/progress_bar_trace_steps_controller.js";
import { Collapse } from "/js/app/resources/collapse.js";
import { UserTokensController } from "/js/app/user_tokens/user_tokens_controller.js";
import { UserUsagesController } from "/js/app/user_usages/user_usages_controller.js";
import { Observable } from "/js/lib/observable.js";
import { AdminNavbarController } from "/js/pub/dashboard/admin_navbar.js";
import { MobileAdminNavbarController } from "/js/pub/dashboard/mobile_admin_navbar.js";
import { HeaderController } from "/js/pub/header/header_controller.js";
import { TitlebarController } from "/js/pub/mobile/titlebar_controller.js";

export class DashboardController {
    /**
     *
     * @param {string} activeLink the path to the current page e.g. "/index.html"
     */
    constructor(activeLink) {
        /**
         * the element this view is attached to
         * @type {Element}
         * @readonly
         */
        this.element = document.createElement("div");
        this.headerController = new HeaderController(activeLink);
        this.titleBarController = new TitlebarController(activeLink);

        /**
         * If we've loaded the progress bar controller, this is it, otherwise it's
         * null. Loaded lazily.
         * @type {ProgressBarsController | null}
         * @private
         */
        this.progressBarsController = null;
        /**
         * If we've loaded the user tokens controller, this is it, otherwise it's
         * null. Loaded lazily.
         * @type {UserTokensController | null}
         * @private
         */
        this.userTokensController = null;

        /**
         * If we've loaded the user usages controller, this is it, otherwise it's
         * null. Loaded lazily.
         * @type {UserUsagesController | null}
         * @private
         */
        this.userUsagesController = null;

        /**
         * If we've loaded the progress bar steps controller, this is it, otherwise it's
         * null. Loaded lazily.
         * @type {ProgressBarStepsController | null}
         * @private
         */
        this.progressBarStepsController = null;

        /**
         * If we've loaded the progress bar trace controller, this is it, otherwise it's
         * null. Loaded lazily.
         * @type {ProgressBarTraceController | null}
         * @private
         */
        this.progressBarTraceController = null;

        /**
         * If we've loaded the progress bar trace steps controller, this is it, otherwise it's
         * null. Loaded lazily.
         * @type {ProgressBarTraceStepsController | null}
         * @private
         */
        this.progressBarTraceStepsController = null;

        /**
         * @type {Observable.<import("/js/pub/dashboard/admin_navbar.js").AdminSection>}
         */
        this.activeSection = new Observable("billing");
        this.adminNavbarController = new AdminNavbarController(this.activeSection, { persist: "query" });
        this.mobileAdminNavbarController = new MobileAdminNavbarController(this.activeSection, { persist: "query" });
        this.activeLink = activeLink;
        this.reload();
    }
    /**
     * Adds the appropriate contents to the element for this view. Should
     * only be called once
     * @private
     */
    reload() {
        this.element.classList.add("dashboard-controller");
        this.element.appendChild(this.headerController.element);
        this.element.appendChild(
            (() => {
                const content = document.createElement("div");
                content.classList.add("dashboard-content");
                content.appendChild(this.adminNavbarController.element);
                content.appendChild(
                    (() => {
                        const collapse = new Collapse(
                            (() => {
                                const billing = document.createElement("div");
                                billing.classList.add("billing", "wrapper");
                                billing.appendChild(
                                    (() => {
                                        const title = document.createElement("header");
                                        title.classList.add("title");
                                        title.textContent = "Billing";
                                        return title;
                                    })()
                                );
                                this.activeSection.addListenerAndInvoke((active) => {
                                    if (this.userUsagesController === null && active === "billing") {
                                        this.userUsagesController = new UserUsagesController();
                                        billing.appendChild(this.userUsagesController.element);
                                    }
                                });
                                return billing;
                            })(),
                            { visible: this.activeSection.value === "billing" }
                        );
                        this.activeSection.addListener((active) => {
                            collapse.visible.value = active === "billing";
                        });
                        return collapse.element;
                    })()
                );
                content.appendChild(
                    (() => {
                        const collapse = new Collapse(
                            (() => {
                                const tokens = document.createElement("div");
                                tokens.classList.add("tokens", "wrapper");
                                tokens.appendChild(
                                    (() => {
                                        const title = document.createElement("header");
                                        title.classList.add("title");
                                        title.textContent = "Your Tokens";
                                        return title;
                                    })()
                                );
                                this.activeSection.addListenerAndInvoke((active) => {
                                    if (this.userTokensController === null && active === "userTokens") {
                                        this.userTokensController = new UserTokensController();
                                        tokens.appendChild(this.userTokensController.element);
                                    }
                                });
                                return tokens;
                            })(),
                            { visible: this.activeSection.value === "userTokens" }
                        );
                        this.activeSection.addListener((active) => {
                            collapse.visible.value = active === "userTokens";
                        });
                        return collapse.element;
                    })()
                );
                content.appendChild(
                    (() => {
                        const collapse = new Collapse(
                            (() => {
                                const pbars = document.createElement("div");
                                pbars.classList.add("progress-bars", "wrapper");
                                pbars.appendChild(
                                    (() => {
                                        const title = document.createElement("header");
                                        title.classList.add("title");
                                        title.textContent = "Your Progress Bars";
                                        return title;
                                    })()
                                );
                                this.activeSection.addListenerAndInvoke((active) => {
                                    if (this.progressBarsController === null && active === "progressBars") {
                                        this.progressBarsController = new ProgressBarsController();
                                        pbars.appendChild(this.progressBarsController.element);
                                    }
                                });
                                return pbars;
                            })(),
                            { visible: this.activeSection.value === "progressBars" }
                        );
                        this.activeSection.addListener((active) => {
                            collapse.visible.value = active === "progressBars";
                        });
                        return collapse.element;
                    })()
                );
                content.appendChild(
                    (() => {
                        const collapse = new Collapse(
                            (() => {
                                const pbarSteps = document.createElement("div");
                                pbarSteps.classList.add("progress-bar-steps", "wrapper");
                                pbarSteps.appendChild(
                                    (() => {
                                        const title = document.createElement("header");
                                        title.classList.add("title");
                                        title.textContent = "Your Progress Bar Steps";
                                        return title;
                                    })()
                                );
                                this.activeSection.addListenerAndInvoke((active) => {
                                    if (this.progressBarStepsController === null && active === "progressBarSteps") {
                                        this.progressBarStepsController = new ProgressBarStepsController();
                                        pbarSteps.appendChild(this.progressBarStepsController.element);
                                    }
                                });
                                return pbarSteps;
                            })(),
                            { visible: this.activeSection.value === "progressBarSteps" }
                        );
                        this.activeSection.addListener((active) => {
                            collapse.visible.value = active === "progressBarSteps";
                        });
                        return collapse.element;
                    })()
                );
                content.appendChild(
                    (() => {
                        const collapse = new Collapse(
                            (() => {
                                const pbarTraces = document.createElement("div");
                                pbarTraces.classList.add("progress-bar-traces", "wrapper");
                                pbarTraces.appendChild(
                                    (() => {
                                        const title = document.createElement("header");
                                        title.classList.add("title");
                                        title.textContent = "Your Traces";
                                        return title;
                                    })()
                                );
                                this.activeSection.addListenerAndInvoke((active) => {
                                    if (this.progressBarTraceController === null && active === "traces") {
                                        this.progressBarTraceController = new ProgressBarTraceController();
                                        pbarTraces.appendChild(this.progressBarTraceController.element);
                                    }
                                });
                                return pbarTraces;
                            })(),
                            { visible: this.activeSection.value === "traces" }
                        );
                        this.activeSection.addListener((active) => {
                            collapse.visible.value = active === "traces";
                        });
                        return collapse.element;
                    })()
                );
                content.appendChild(
                    (() => {
                        const collapse = new Collapse(
                            (() => {
                                const traceSteps = document.createElement("div");
                                traceSteps.classList.add("trace-steps", "wrapper");
                                traceSteps.appendChild(
                                    (() => {
                                        const title = document.createElement("header");
                                        title.classList.add("title");
                                        title.textContent = "Your Trace Steps";
                                        return title;
                                    })()
                                );
                                this.activeSection.addListenerAndInvoke((active) => {
                                    if (this.progressBarTraceStepsController === null && active === "traceSteps") {
                                        this.progressBarTraceStepsController = new ProgressBarTraceStepsController();
                                        traceSteps.appendChild(this.progressBarTraceStepsController.element);
                                    }
                                });
                                return traceSteps;
                            })(),
                            { visible: this.activeSection.value === "traceSteps" }
                        );
                        this.activeSection.addListener((active) => {
                            collapse.visible.value = active === "traceSteps";
                        });
                        return collapse.element;
                    })()
                );
                return content;
            })()
        );
        this.element.appendChild(this.mobileAdminNavbarController.element);
        this.element.appendChild(this.titleBarController.element);
    }
}
