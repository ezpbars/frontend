export class FooterController {
    constructor() {
        /**
         * the element this view is attached to
         * @type {Element}
         * @readonly
         */
        this.element = document.createElement("div");
        this.reload();
    }
    /**
     * Adds the appropriate contents to the element for this view. Should
     * only be called once
     * @private
     */
    reload() {
        this.element.classList.add("footer-controller");
        this.element.appendChild(
            (() => {
                const container = document.createElement("div");
                container.classList.add("footer-container", "row");
                container.appendChild(
                    (() => {
                        const column1 = document.createElement("section");
                        column1.classList.add("footer-column-wrapper");
                        column1.appendChild(
                            (() => {
                                const header = document.createElement("h2");
                                header.classList.add("footer-column-header");
                                header.textContent = "helpful links";
                                return header;
                            })()
                        );
                        column1.appendChild(
                            (() => {
                                const content = document.createElement("ul");
                                content.classList.add("footer-column-content", "column");
                                content.appendChild(
                                    (() => {
                                        const item = document.createElement("li");
                                        item.classList.add("footer-column-content-item");
                                        item.appendChild(
                                            (() => {
                                                const anchor = document.createElement("a");
                                                anchor.classList.add("footer-column-content-item-link");
                                                anchor.textContent = "helpful";
                                                anchor.href = "";
                                                return anchor;
                                            })()
                                        );
                                        return item;
                                    })()
                                );
                                content.appendChild(
                                    (() => {
                                        const item = document.createElement("li");
                                        item.classList.add("footer-column-content-item");
                                        item.appendChild(
                                            (() => {
                                                const anchor = document.createElement("a");
                                                anchor.classList.add("footer-column-content-item-link");
                                                anchor.textContent = "links";
                                                anchor.href = "";
                                                return anchor;
                                            })()
                                        );
                                        return item;
                                    })()
                                );
                                return content;
                            })()
                        );
                        return column1;
                    })()
                );
                return container;
            })()
        );
    }
}
