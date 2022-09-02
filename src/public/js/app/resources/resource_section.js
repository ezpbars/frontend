import { Collapse } from "/js/app/resources/collapse.js";
import { ListenerOf, ReplicaListener } from "/js/lib/replica_listener.js";

/**
 * a section to show the value of a particular key of a particular resource
 * @template T the value type
 * @template {string} K the key
 */
export class ResourceSection {
    /**
     * 
     * @param {ReplicaListener & ListenerOf<T,K>} data the underlying resource
     * @param {K} key the key to use
     * @param {object} kwargs keyword arguments
     * @param {function(T) : string | Node | null} [kwargs.formatter] used to format the value
     *   into the element; a string is used as text content, a Node is inserted, and null
     *   collapses the entire section. Defaults to toString
     */
    constructor(data, key, { formatter = undefined }) {
        /**
         * The element this view is attached to
         * @type {Element}
         * @readonly
         */
        this.element = document.createElement("div");
        /**
         * the underlying resource
         * @type {ReplicaListener & ListenerOf<T,K>}
         * @readonly
         */
        this.data = data;
        /**
         * the key to use
         * @type {K}
         * @readonly
         */
        this.key = key;
        /**
         * formats the value into the element; a string is used as text content, a Node is inserted, and null
         * collapses the entire section. Defaults to toString
         * @type {function(T) : string | Node | null}
         * @readonly
         */
        this.formatter = formatter !== undefined ? formatter : /** @param {T} o */ (o) => (o === null ? "null" : o.toString());
        this.render();
    }
    /**
     * Adds the appropriate contents to the element for this view. Should
     * only be called once.
     * @private
     */
    render() {
        this.element.classList.add("resources-section");
        this.element.appendChild((() => {
            const collapse = new Collapse((() => {
                const section = document.createElement("div");
                section.classList.add("resources-section-inner");
                section.appendChild((() => {
                    const resourcesKey = document.createElement("div");
                    resourcesKey.classList.add("resources-key");
                    resourcesKey.textContent = this.key;
                    return resourcesKey;
                })());
                section.appendChild((() => {
                    const resourcesValue = document.createElement("div");
                    resourcesValue.classList.add("resources-value");
                    this.data.addListenerAndInvoke(this.key, (t) => {
                        const formatted = this.formatter(t);
                        if (formatted === null) {
                            resourcesValue.textContent = "";
                        } else if (typeof (formatted) === "string") {
                            resourcesValue.textContent = formatted;
                        } else {
                            resourcesValue.textContent = "";
                            resourcesValue.appendChild(formatted);
                        }
                    });
                    return resourcesValue;
                })());
                return section;
            })(), { visible: this.formatter(this.data.get(this.key)) !== null });
            return collapse.element;
        })());
    }
}
