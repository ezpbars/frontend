import { Collapse } from "/js/app/resources/collapse.js";
import { Observable } from "/js/lib/observable.js";

/**
 * a view for common controls within a resource
 */
export class Controls {
    /**
     *
     * @param {object} kwargs keyword arguments
     * @param {function() : any | Promise.<any>} [kwargs.onDelete] the function
     *   to call when the delete button is pressed; null if there is no delete
     *   button
     * @param {function() : any | Promise.<any>} [kwargs.onEdit] the function to
     *   call when the edit button is pressed; null if there is no edit button
     * @param {Observable.<boolean>} [kwargs.editing] boolean which tracks if
     *   we're in edit mode for visual purposes
     */
    constructor({ onDelete = null, onEdit = null, editing = null }) {
        /**
         * the element this view is attached to
         * @type {Element}
         * @readonly
         */
        this.element = document.createElement("div");
        /**
         * the function to call when the delete button is pressed, null if there
         * is no delete button
         * @type {Observable.<function() : any | Promise.<any>>}
         * @readonly
         */
        this.onDelete = new Observable(onDelete);
        /**
         * the function to call when the edit button is pressed; null if there is
         * no edit button
         * @type {Observable.<function() : any | Promise.<any>>}
         * @readonly
         */
        this.onEdit = new Observable(onEdit);
        /**
         * tracks if we're in editing mode
         * @type {Observable.<boolean>}
         * @readonly
         */
        this.editing = editing;
        this.render();
    }
    /**
     * Adds the appropriate contents to the element for this view. Should
     * only be called once.
     * @private
     */
    render() {
        this.element.classList.add("resources-controls");
        this.element.appendChild((() => {
            const collapse = new Collapse((() => {
                const btn = document.createElement("button");
                if (this.editing === null) {
                    btn.classList.add("icon-btn-edit-medium");
                } else {
                    this.editing.addListenerAndInvoke((editing) => {
                        if (editing) {
                            btn.classList.remove("icon-btn-edit-medium");
                            btn.classList.add("icon-btn-check-medium");
                        } else {
                            btn.classList.remove("icon-btn-check-medium");
                            btn.classList.add("icon-btn-edit-medium");
                        }
                    });
                }
                btn.addEventListener("click", async (ev) => {
                    ev.preventDefault();
                    btn.disabled = true;
                    try {
                        await this.onEdit.value();
                    } finally {
                        btn.disabled = false;
                    }
                });
                btn.appendChild((() => {
                    const span = document.createElement("span");
                    span.classList.add("icon-btn--icon");
                    return span;
                })());
                return btn;
            })(), { visible: this.onEdit.value !== null });
            this.onEdit.addListener((onEdit) => {
                collapse.visible.value = onEdit !== null;
            });
            return collapse.element;
        })());
        this.element.appendChild((() => {
            const collapse = new Collapse((() => {
                const btn = document.createElement("button");
                btn.classList.add("icon-btn-delete-medium");
                btn.addEventListener("click", async (ev) => {
                    ev.preventDefault();
                    btn.disabled = true;
                    try {
                        await this.onDelete.value();
                    } finally {
                        btn.disabled = false;
                    }
                });
                btn.appendChild((() => {
                    const span = document.createElement("span");
                    span.classList.add("icon-btn--icon");
                    return span;
                })());
                return btn;
            })(), { visible: this.onDelete.value !== null });
            this.onDelete.addListener((onDelete) => {
                collapse.visible.value = onDelete !== null;
            });
            return collapse.element;
        })());
    }
}
