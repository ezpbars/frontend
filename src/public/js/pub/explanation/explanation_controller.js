import { HeaderController } from "/js/pub/header/header_controller.js";
import { TitlebarController } from "/js/pub/mobile/titlebar_controller.js";

export class ExplanationController {
    constructor(activeLink) {
        /**
         * the element this view is attached to
         * @type {Element}
         * @readonly
         */
        this.element = document.createElement("div");
        this.headerController = new HeaderController(activeLink);
        this.titleBarController = new TitlebarController(activeLink);
        this.reload();
    }
    /**
     * Adds the appropriate contents to the element for this view. Should
     * only be called once
     * @private
     */
    reload() {
        this.element.classList.add("explanation-controller");
        this.element.appendChild(this.headerController.element);
        this.element.appendChild(this.titleBarController.element);
    }
}
