import { CurrentUsageController } from "/js/app/user_usages/current_usage_controller.js";

/**
 * loads and renders the current and historic usages by month for the logged in user and
 * their current estimated bill based on their pricing plan
 */
export class UserUsagesController {
    constructor() {
        /**
         * the element this view is attached to
         * @type {Element}
         * @readonly
         */
        this.element = document.createElement("div");
        /**
         * the controller for the users current usage
         * @type {CurrentUsageController}
         * @readonly
         */
        this.currentUsageController = new CurrentUsageController();
        this.render();
    }
    /**
     * Adds the appropriate contents to the element for this view. Should
     * only be called once.
     * @private
     */
    render() {
        this.element.classList.add("user-usages-controller");
        this.element.appendChild(this.currentUsageController.element);
    }
}
