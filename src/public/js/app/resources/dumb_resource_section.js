import { Observable } from "/js/lib/observable.js";

/**
 * Similar to a resource section, except not smart in the sense it doesn't take
 * a replica listener and a property name, instead it takes a label and a value.
 */
export class DumbResourceSection {
    /**
     * @param {string | Element} label the label of the section
     * @param {string | Element} value the value of the section
     */
    constructor(label, value) {
        /**
         * the element this view is attached to
         * @type {Element}
         * @readonly
         */
        this.element = document.createElement("div");
        /**
         * the label of the section
         * @type {Observable.<string | Element>}
         * @readonly
         */
        this.label = new Observable(label);
        /**
         * the value of the section
         * @type {Observable.<string | Element>}
         * @readonly
         */
        this.value = new Observable(value);
        this.render();
    }

    /**
     * Adds the appropriate contents to the element for this view. Should
     * only be called once.
     * @private
     */
    render() {
        this.element.classList.add("resources-section");
        this.element.appendChild(
            (() => {
                const section = document.createElement("div");
                section.classList.add("resources-section-inner");
                section.appendChild(
                    (() => {
                        const resourcesKey = document.createElement("div");
                        resourcesKey.classList.add("resources-key");
                        this.label.addListenerAndInvoke((label) => {
                            if (typeof label === "string") {
                                resourcesKey.textContent = label;
                            } else {
                                resourcesKey.textContent = "";
                                resourcesKey.appendChild(label);
                            }
                        });
                        return resourcesKey;
                    })()
                );
                section.appendChild(
                    (() => {
                        const resourcesValue = document.createElement("div");
                        resourcesValue.classList.add("resources-value");
                        this.value.addListenerAndInvoke((value) => {
                            if (typeof value === "string") {
                                resourcesValue.textContent = value;
                            } else {
                                resourcesValue.textContent = "";
                                resourcesValue.appendChild(value);
                            }
                        });
                        return resourcesValue;
                    })()
                );
                return section;
            })()
        );
    }
}
