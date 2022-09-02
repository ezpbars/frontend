import { Observable } from "/js/lib/observable.js";

export class FormGroup {
    /**
     * 
     * @param {HTMLElement} child the input-like element
     * @param {string} labelText the text to go in the label
     */
    constructor(child, labelText) {
        /**
         * the element this view is attached to
         * @type {Element}
         * @readonly
         */
        this.element = document.createElement("div");
        /**
         * the text to go in the label describing the child
         * @type {Observable.<string>}
         * @readonly
         */
        this.labelText = new Observable(labelText);
        /**
         * the input-like child
         * @type {HTMLElement}
         * @readonly
         */
        this.child = child;
        /**
         * 
         * @type {string}
         * @readonly
         * @private
         */
        this.id = "res-" + Math.random().toString(36).substring(2);
        this.render();
    }
    render() {
        this.element.classList.add("resources-form-group");
        this.element.appendChild((() => {
            const label = document.createElement("label");
            label.setAttribute("for", this.id);
            this.labelText.addListenerAndInvoke((labelText) => {
                label.textContent = labelText;
            });
            return label;
        })());
        this.child.setAttribute("id", this.id);
        this.element.appendChild(this.child);
    }
}
