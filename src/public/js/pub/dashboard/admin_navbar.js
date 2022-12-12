import { Collapse } from "/js/app/resources/collapse.js";
import { AuthHelper } from "/js/auth_helper.js";
import { Observable } from "/js/lib/observable.js";
import { PERSISTERS } from "/js/persist_utils.js";

/**
 * @typedef {'billing' | 'userTokens' | 'progressBars' | 'progressBarSteps' | 'traces' | 'traceSteps'} AdminSection
 */

export class AdminNavbarController {
    /**
     * @param {Observable.<AdminSection>} activeSection The active section; we mutate this value
     *   when the user clicks on a section, and respond to changes in this value by changing the
     *   highlighted section
     * @param {object} [kwargs] the keyword arguments
     * @param {"query" | "notPersisted"} [kwargs.persist="notPersisted"] if set, where to persist the reader's state
     */
    constructor(activeSection, kwargs) {
        kwargs = Object.assign({ persist: "notPersisted" }, kwargs);
        /**
         * the persister for the state
         * @type {import("/js/persist_utils.js").Persister}
         * @private
         */
        this.persister = PERSISTERS[kwargs.persist];
        const initialState = this.persister.retrieve("admin-navbar", {
            activeSection: "billing",
            tracesExpanded: "false",
            pbarExpanded: "false",
        });
        /**
         * the element this view is attached to
         * @type {Element}
         * @readonly
         */
        this.element = document.createElement("div");
        /**
         * The active section; we mutate this value when the user clicks on a section, and respond to
         * changes in this value by changing the highlighted section
         * @type {Observable.<AdminSection>}
         * @readonly
         */
        this.activeSection = activeSection;
        if (
            initialState.activeSection !== "billing" &&
            initialState.activeSection !== "userTokens" &&
            initialState.activeSection !== "progressBars" &&
            initialState.activeSection !== "progressBarSteps" &&
            initialState.activeSection !== "traces" &&
            initialState.activeSection !== "traceSteps"
        ) {
            throw new Error("Invalid initial state for admin navbar");
        }
        this.activeSection.value = initialState.activeSection;
        this.activeSection.addListener(this.persist.bind(this));
        /**
         * whether the trace steps button is visible
         * @type {Observable.<boolean>}
         * @private
         */
        this.tracesExpanded = new Observable(true ? this.activeSection.value === "traceSteps" : false);
        /**
         * whether the progress bar steps button is visible
         * @type {Observable.<boolean>}
         * @private
         */
        this.pbarExpanded = new Observable(true ? this.activeSection.value === "progressBarSteps" : false);
        this.reload();
    }
    /**
     * Adds the appropriate contents to the element for this view. Should
     * only be called once
     * @private
     */
    reload() {
        this.element.classList.add("admin-navbar-controller");
        this.element.appendChild(
            (() => {
                const header = document.createElement("div");
                header.classList.add("admin-navbar-header");
                header.appendChild(
                    (() => {
                        const userName = document.createElement("h1");
                        userName.classList.add("user-name");
                        userName.textContent = AuthHelper.retrieveName() + "'s Dashboard";
                        return userName;
                    })()
                );
                return header;
            })()
        );
        this.element.appendChild(
            (() => {
                const options = document.createElement("div");
                options.classList.add("admin-navbar-options", "column");
                options.appendChild(
                    (() => {
                        const option = document.createElement("div");
                        option.classList.add("admin-navbar-option");
                        this.activeSection.addListenerAndInvoke((active) => {
                            if (active === "billing") {
                                option.classList.add("active");
                            } else {
                                option.classList.remove("active");
                            }
                        });
                        option.appendChild(
                            (() => {
                                const btn = document.createElement("button");
                                btn.type = "button";
                                btn.textContent = "Billing";
                                btn.addEventListener("click", (e) => {
                                    e.preventDefault();
                                    this.activeSection.value = "billing";
                                });
                                return btn;
                            })()
                        );
                        return option;
                    })()
                );
                options.appendChild(
                    (() => {
                        const option = document.createElement("div");
                        option.classList.add("admin-navbar-option");
                        this.activeSection.addListenerAndInvoke((active) => {
                            if (active === "userTokens") {
                                option.classList.add("active");
                            } else {
                                option.classList.remove("active");
                            }
                        });
                        option.appendChild(
                            (() => {
                                const btn = document.createElement("button");
                                btn.textContent = "User Tokens";
                                btn.type = "button";
                                btn.addEventListener("click", (e) => {
                                    e.preventDefault();
                                    this.activeSection.value = "userTokens";
                                });
                                return btn;
                            })()
                        );
                        return option;
                    })()
                );
                options.appendChild(
                    (() => {
                        const option = document.createElement("div");
                        option.classList.add("admin-navbar-option", "with-toggle");
                        if (this.pbarExpanded.value) {
                            option.classList.add("expanded");
                        }
                        this.activeSection.addListenerAndInvoke((active) => {
                            if (active === "progressBars") {
                                option.classList.add("active");
                            } else {
                                option.classList.remove("active");
                            }
                        });
                        option.appendChild(
                            (() => {
                                const pbars = document.createElement("button");
                                pbars.textContent = "Progress Bars";
                                pbars.type = "button";
                                pbars.addEventListener("click", (e) => {
                                    e.preventDefault();
                                    this.activeSection.value = "progressBars";
                                });
                                return pbars;
                            })()
                        );
                        option.appendChild(
                            (() => {
                                const toggle = document.createElement("button");
                                toggle.classList.add("icon-btn-expand-medium");
                                toggle.type = "button";
                                toggle.appendChild(
                                    (() => {
                                        const span = document.createElement("span");
                                        span.classList.add("icon-btn--icon");
                                        return span;
                                    })()
                                );
                                toggle.addEventListener("click", () => {
                                    this.pbarExpanded.value = !this.pbarExpanded.value;
                                    if (option.classList.contains("expanded")) {
                                        option.classList.remove("expanded");
                                    } else {
                                        option.classList.add("expanded");
                                    }
                                });
                                return toggle;
                            })()
                        );
                        return option;
                    })()
                );
                options.appendChild(
                    (() => {
                        const collapse = new Collapse(
                            (() => {
                                const pbarSteps = document.createElement("button");
                                pbarSteps.type = "button";
                                pbarSteps.classList.add("expandable-option");
                                pbarSteps.textContent = "Progress Bar Steps";
                                pbarSteps.addEventListener("click", (e) => {
                                    e.preventDefault();
                                    this.activeSection.value = "progressBarSteps";
                                });
                                return pbarSteps;
                            })(),
                            { visible: this.pbarExpanded.value }
                        );
                        this.pbarExpanded.addListener((value) => {
                            collapse.visible.value = value;
                        });
                        this.activeSection.addListenerAndInvoke((active) => {
                            if (active === "progressBarSteps") {
                                collapse.element.classList.add("active");
                            } else {
                                collapse.element.classList.remove("active");
                            }
                        });
                        return collapse.element;
                    })()
                );
                options.appendChild(
                    (() => {
                        const option = document.createElement("div");
                        option.classList.add("admin-navbar-option", "with-toggle");
                        if (this.tracesExpanded.value) {
                            option.classList.add("expanded");
                        }
                        this.activeSection.addListenerAndInvoke((active) => {
                            if (active === "traces") {
                                option.classList.add("active");
                            } else {
                                option.classList.remove("active");
                            }
                        });
                        option.appendChild(
                            (() => {
                                const traces = document.createElement("button");
                                traces.type = "button";
                                traces.textContent = "Traces";
                                traces.addEventListener("click", (e) => {
                                    e.preventDefault();
                                    this.activeSection.value = "traces";
                                });
                                return traces;
                            })()
                        );
                        option.appendChild(
                            (() => {
                                const toggle = document.createElement("button");
                                toggle.type = "button";
                                toggle.classList.add("icon-btn-expand-medium");
                                toggle.appendChild(
                                    (() => {
                                        const span = document.createElement("span");
                                        span.classList.add("icon-btn--icon");
                                        return span;
                                    })()
                                );
                                toggle.addEventListener("click", () => {
                                    this.tracesExpanded.value = !this.tracesExpanded.value;
                                    if (option.classList.contains("expanded")) {
                                        option.classList.remove("expanded");
                                    } else {
                                        option.classList.add("expanded");
                                    }
                                });
                                return toggle;
                            })()
                        );
                        return option;
                    })()
                );
                options.appendChild(
                    (() => {
                        const collapse = new Collapse(
                            (() => {
                                const traceSteps = document.createElement("button");
                                traceSteps.type = "button";
                                traceSteps.classList.add("expandable-option");
                                traceSteps.textContent = "Trace Steps";
                                traceSteps.addEventListener("click", (e) => {
                                    e.preventDefault();
                                    this.activeSection.value = "traceSteps";
                                });
                                return traceSteps;
                            })(),
                            { visible: this.tracesExpanded.value }
                        );
                        this.activeSection.addListenerAndInvoke((active) => {
                            if (active === "traceSteps") {
                                collapse.element.classList.add("active");
                            } else {
                                collapse.element.classList.remove("active");
                            }
                        });
                        this.tracesExpanded.addListener((value) => {
                            collapse.visible.value = value;
                        });
                        return collapse.element;
                    })()
                );
                return options;
            })()
        );
    }
    /**
     * persists the current state of the reader
     * @private
     */
    persist() {
        this.persister.store("admin-navbar", {
            activeSection: this.activeSection.value,
            pbarExpanded: this.pbarExpanded.value.toString(),
            tracesExpanded: this.tracesExpanded.value.toString(),
        });
    }
}
