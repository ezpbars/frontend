import { AuthHelper } from "/js/auth_helper.js";
import { LOGIN_URL } from "/js/constants.js";

export class NavbarController {
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
        /**
         * The currently active link
         * @type {string}
         * @private
         */
        this.activeLink = activeLink;
        this.reload();
    }

    /**
     * Adds the appropriate contents to the element for this view. Should
     * only be called once
     * @private
     */
    reload() {
        this.element.classList.add("navbar-controller");
        this.element.appendChild(
            (() => {
                const nav = document.createElement("nav");
                nav.classList.add("navbar");
                nav.appendChild(
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
                                        if (this.activeLink === "/index.html") {
                                            anchor.classList.add("active");
                                        } else {
                                            anchor.classList.remove("active");
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
                                        anchor.textContent = "Getting Started";
                                        anchor.href = "/tutorials.html";
                                        if (this.activeLink === "/tutorials.html") {
                                            anchor.classList.add("active");
                                        } else {
                                            anchor.classList.remove("active");
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
                                        anchor.textContent = "How-to";
                                        anchor.href = "/howto.html";
                                        if (this.activeLink === "/howto.html") {
                                            anchor.classList.add("active");
                                        } else {
                                            anchor.classList.remove("active");
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
                                        anchor.textContent = "Explanation";
                                        anchor.href = "/explanation.html";
                                        if (this.activeLink === "/explanation.html") {
                                            anchor.classList.add("active");
                                        } else {
                                            anchor.classList.remove("active");
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
                                        anchor.textContent = "References";
                                        anchor.href = "/references.html";
                                        if (this.activeLink === "/references.html") {
                                            anchor.classList.add("active");
                                        } else {
                                            anchor.classList.remove("active");
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
                                        anchor.textContent = "Pricing";
                                        anchor.href = "/pricing.html";
                                        if (
                                            this.activeLink === "/pricing.html" ||
                                            this.activeLink === "/dashboard.html"
                                        ) {
                                            anchor.classList.add("active");
                                        } else {
                                            anchor.classList.remove("active");
                                        }
                                        if (AuthHelper.isLoggedIn()) {
                                            anchor.textContent = "Dashboard";
                                            anchor.href = "/dashboard.html";
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
                                        if (AuthHelper.isLoggedIn()) {
                                            const btn = document.createElement("button");
                                            btn.classList.add("navbar-option-link");
                                            btn.textContent = "Sign Out";
                                            btn.type = "button";
                                            btn.addEventListener("click", (e) => {
                                                e.preventDefault();
                                                AuthHelper.clear();
                                                window.location.reload();
                                            });
                                            return btn;
                                        } else {
                                            const anchor = document.createElement("a");
                                            anchor.classList.add("navbar-option-link");
                                            anchor.textContent = "Sign In";
                                            anchor.href = LOGIN_URL;
                                            return anchor;
                                        }
                                    })()
                                );
                                return navOption;
                            })()
                        );
                        return navOptions;
                    })()
                );
                return nav;
            })()
        );
    }

    toggleMenu() {}
}
