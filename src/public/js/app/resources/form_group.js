import { Collapse } from "/js/app/resources/collapse.js";
import { Observable } from "/js/lib/observable.js";

export class FormGroup {
    /**
     *
     * @param {Element} child the input-like element
     * @param {string} labelText the text to go in the label
     * @param {object} [kwargs] optional key word arguments
     * @param {string | Element} [kwargs.error] if specified, shown below the input, typically
     *   used to tell the user about errors the client is able to anticipate
     * @param {string | Element} [kwargs.help] if specified, show below the input, typically
     *   used to explain what they're choosing
     */
    constructor(child, labelText, kwargs) {
        kwargs = Object.assign({ error: null, help: null }, kwargs);
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
         * @type {Element}
         * @readonly
         */
        this.child = child;
        /**
         * if specified, shown below the input, typically used to tell the user
         * about errors the client is able to anticipate
         * @type {Observable.<string | Element>}
         * @readonly
         */
        this.error = new Observable(kwargs.error);
        /**
         * if specified, show below the input, typically used to explain what
         * they're choosing
         * @type {Observable.<string | Element>}
         * @readonly
         */
        this.help = new Observable(kwargs.help);
        /**
         *
         * @type {string}
         * @readonly
         * @private
         */
        this.id = "res-" + Math.random().toString(36).substring(2);
        this.render();
    }
    /**
     * Adds the appropriate contents to the element for this view. Should
     * only be called once
     * @private
     */
    render() {
        this.element.classList.add("resources-form-group");
        this.element.appendChild(
            (() => {
                const label = document.createElement("label");
                label.setAttribute("for", this.id);
                this.labelText.addListenerAndInvoke((labelText) => {
                    label.textContent = labelText;
                });
                return label;
            })()
        );
        this.child.setAttribute("id", this.id);
        this.element.appendChild(this.child);
        this.element.appendChild(
            (() => {
                const collapse = new Collapse(
                    (() => {
                        const div = document.createElement("div");
                        div.classList.add("resources-form-error");
                        this.error.addListenerAndInvoke((error) => {
                            if (error === null) {
                                return;
                            }
                            div.textContent = "";
                            if (typeof error === "string") {
                                div.textContent = error;
                            } else {
                                div.appendChild(error);
                            }
                        });
                        return div;
                    })(),
                    { visible: this.error.value !== null }
                );
                this.error.addListener((error) => {
                    collapse.visible.value = error !== null;
                });
                return collapse.element;
            })()
        );
        this.element.appendChild(
            (() => {
                const collapse = new Collapse(
                    (() => {
                        const div = document.createElement("div");
                        div.classList.add("resources-form-help");
                        this.help.addListenerAndInvoke((help) => {
                            if (help === null) {
                                return;
                            }
                            div.textContent = "";
                            if (typeof help === "string") {
                                div.textContent = help;
                            } else {
                                div.appendChild(help);
                            }
                        });
                        return div;
                    })(),
                    { visible: this.help.value !== null }
                );
                this.help.addListener((help) => {
                    collapse.visible.value = help !== null;
                });
                return collapse.element;
            })()
        );
    }
}
