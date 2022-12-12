export class BannerController {
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
        this.element.classList.add("banner-controller");
        this.element.appendChild(
            (() => {
                const subheader = document.createElement("h2");
                subheader.classList.add("subheader");
                subheader.appendChild(
                    (() => {
                        const title = document.createElement("strong");
                        title.textContent = "ezpbars:";
                        return title;
                    })()
                );
                subheader.appendChild(
                    (() => {
                        const subtitle = document.createElement("span");
                        subtitle.classList.add("subtitle");
                        subtitle.textContent = " an easy to use, fast, and accurate remote progress bar";
                        return subtitle;
                    })()
                );
                return subheader;
            })()
        );
        this.element.appendChild(
            (() => {
                const div = document.createElement("div");
                div.classList.add("get-started");
                div.appendChild(
                    (() => {
                        const paragraph = document.createElement("p");
                        paragraph.classList.add("cta");
                        paragraph.textContent = "get started with ezpbars now";
                        return paragraph;
                    })()
                );
                div.appendChild(
                    (() => {
                        const anchor = document.createElement("a");
                        anchor.classList.add("get-started-button");
                        anchor.href = "/tutorials.html";
                        anchor.textContent = "get started";
                        return anchor;
                    })()
                );
                return div;
            })()
        );
    }
}
