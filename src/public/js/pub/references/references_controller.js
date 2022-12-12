import { apiUrl } from "/js/fetch_helper.js";
import { HeaderController } from "/js/pub/header/header_controller.js";
import { TitlebarController } from "/js/pub/mobile/titlebar_controller.js";

/**
 * Imported externally
 * @type {any}
 */
const SwaggerUIBundle = {}; // @@type-hint

export class ReferencesController {
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
        this.element.classList.add("references-controller");
        this.element.appendChild(this.headerController.element);
        this.element.appendChild(
            (() => {
                const ele = document.createElement("div");
                SwaggerUIBundle({
                    url: apiUrl("/api/1/openapi.json"),
                    domNode: ele,
                    layout: "BaseLayout",
                    deepLinking: true,
                    showExtensions: true,
                    showCommonExtensions: true,
                    oauth2RedirectUrl: window.location.origin + "/docs/oauth2-redirect",
                    presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
                });
                return ele;
            })()
        );
        this.element.appendChild(this.titleBarController.element);
    }
}
