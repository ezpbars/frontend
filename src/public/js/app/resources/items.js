import { newArrayListenerOf, ArrayListenerOf, simpleArrayListener } from "/js/lib/replica_listener.js";

/**
 * A convenience class which shows a list of items typically within
 * an items section for a listing
 * @template {{ element: Element }} T the type of elements to render
 */
export class Items {
    /**
     * Creates a new empty list of items
     */
    constructor() {
        /**
         * The element this view is attached to
         * @type {Element}
         * @readonly
         */
        this.element = document.createElement("div");

        /**
         * The items which we are currently rendering, in the order
         * they appear
         * @type {ArrayListenerOf.<T>}
         * @readonly
         */
        this.items = newArrayListenerOf([]);

        this.render();
    }

    /**
     * Adds the appropriate contents to the element for this view. Should
     * only be called once.
     * @private
     */
    render() {
        this.element.classList.add("resources-items");

        this.items.addArrayListenerAndInvoke(simpleArrayListener({
            insert: (idx, val) => {
                if (idx === 0) {
                    this.element.insertAdjacentElement("afterbegin", val.element);
                } else {
                    this.element.children[idx - 1].insertAdjacentElement("afterend", val.element);
                }
            },
            remove: (idx) => {
                this.element.children[idx].remove();
            }
        }, { thisArg: this }));
    }
}
