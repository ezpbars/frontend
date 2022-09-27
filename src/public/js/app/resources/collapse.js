import { Observable } from "/js/lib/observable.js";

/**
 * handles showing or hiding a child element with the standard animation;
 * note that the child elements margin will never be collapsed in order to
 * preserve its size throughout the animation
 */
export class Collapse {
    /**
     *
     * @param {Element} child the element to show or hide
     * @param {object} kwargs the keyword arguments
     * @param {boolean} kwargs.visible if the element should initially be visible
     */
    constructor(child, { visible = false }) {
        /**
         * The element this view is attached to
         * @type {Element}
         * @readonly
         */
        this.element = document.createElement("div");
        /**
         * the element that's being shown or hidden
         * @type {Observable.<Element>}
         * @readonly
         */
        this.child = new Observable(child);
        /**
         * if the child is destined to be visible; there may be a short delay
         * (under half a second) while the animation is playing that this value
         * does not reflect the ture visibility of the element, however the
         * element will eventually match this visibility if it is not changed
         *
         * the listeners on this attribute will return a promise which resolves
         * as soon as one of two things happen:
         * 1. the value of visible is changed
         * 2. the elements visibilty now matches its new value
         * @type {Observable.<boolean>}
         * @readonly
         */
        this.visible = new Observable(visible);
        this.render();
    }
    /**
     * Adds the appropriate contents to the element for this view. Should
     * only be called once.
     * @private
     */
    render() {
        this.element.classList.add("resources-collapse");
        this.child.addListenerAndInvoke((child) => {
            this.element.textContent = "";
            this.element.appendChild(child);
        });
        this.visible.addListenerAndInvoke(async (visible) => {
            this.element.classList.remove("resources-collapse-visible", "resources-collapse-hidden");
            if (visible) {
                this.element.classList.add("resources-collapse-visible");
            } else {
                this.element.classList.add("resources-collapse-hidden");
            }
        });
    }
}
