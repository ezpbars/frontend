import { Collapse } from "/js/app/resources/collapse.js";
import { Items } from "/js/app/resources/items.js";
import { Observable } from "/js/lib/observable.js";

/**
 * shows a series of items with a load more button which is conditionally shown
 * @template {{element: Element}} T the items that are being shown
 */
export class PageableItems {
    /**
     * creates an empty pageable item not showing the load more button
     * @param {object} kwargs keyword arguments
     * @param {function() : any | Promise.<any>} kwargs.onMore the function to
     *   call when the show more button is pressed; if it returns a promise, the
     *   show more button is disabled until the promise is resolved
     */
    constructor({ onMore }) {
        /**
         * The element this view is attached to
         * @type {Element}
         * @readonly
         */
        this.element = document.createElement("div");
        /**
         * the actual items that are shown
         * @type {Items.<T>}
         * @readonly
         */
        this.items = new Items();
        /**
         * if the button to load more items is shown
         * @type {Observable.<boolean>}
         * @readonly
         */
        this.hasMore = new Observable(false);
        /**
         * the function to call when the show more button is pressed; if it
         * returns a promise, the show more button is disabled until the
         * promise is resolved
         * @type {function() : any | Promise.<any>}
         */
        this.onMore = onMore;
        this.render();
    }
    /**
     * Adds the appropriate contents to the element for this view. Should
     * only be called once.
     * @private
     */
    render() {
        this.element.classList.add("resources-pageable-items");
        this.element.appendChild(this.items.element);
        this.element.appendChild(
            (() => {
                const collapse = new Collapse(
                    (() => {
                        const button = document.createElement("button");
                        button.classList.add("resources-pageable-items-load-more");
                        button.textContent = "Load More";
                        button.type = "button";
                        button.addEventListener("click", async (ev) => {
                            ev.preventDefault();
                            // TODO: error handling
                            button.disabled = true;
                            try {
                                await this.onMore();
                            } finally {
                                button.disabled = false;
                            }
                        });
                        return button;
                    })(),
                    { visible: this.hasMore.value }
                );
                this.hasMore.addListener((visible) => {
                    collapse.visible.value = visible;
                });
                return collapse.element;
            })()
        );
    }
}
