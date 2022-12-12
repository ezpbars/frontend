import { Collapse } from "/js/app/resources/collapse.js";
import { Controls } from "/js/app/resources/controls.js";
import { AuthHelper } from "/js/auth_helper.js";
import { Observable } from "/js/lib/observable.js";
import { PERSISTERS } from "/js/persist_utils.js";

export class MobileAdminNavbarController {
    /**
     * @param {Observable.<import("/js/pub/dashboard/admin_navbar.js").AdminSection>} activeSection The active section; we mutate this value
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
         * @type {Observable.<import("/js/pub/dashboard/admin_navbar.js").AdminSection>}
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
        this.reload();
    }
    /**
     * Adds the appropriate contents to the element for this view. Should
     * only be called once
     * @private
     */
    reload() {
        this.element.classList.add("mobile-admin-navbar-controller", "closed");
        this.element.appendChild(
            (() => {
                const toggle = document.createElement("button");
                toggle.classList.add("icon-btn-expandup-large");
                toggle.appendChild(
                    (() => {
                        const span = document.createElement("span");
                        span.classList.add("icon-btn--icon");
                        return span;
                    })()
                );
                toggle.addEventListener("click", () => {
                    expanded.value = !expanded.value;
                    if (expanded.value) {
                        this.element.classList.remove("closed");
                        this.element.classList.add("open");
                    } else {
                        this.element.classList.remove("open");
                        this.element.classList.add("closed");
                    }
                });
                return toggle;
            })()
        );
        this.element.appendChild(
            (() => {
                const header = document.createElement("div");
                header.classList.add("mobile-admin-navbar-header");
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
        const expanded = new Observable(false);
        this.element.appendChild(
            (() => {
                const collapse = new Collapse(
                    (() => {
                        const menu = document.createElement("div");
                        menu.classList.add("mobile-admin-navbar-menu");
                        menu.appendChild(
                            (() => {
                                const options = document.createElement("div");
                                options.classList.add("mobile-admin-navbar-options", "column");
                                options.appendChild(
                                    (() => {
                                        const option = document.createElement("div");
                                        option.classList.add("mobile-admin-navbar-option");
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
                                        option.classList.add("mobile-admin-navbar-option");
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
                                        option.classList.add("mobile-admin-navbar-option", "with-more");
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
                                                const controls = new Controls({
                                                    contextMenu: {
                                                        "Progress Bar Steps": () =>
                                                            (this.activeSection.value = "progressBarSteps"),
                                                    },
                                                });
                                                return controls.element;
                                            })()
                                        );
                                        return option;
                                    })()
                                );
                                options.appendChild(
                                    (() => {
                                        const option = document.createElement("div");
                                        option.classList.add("mobile-admin-navbar-option", "with-more");
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
                                                const controls = new Controls({
                                                    contextMenu: {
                                                        "Trace Steps": () => (this.activeSection.value = "traceSteps"),
                                                    },
                                                });
                                                return controls.element;
                                            })()
                                        );
                                        return option;
                                    })()
                                );
                                return options;
                            })()
                        );
                        return menu;
                    })(),
                    { visible: expanded.value }
                );
                expanded.addListener((value) => {
                    collapse.visible.value = value;
                });
                return collapse.element;
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
        });
    }
}
