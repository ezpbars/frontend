import { HeaderController } from "/js/pub/header/header_controller.js";
import { FooterController } from "/js/pub/landing/footer_controller.js";
import { TitlebarController } from "/js/pub/mobile/titlebar_controller.js";

export class PricingController {
    constructor(activeLink) {
        /**
         * the element this view is attached to
         * @type {Element}
         * @readonly
         */
        this.element = document.createElement("div");
        this.headerController = new HeaderController(activeLink);
        this.footerController = new FooterController();
        this.titleBarController = new TitlebarController(activeLink);
        this.reload();
    }
    /**
     * Adds the appropriate contents to the element for this view. Should
     * only be called once
     * @private
     */
    reload() {
        this.element.classList.add("pricing-controller");
        this.element.appendChild(this.headerController.element);
        this.element.appendChild(
            (() => {
                const container = document.createElement("div");
                container.classList.add("pricing-container", "column", "wrapper");
                container.appendChild(
                    (() => {
                        const header = document.createElement("div");
                        header.classList.add("pricing-header");
                        header.appendChild(
                            (() => {
                                const title = document.createElement("h1");
                                title.classList.add("pricing-title");
                                title.textContent = "Pay as you go";
                                return title;
                            })()
                        );
                        header.appendChild(
                            (() => {
                                const subtitle = document.createElement("h2");
                                subtitle.classList.add("pricing-subtitle");
                                subtitle.textContent = "or don't";
                                return subtitle;
                            })()
                        );
                        header.appendChild(
                            (() => {
                                const description = document.createElement("p");
                                description.classList.add("pricing-description");
                                description.textContent = "First 5000 traces free. Every Month";
                                return description;
                            })()
                        );
                        return header;
                    })()
                );
                container.appendChild(
                    (() => {
                        const inner = document.createElement("div");
                        inner.classList.add("payment-options-container", "row");
                        inner.appendChild(
                            (() => {
                                const payasyougo = document.createElement("div");
                                payasyougo.classList.add("payment-option");
                                payasyougo.appendChild(
                                    (() => {
                                        const title = document.createElement("h3");
                                        title.textContent = "Price per 1000 traces";
                                        return title;
                                    })()
                                );
                                payasyougo.appendChild(
                                    (() => {
                                        const price = document.createElement("div");
                                        price.classList.add("price");
                                        price.appendChild(
                                            (() => {
                                                const traces = document.createElement("div");
                                                traces.classList.add("traces");
                                                traces.textContent = "First " + (5000).toLocaleString();
                                                return traces;
                                            })()
                                        );
                                        price.appendChild(
                                            (() => {
                                                const cost = document.createElement("div");
                                                cost.classList.add("cost");
                                                cost.textContent = "FREE";
                                                return cost;
                                            })()
                                        );
                                        return price;
                                    })()
                                );
                                payasyougo.appendChild(
                                    (() => {
                                        const price = document.createElement("div");
                                        price.classList.add("price");
                                        price.appendChild(
                                            (() => {
                                                const traces = document.createElement("div");
                                                traces.classList.add("traces");
                                                traces.textContent = "Next " + (95000).toLocaleString();
                                                return traces;
                                            })()
                                        );
                                        price.appendChild(
                                            (() => {
                                                const cost = document.createElement("div");
                                                cost.classList.add("cost");
                                                cost.textContent = "$0.75";
                                                return cost;
                                            })()
                                        );
                                        return price;
                                    })()
                                );
                                payasyougo.appendChild(
                                    (() => {
                                        const price = document.createElement("div");
                                        price.classList.add("price");
                                        price.appendChild(
                                            (() => {
                                                const traces = document.createElement("div");
                                                traces.classList.add("traces");
                                                traces.textContent = "Next " + (900000).toLocaleString();
                                                return traces;
                                            })()
                                        );
                                        price.appendChild(
                                            (() => {
                                                const cost = document.createElement("div");
                                                cost.classList.add("cost");
                                                cost.textContent = "$0.50";
                                                return cost;
                                            })()
                                        );
                                        return price;
                                    })()
                                );
                                payasyougo.appendChild(
                                    (() => {
                                        const price = document.createElement("div");
                                        price.classList.add("price");
                                        price.appendChild(
                                            (() => {
                                                const traces = document.createElement("div");
                                                traces.classList.add("traces");
                                                traces.textContent = "Next " + (9000000).toLocaleString();
                                                return traces;
                                            })()
                                        );
                                        price.appendChild(
                                            (() => {
                                                const cost = document.createElement("div");
                                                cost.classList.add("cost");
                                                cost.textContent = "$0.25";
                                                return cost;
                                            })()
                                        );
                                        return price;
                                    })()
                                );
                                payasyougo.appendChild(
                                    (() => {
                                        const price = document.createElement("div");
                                        price.classList.add("price");
                                        price.appendChild(
                                            (() => {
                                                const traces = document.createElement("div");
                                                traces.classList.add("traces");
                                                traces.textContent = "All additional traces";
                                                return traces;
                                            })()
                                        );
                                        price.appendChild(
                                            (() => {
                                                const cost = document.createElement("div");
                                                cost.classList.add("cost");
                                                cost.textContent = "$0.10";
                                                return cost;
                                            })()
                                        );
                                        return price;
                                    })()
                                );
                                return payasyougo;
                            })()
                        );
                        return inner;
                    })()
                );
                return container;
            })()
        );
        this.element.appendChild(this.footerController.element);
        this.element.appendChild(this.titleBarController.element);
    }
}
