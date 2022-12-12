import { HeaderController } from "/js/pub/header/header_controller.js";
import { FooterController } from "/js/pub/landing/footer_controller.js";
import { MainContentController } from "/js/pub/landing/main_content_controller.js";
import { TitlebarController } from "/js/pub/mobile/titlebar_controller.js";

export class LandingPageController {
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
        this.mainContentController = new MainContentController();
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
        this.element.classList.add("landing-page-controller");
        this.element.appendChild(this.headerController.element);
        this.element.appendChild(this.mainContentController.element);
        this.element.appendChild(this.footerController.element);
        this.element.appendChild(this.titleBarController.element);
    }
}
