import { Observable } from "/js/lib/observable.js";

/**
 * a generic class responsible for showing a list of a resource as well as the
 * ability to create delete filter and sort items where applicable, this also
 * allows updating the resources
 */
export class Listing {
    /**
     *
     * @param {{ element: Element }} itemsSection
     *   the section which displays the currently visible elements and
     *   the pagination controls (typically just in the form of a load
     *   more button)
     * @param {{ element: Element }} createSection
     *   the section which allows the user to create new items
     * @param {{ element: Element }} filterSection
     *   the section which allows the user to filter or sort the results
     */
    constructor(itemsSection, createSection, filterSection) {
        /**
         * The element this view is attached to
         * @type {Element}
         * @readonly
         */
        this.element = document.createElement("div");

        /**
         * the section which shows the loaded elements
         * @type {Observable.<{ element: Element }>}
         * @readonly
         */
        this.itemsSection = new Observable(itemsSection);

        /**
         * the section which allows the user to create new elements
         * @type {Observable.<{ element: Element }>}
         * @readonly
         */
        this.createSection = new Observable(createSection);

        /**
         * the section which allows the user to filter or sort
         * the items
         * @type {Observable.<{ element: Element }>}
         * @readonly
         */
        this.filterSection = new Observable(filterSection);

        this.render();
    }

    /**
     * Updates the contents of the element to reflect their current
     * values
     * @private
     */
    render() {
        this.element.classList.add("resource-listing");
        this.element.appendChild(
            (() => {
                const resourceListingLeft = document.createElement("div");
                resourceListingLeft.classList.add("resource-listing-left");
                resourceListingLeft.appendChild(
                    (() => {
                        const resourceListingItems = document.createElement("div");
                        resourceListingItems.classList.add("resource-listing-items");
                        this.itemsSection.addListenerAndInvoke((items) => {
                            resourceListingItems.textContent = "";
                            resourceListingItems.appendChild(items.element);
                        });
                        return resourceListingItems;
                    })()
                );
                resourceListingLeft.appendChild(
                    (() => {
                        const resourceListingCreate = document.createElement("div");
                        resourceListingCreate.classList.add("resource-listing-create");
                        this.createSection.addListenerAndInvoke((create) => {
                            resourceListingCreate.textContent = "";
                            resourceListingCreate.appendChild(create.element);
                        });
                        return resourceListingCreate;
                    })()
                );
                return resourceListingLeft;
            })()
        );
        this.element.appendChild(
            (() => {
                const resourceListingRight = document.createElement("div");
                resourceListingRight.classList.add("resource-listing-right");
                this.filterSection.addListenerAndInvoke((filter) => {
                    resourceListingRight.textContent = "";
                    resourceListingRight.appendChild(filter.element);
                });
                return resourceListingRight;
            })()
        );
    }
}
