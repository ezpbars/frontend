import { Collapse } from "/js/app/resources/collapse.js";
import { AuthHelper } from "/js/auth_helper.js";
import { LOGIN_URL } from "/js/constants.js";
import { Observable } from "/js/lib/observable.js";

export class TitlebarController {
    constructor(activeLink) {
        /**
         * the element this view is attached to
         * @type {Element}
         * @readonly
         */
        this.element = document.createElement("div");
        this.activeLink = activeLink;
        this.reload();
    }
    /**
     * Adds the appropriate contents to the element for this view. Should
     * only be called once
     * @private
     */
    reload() {
        this.element.classList.add("titlebar-controller");
        const expanded = new Observable(false);
        this.element.appendChild(
            (() => {
                const toggle = document.createElement("button");
                toggle.classList.add("icon-btn-menu-large");
                toggle.appendChild(
                    (() => {
                        const span = document.createElement("span");
                        span.classList.add("icon-btn--icon");
                        return span;
                    })()
                );
                toggle.addEventListener("click", () => {
                    expanded.value = !expanded.value;
                });
                return toggle;
            })()
        );
        this.element.appendChild(
            (() => {
                const title = document.createElement("span");
                title.classList.add("titlebar-title");
                title.textContent = "ezpbars";
                if (
                    this.activeLink === "/tutorials.html" ||
                    this.activeLink === "/howto.html" ||
                    this.activeLink === "/references.html" ||
                    this.activeLink === "/explanation.html"
                ) {
                    title.textContent = "EZPBARS docs";
                    title.classList.add("titlebar-title-docs");
                }
                return title;
            })()
        );
        this.element.appendChild(
            (() => {
                const collapse = new Collapse(
                    (() => {
                        const menu = document.createElement("div");
                        menu.classList.add("titlebar-menu");
                        menu.appendChild(
                            (() => {
                                const navOptions = document.createElement("ul");
                                navOptions.classList.add("nav-options");
                                navOptions.appendChild(
                                    (() => {
                                        const navOption = document.createElement("li");
                                        navOption.classList.add("navbar-option");
                                        navOption.appendChild(
                                            (() => {
                                                const anchor = document.createElement("a");
                                                anchor.classList.add("navbar-option-link");
                                                anchor.textContent = "Home";
                                                anchor.href = "/index.html";
                                                return anchor;
                                            })()
                                        );
                                        return navOption;
                                    })()
                                );
                                navOptions.appendChild(
                                    (() => {
                                        const navOption = document.createElement("li");
                                        navOption.classList.add("navbar-option");
                                        navOption.appendChild(
                                            (() => {
                                                const anchor = document.createElement("a");
                                                anchor.classList.add("navbar-option-link");
                                                anchor.textContent = "Getting Started";
                                                anchor.href = "/tutorials.html";
                                                return anchor;
                                            })()
                                        );
                                        return navOption;
                                    })()
                                );
                                navOptions.appendChild(
                                    (() => {
                                        const navOption = document.createElement("li");
                                        navOption.classList.add("navbar-option");
                                        navOption.appendChild(
                                            (() => {
                                                const anchor = document.createElement("a");
                                                anchor.classList.add("navbar-option-link");
                                                anchor.textContent = "How-to";
                                                anchor.href = "/howto.html";
                                                return anchor;
                                            })()
                                        );
                                        return navOption;
                                    })()
                                );
                                navOptions.appendChild(
                                    (() => {
                                        const navOption = document.createElement("li");
                                        navOption.classList.add("navbar-option");
                                        navOption.appendChild(
                                            (() => {
                                                const anchor = document.createElement("a");
                                                anchor.classList.add("navbar-option-link");
                                                anchor.textContent = "Explanation";
                                                anchor.href = "/explanation.html";
                                                return anchor;
                                            })()
                                        );
                                        return navOption;
                                    })()
                                );
                                navOptions.appendChild(
                                    (() => {
                                        const navOption = document.createElement("li");
                                        navOption.classList.add("navbar-option");
                                        navOption.appendChild(
                                            (() => {
                                                const anchor = document.createElement("a");
                                                anchor.classList.add("navbar-option-link");
                                                anchor.textContent = "References";
                                                anchor.href = "/references.html";
                                                return anchor;
                                            })()
                                        );
                                        return navOption;
                                    })()
                                );
                                navOptions.appendChild(
                                    (() => {
                                        const navOption = document.createElement("li");
                                        navOption.classList.add("navbar-option");
                                        navOption.appendChild(
                                            (() => {
                                                const anchor = document.createElement("a");
                                                anchor.classList.add("navbar-option-link");
                                                anchor.textContent = "Pricing";
                                                anchor.href = "/pricing.html";
                                                if (AuthHelper.isLoggedIn()) {
                                                    anchor.href = "/dashboard.html";
                                                    anchor.textContent = "Dashboard";
                                                }
                                                return anchor;
                                            })()
                                        );
                                        return navOption;
                                    })()
                                );
                                navOptions.appendChild(
                                    (() => {
                                        const navOption = document.createElement("li");
                                        navOption.classList.add("navbar-option");
                                        navOption.appendChild(
                                            (() => {
                                                const anchor = document.createElement("a");
                                                anchor.classList.add("navbar-option-link");
                                                anchor.textContent = "Sign In";
                                                anchor.href = LOGIN_URL;
                                                if (AuthHelper.isLoggedIn()) {
                                                    anchor.textContent = "Sign Out";
                                                }
                                                return anchor;
                                            })()
                                        );
                                        return navOption;
                                    })()
                                );
                                return navOptions;
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
}
