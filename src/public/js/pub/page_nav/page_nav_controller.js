export class PageNav {
    constructor(activeSection) {
        /**
         * the element this view is attached to
         * @type {Element}
         * @readonly
         */
        this.element = document.createElement("div");
        this.activeSection = activeSection;
    }
    /**
     * Adds the appropriate contents to the element for this view. Should
     * only be called once
     * @private
     */
    reload() {
        this.element.classList.add("page-nav-controller");
        this.element.appendChild(
            (() => {
                const title = document.createElement("div");
                title.classList.add("page-nav-title");
                title.textContent = "On this page";
                return title;
            })()
        );
        this.element.appendChild(
            (() => {
                const options = document.createElement("nav");
                options.classList.add("page-nav-options", "column");
                options.appendChild(
                    (() => {
                        const option = document.createElement("div");
                        option.classList.add("page-nav-option");
                        option.appendChild(
                            (() => {
                                const link = document.createElement("a");
                                link.classList.add("page-nav-link");
                                link.textContent = "header 2";
                                link.href = "#header-2";
                                return link;
                            })()
                        );
                        return option;
                    })()
                );
                options.appendChild(
                    (() => {
                        const option = document.createElement("div");
                        option.classList.add("page-nav-option");
                        option.appendChild(
                            (() => {
                                const link = document.createElement("a");
                                link.classList.add("page-nav-link");
                                link.textContent = "header 3";
                                link.href = "#header-3";
                                return link;
                            })()
                        );
                        return option;
                    })()
                );
                return options;
            })()
        );
    }
}
