import { Listing } from "/js/app/resources/listing.js";
import { PageableItems } from "/js/app/resources/pageable_items.js";
import { CurrentUsageController } from "/js/app/user_usages/current_usage_controller.js";
import { UserUsagesReader } from "/js/app/user_usages/user_usages_reader.js";
import { UserUsageFilterController } from "/js/app/user_usages/user_usage_filter_controller.js";
import { UserUsageView } from "/js/app/user_usages/user_usage_view.js";
import { simpleArrayListener } from "/js/lib/replica_listener.js";

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
        /**
         * the object responsible for fetching user usages from the api
         * @type {UserUsagesReader}
         * @readonly
         */
        this.reader = new UserUsagesReader({ persist: "query" });
        /**
         * the view for the items
         * @type {PageableItems.<UserUsageView>}
         * @readonly
         */
        this.itemsView = new PageableItems({ onMore: this.reader.loadNext.bind(this.reader) });
        this.reader.items.addArrayListenerAndInvoke(
            simpleArrayListener({
                insert: (index, userUsage) => {
                    const replica = userUsage.createReplica();
                    this.itemsView.items.items.splice(index, 0, new UserUsageView(replica));
                },
                remove: (index) => {
                    this.itemsView.items.items.splice(index, 1)[0].userUsage.detach();
                },
            })
        );
        this.reader.hasNextPage.addListenerAndInvoke((hasNext) => {
            this.itemsView.hasMore.value = hasNext;
        });
        /**
         * the view for changing the filters and sort
         * @type {UserUsageFilterController}
         * @readonly
         */
        this.filterController = new UserUsageFilterController(this.reader.filters.value, this.reader.sort.value);
        this.filterController.filters.addListener((filters) => {
            this.reader.filters.value = filters;
        });
        this.filterController.sort.addListener((sort) => {
            this.reader.sort.value = sort;
        });
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
        this.element.appendChild(
            (() => {
                const element = document.createElement("div");
                element.classList.add("user-usages-listing");
                element.appendChild(
                    new Listing(this.itemsView, { element: document.createElement("div") }, this.filterController)
                        .element
                );
                return element;
            })()
        );
    }
}
