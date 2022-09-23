import { Collapse } from "/js/app/resources/collapse.js";
import { Observable } from "/js/lib/observable.js";
import { ArrayListenerOf, ListenerOf, newArrayListenerOf, ReplicaListener, simpleArrayListener } from "/js/lib/replica_listener.js";

/**
 * a single option that the user can choose
 * @template {string} K the key in the item which maps to the field they are searching on
 * @template {ReplicaListener & ListenerOf.<string, K>} Item the item type being searched
 */
class SearchControllerOption {
    /**
     * 
     * @param {K} key the field being searched
     * @param {Item} item the match for the search
     * @param {string} searchTerm the query string
     * @param {function() : any} onClick the function to call when the item is clicked
     */
    constructor(key, item, searchTerm, onClick) {
        /**
         * the element this view is attached to
         * @type {Element}
         * @readonly
         */
        this.element = document.createElement("button");
        /**
         * the field being searched
         * @type {K}
         * @readonly
         */
        this.key = key;
        /**
         * the match for the search
         * @type {Item}
         * @readonly
         */
        this.item = item;
        /**
         * the query string
         * @type {Observable.<string>}
         * @readonly
         */
        this.searchTerm = new Observable(searchTerm);
        /**
         * the function to call when an item is clicked
         * @type {function() : any}
         * @readonly
         */
        this.onClick = onClick;
        this.render();
    }
    /**
     * updates the children for when the search term or items field changes
     * @private
     */
    rerender() {
        this.element.textContent = "";
        const searchTerm = this.searchTerm.value;
        const result = this.item.get(this.key);
        if (searchTerm === "") {
            this.element.appendChild(document.createTextNode(result));
            return;
        }
        const resultLower = result.toLocaleLowerCase();
        const searchTermLower = searchTerm.toLocaleLowerCase();
        let lookingAt = 0;
        while (lookingAt < result.length) {
            let boldIndex = resultLower.indexOf(searchTermLower, lookingAt);
            if (boldIndex < 0) {
                this.element.appendChild(document.createTextNode(result.substring(lookingAt)));
                break;
            }
            if (lookingAt < boldIndex) {
                this.element.appendChild(document.createTextNode(result.substring(lookingAt, boldIndex)));
            }
            let boldEndsAt = boldIndex + searchTerm.length;
            while (resultLower.substring(boldEndsAt, boldEndsAt + searchTerm.length) === searchTermLower) {
                boldEndsAt += searchTerm.length;
            }
            this.element.appendChild((() => {
                const bold = document.createElement("b");
                bold.textContent = result.substring(boldIndex, boldEndsAt);
                return bold;
            })());
            lookingAt = boldEndsAt;
        }
    }
    /**
     * Adds the appropriate contents to the element for this view. Should
     * only be called once
     * @private
     */
    render() {
        this.element.classList.add("resources-search-controller-option");
        this.element.setAttribute("type", "button");
        this.element.addEventListener("click", (e) => {
            e.preventDefault();
            this.onClick();
        });
        this.rerender();
        this.searchTerm.addListener(this.rerender.bind(this));
        this.item.addListener(this.key, this.rerender.bind(this));
    }
}
/**
 * all of the options that the user can choose
 * @template {string} K the key in the item which maps to the field they are searching on
 * @template {ReplicaListener & ListenerOf.<string, K>} Item the item type being searched
 */
class SearchControllerOptionList {
    /**
     * 
     * @param {K} key the field that is being searched
     * @param {string} searchTerm the query string from the user
     * @param {function(Item) : any} onClick the function to call when an item is clicked
     */
    constructor(key, searchTerm, onClick) {
        /**
         * the element the view is attached to
         * @type {Element}
         * @readonly
         */
        this.element = document.createElement("div");
        /**
         * the field that is being searched
         * @type {K}
         * @readonly
         */
        this.key = key;
        /**
         * the query string from the user
         * @type {Observable.<string>}
         * @readonly
         */
        this.searchTerm = new Observable(searchTerm);
        /**
         * the function to call when an item is clicked
         * @type {function(Item) : any}
         * @readonly
         */
        this.onClick = onClick;
        /**
         * the options
         * @type {ArrayListenerOf.<Item>}
         * @readonly
         */
        this.options = newArrayListenerOf([]);
        this.render();
    }
    /**
     * Adds the appropriate contents to the element for this view. Should
     * only be called once
     * @private
     */
    render() {
        this.element.classList.add("resources-search-controller-options-list");
        /** @type {Array.<Item>} */
        const replicas = [];
        /** @type {Array.<function(string) : any>} */
        const listeners = [];
        this.options.addArrayListenerAndInvoke(simpleArrayListener({
            insert: (idx, val) => {
                const replica = val.createReplica();
                replicas.splice(idx, 0, replica);
                const view = new SearchControllerOption(this.key, replica, this.searchTerm.value, this.onClick.bind(this, val));
                /** @type {function(string) : any} */
                const listener = (searchTerm) => {
                    view.searchTerm.value = searchTerm;
                };
                this.searchTerm.addListener(listener);
                listeners.splice(idx, 0, listener);
                if (idx === 0) {
                    this.element.insertAdjacentElement("afterbegin", view.element);
                } else {
                    this.element.children[idx - 1].insertAdjacentElement("afterend", view.element);
                }
            },
            remove: (idx) => {
                this.element.children[idx].remove();
                replicas.splice(idx, 1)[0].detach();
                this.searchTerm.removeListener(listeners.splice(idx, 1)[0]);
            }
        }, { thisArg: this }));
    }
}

