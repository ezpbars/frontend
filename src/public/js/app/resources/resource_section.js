import { Collapse } from "/js/app/resources/collapse.js";
import { Observable } from "/js/lib/observable.js";
import { ListenerOf, ReplicaListener } from "/js/lib/replica_listener.js";

/**
 * a section to show or edit the value of a particular key of a particular resource
 * @template T the value type
 * @template {string} K the key
 */
export class ResourceSection {
    /**
     *
     * @param {ReplicaListener & ListenerOf<T,K>} data the underlying resource
     * @param {K} key the key to use
     * @param {object} kwargs keyword arguments
     * @param {function(T) : string | Node | null} [kwargs.formatter] used to
     *   format the value into the element; a string is used as text content, a
     *   Node is inserted, and null collapses the entire section. Defaults to
     *   toString
     * @param {object} [kwargs.edit] if the resource should be editable,
     *   configures how it is edited
     * @param {function(string) : T } [kwargs.edit.fromString] if the editing
     *   node is not defined, then a standard input will be used and this will
     *   be passed the value of the input to convert to the expected type.
     *   ignored if the editing node is defined
     * @param {Node} [kwargs.edit.editingNode] the node to use when in editing
     *   mode
     * @param {Observable.<boolean>} kwargs.edit.editing we add a listener to
     *   determine when we are in editing mode
     */
    constructor(data, key, { formatter = undefined, edit = undefined }) {
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
        /**
         * if the resource should be editable, configures how it is edited
         * @type {?{fromString:?function(string):T, editingNode:?Node, editing:Observable.<boolean>}}
         * @readonly
         */
        this.edit = edit !== undefined ? Object.assign({
            fromString: null,
            editingNode: (() => {
                if (edit.editingNode !== null && edit.editingNode !== undefined) {
                    return null;
                }
                const input = document.createElement("input");
                input.classList.add("resources-section-edit-input");
                input.type = "text";
                input.placeholder = key;
                data.addListenerAndInvoke(key, (val) => {
                    const formatted = this.formatter(val);
                    if (typeof (formatted) !== "string") {
                        throw "uneditable format node";
                    }
                    input.value = formatted;
                });
                input.addEventListener("change", (e) => {
                    data.set(key, this.edit.fromString(input.value));
                });
                return input;
            })(),
            editing: null
        }, edit) : null;
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
                    const valueCollapse = new Collapse((() => {
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
                    })(), { visible: this.edit === null || !this.edit.editing.value });
                    if (this.edit !== null) {
                        this.edit.editing.addListener((editing) => {
                            valueCollapse.visible.value = !editing;
                        });
                    }
                    return valueCollapse.element;
                })());
                if (this.edit !== null) {
                    section.appendChild((() => {
                        const inputCollapse = new Collapse((() => {
                            const div = document.createElement("div");
                            div.classList.add("resources-section-edit-container");
                            div.appendChild(this.edit.editingNode);
                            return div;
                        })(), { visible: this.edit.editing.value });
                        this.edit.editing.addListener(((editing) => {
                            inputCollapse.visible.value = editing;
                        }));
                        return inputCollapse.element;
                    })());
                }
                return section;
            })(), { visible: this.formatter(this.data.get(this.key)) !== null });
            return collapse.element;
        })());
    }
}
