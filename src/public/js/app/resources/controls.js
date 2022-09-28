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
     * @param {Object.<string, string | function() : any>} [kwargs.contextMenu]
     *   the keys are the labels, the values are the callbacks or the urls
     * @param {Observable.<boolean>} [kwargs.editing] boolean which tracks if
     *   we're in edit mode for visual purposes
     */
    constructor({ onDelete = null, onEdit = null, editing = null, contextMenu = null }) {
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
         * the keys are the labels, the values are the callbacks or the urls
         * @type {Observable.<Object.<string, string | function() : any>>}
         * @readonly
         */
        this.contextMenu = new Observable(contextMenu);
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
        this.element.appendChild(
            (() => {
                const collapse = new Collapse(
                    (() => {
                        const div = document.createElement("div");
                        div.classList.add("resources-controls-more-container");
                        const open = new Observable(false);
                        open.addListenerAndInvoke((open) => {
                            if (open) {
                                div.classList.add("resources-controls-more-open");
                                div.classList.remove("resources-controls-more-closed");
                            } else {
                                div.classList.remove("resources-controls-more-open");
                                div.classList.add("resources-controls-more-closed");
                            }
                        });
                        div.appendChild(
                            (() => {
                                const btn = document.createElement("button");
                                btn.classList.add("icon-btn-more-medium");
                                btn.addEventListener("click", () => {
                                    open.value = !open.value;
                                });
                                btn.type = "button";
                                btn.appendChild(
                                    (() => {
                                        const span = document.createElement("span");
                                        span.classList.add("icon-btn--icon");
                                        return span;
                                    })()
                                );
                                return btn;
                            })()
                        );
                        div.appendChild(
                            (() => {
                                const menu = document.createElement("div");
                                menu.classList.add("resources-controls-more-menu");
                                this.contextMenu.addListenerAndInvoke((contextMenu) => {
                                    menu.textContent = "";
                                    if (contextMenu === null) {
                                        return;
                                    }
                                    for (const [label, callback] of Object.entries(contextMenu)) {
                                        menu.appendChild(
                                            (() => {
                                                if (typeof callback === "string") {
                                                    const a = document.createElement("a");
                                                    a.classList.add("resources-controls-more-menu-item");
                                                    a.href = callback;
                                                    a.textContent = label;
                                                    return a;
                                                }
                                                const item = document.createElement("button");
                                                item.classList.add("resources-controls-more-menu-item");
                                                item.textContent = label;
                                                item.addEventListener("click", callback);
                                                return item;
                                            })()
                                        );
                                    }
                                });
                                return menu;
                            })()
                        );
                        return div;
                    })(),
                    { visible: this.contextMenu.value !== null }
                );
                return collapse.element;
            })()
        );
        this.element.appendChild(
            (() => {
                const collapse = new Collapse(
                    (() => {
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
                        btn.appendChild(
                            (() => {
                                const span = document.createElement("span");
                                span.classList.add("icon-btn--icon");
                                return span;
                            })()
                        );
                        return btn;
                    })(),
                    { visible: this.onEdit.value !== null }
                );
                this.onEdit.addListener((onEdit) => {
                    collapse.visible.value = onEdit !== null;
                });
                return collapse.element;
            })()
        );
        this.element.appendChild(
            (() => {
                const collapse = new Collapse(
                    (() => {
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
                        btn.appendChild(
                            (() => {
                                const span = document.createElement("span");
                                span.classList.add("icon-btn--icon");
                                return span;
                            })()
                        );
                        return btn;
                    })(),
                    { visible: this.onDelete.value !== null }
                );
                this.onDelete.addListener((onDelete) => {
                    collapse.visible.value = onDelete !== null;
                });
                return collapse.element;
            })()
        );
    }
}