/**
 * given a reader for an item with a text searchable field, this shows a text
 * input which autocompletes to one of the items using the given text searchable
 * field
 * 
 * @template {string} K the key in the item which maps to the field they are searching on
 * @template {ReplicaListener & ListenerOf.<string, K>} Item the item type being searched
 * @template Filter the filter object capable of restricting items using a FilterTextItem
 */
export class SearchController {
    /**
     * @param {K} key the field being searched
     * @param {{items: ArrayListenerOf.<Item>, filters: Observable.<Filter>, limit: Observable.<number>}} reader 
     *   the reader-like object which ocntains the filters which update the items when changed
     * @param {function(Filter) : import("/js/app/resources/filter_text_item.js").FilterTextItem} filterGet 
     *   a work-around for the type system; should be (f) => f[key]
     * @param {function(Filter, import("/js/app/resources/filter_text_item.js").FilterTextItem) : Filter} filterSet
     *   a work-around for the type system; should be (f, v) => Object.assign({}, f, {[key]: v})
     */
    constructor(key, reader, filterGet, filterSet) {
        /**
         * the element this view is attached to
         * @type {Element}
         * @readonly
         */
        this.element = document.createElement("div");
        /**
         * the field being searched
         * @type {K}
         * @readonly
         */
        this.key = key;
        /**
         * the reader-like object which ocntains the filters which update the items when changed
         * @type {{items: ArrayListenerOf.<Item>, filters: Observable.<Filter>, limit: Observable.<number>}}
         * @readonly
         */
        this.reader = reader;
        /**
         * a work-around for the type system; should be (f) => f[key]
         * @type {function(Filter) : import("/js/app/resources/filter_text_item.js").FilterTextItem}
         * @readonly
         */
        this.filterGet = filterGet;
        /**
         * a work-around for the type system; should be (f, v) => f[key] = v
         * @type {function(Filter, import("/js/app/resources/filter_text_item.js").FilterTextItem) : Filter}
         * @readonly
         */
        this.filterSet = filterSet;
        /**
         * the query string
         * @type {Observable.<string>}
         * @readonly
         */
        this.searchTerm = new Observable("");
        /**
         * the item that they have selected
         * @type {Observable.<Item>}
         * @readonly
         */
        this.value = new Observable(null);
        /**
         * the options that the user can select from
         * @type {SearchControllerOptionList.<K, Item>}
         * @readonly
         * @private
         */
        this.options = new SearchControllerOptionList(key, "", (/** @param {Item} item */ (item) => {
            this.value.value = item;
        }).bind(this));
        this.searchTerm.addListener((searchTerm) => {
            this.value.value = null;
            this.options.searchTerm.value = searchTerm;
            if (searchTerm === "") {
                this.reader.filters.value = filterSet(this.reader.filters.value, null);
            } else {
                this.reader.filters.value = filterSet(this.reader.filters.value, {
                    operator: "ilike",
                    value: `%${searchTerm.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")}%`
                });
            }
        });
        this.reader.items.addArrayListenerAndInvoke({
            splice: (idx, deleteCount, ...items) => {
                this.options.options.splice(idx, deleteCount, ...items);
            },
            set: (arr) => {
                this.options.options.set(arr);
            }
        });
        this.render();
    }
    /**
     * Adds the appropriate contents to the element for this view. Should
     * only be called once
     * @private
     */
    render() {
        this.element.classList.add("resources-search-controller");
        const focused = new Observable(false);
        focused.addListener((focused) => {
            if (focused) {
                this.element.classList.add("resources-search-controller-focused");
            } else {
                this.element.classList.remove("resources-search-controller-focused");
            }
        });
        this.element.appendChild((() => {
            const div = document.createElement("div");
            div.classList.add("resources-search-controller-input-container");
            div.appendChild((() => {
                const input = document.createElement("input");
                input.type = "text";
                let eventCount = 0;
                input.addEventListener("focus", (e) => {
                    focused.value = true;
                    eventCount++;
                });
                input.addEventListener("blur", (e) => {
                    const id = ++eventCount;
                    setTimeout(() => {
                        if (eventCount === id) {
                            focused.value = false;
                        }
                    }, 100);
                });
                const updateInput = () => {
                    if (this.value.value !== null) {
                        input.value = this.value.value.get(this.key);
                    } else {
                        input.value = this.searchTerm.value;
                    }
                };
                this.value.addListener(updateInput);
                this.searchTerm.addListener(updateInput);
                updateInput();
                const handleChange = (() => {
                    this.searchTerm.value = input.value;
                }).bind(this);
                input.addEventListener("change", handleChange);
                input.addEventListener("keyup", handleChange);
                return input;
            })());
            return div;
        })());
        this.element.appendChild((() => {
            const collapse = new Collapse(this.options.element, { visible: this.value.value === null && focused.value });
            const updateVisibilty = () => {
                collapse.visible.value = this.value.value === null && focused.value;
            };
            this.value.addListener(updateVisibilty);
            focused.addListener(updateVisibilty);
            return collapse.element;
        })());
    }
}
