import { Observable } from "/js/lib/observable.js";
import { HeaderController } from "/js/pub/header/header_controller.js";
import { TitlebarController } from "/js/pub/mobile/titlebar_controller.js";

import hljsRaw from "/js/lib/highlight-core.js";
import hljsPython from "/js/lib/highlight-python.js";

/** @type {any} */
const hljs = hljsRaw;

hljs.registerLanguage("python", hljsPython);

export class HowtoController {
    constructor(activeLink) {
        /**
         * the element this view is attached to
         * @type {Element}
         * @readonly
         */
        this.element = document.createElement("div");
        this.headerController = new HeaderController(activeLink);
        this.titleBarController = new TitlebarController(activeLink);
        this.reload();
    }
    /**
     * Adds the appropriate contents to the element for this view. Should
     * only be called once
     * @private
     */
    reload() {
        this.element.classList.add("howto-controller");
        this.element.appendChild(this.headerController.element);
        this.element.appendChild(
            (() => {
                const content = document.createElement("div");
                content.classList.add("content");
                content.appendChild(
                    (() => {
                        const wrapper = document.createElement("div");
                        wrapper.classList.add("wrapper", "row");
                        wrapper.appendChild(
                            (() => {
                                const left = document.createElement("div");
                                left.classList.add("left");
                                left.appendChild(
                                    (() => {
                                        const title = document.createElement("h1");
                                        title.classList.add("title");
                                        title.textContent = "Title (h1)";
                                        return title;
                                    })()
                                );
                                left.appendChild(
                                    (() => {
                                        const description = document.createElement("div");
                                        description.classList.add("description");
                                        description.appendChild(
                                            (() => {
                                                const p = document.createElement("p");
                                                p.textContent =
                                                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
                                                return p;
                                            })()
                                        );
                                        description.appendChild(
                                            (() => {
                                                const p = document.createElement("p");
                                                p.textContent =
                                                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
                                                return p;
                                            })()
                                        );
                                        description.appendChild(
                                            (() => {
                                                const h2 = document.createElement("h2");
                                                h2.id = "header-2";
                                                h2.textContent = "header 2 h2";
                                                return h2;
                                            })()
                                        );
                                        description.appendChild(
                                            (() => {
                                                const p = document.createElement("p");
                                                p.textContent =
                                                    "Duis at consectetur lorem donec. Velit sed ullamcorper morbi tincidunt ornare massa eget. Nisl purus in mollis nunc sed. Sed nisi lacus sed viverra tellus in hac habitasse. Nunc pulvinar sapien et ligula ullamcorper malesuada proin. Aliquam eleifend mi in nulla posuere sollicitudin aliquam ultrices. Lectus vestibulum mattis ullamcorper velit sed. Platea dictumst quisque sagittis purus sit amet volutpat. Proin fermentum leo vel orci. Amet volutpat consequat mauris nunc congue nisi vitae. Et sollicitudin ac orci phasellus. Vestibulum lorem sed risus ultricies.";
                                                return p;
                                            })()
                                        );
                                        description.appendChild(
                                            (() => {
                                                const h3 = document.createElement("h3");
                                                h3.id = "header-3";
                                                h3.textContent = "header 3 h3";
                                                return h3;
                                            })()
                                        );
                                        description.appendChild(
                                            (() => {
                                                const p = document.createElement("p");
                                                p.textContent =
                                                    "Elementum sagittis vitae et leo duis. Arcu non sodales neque sodales ut etiam sit amet nisl. Amet venenatis urna cursus eget nunc scelerisque. Magna eget est lorem ipsum dolor sit. Quam elementum pulvinar etiam non. Vehicula ipsum a arcu cursus vitae. Tortor pretium viverra suspendisse potenti nullam. Vestibulum lorem sed risus ultricies tristique nulla. Mauris sit amet massa vitae tortor condimentum lacinia quis vel. Nec feugiat in fermentum posuere urna nec tincidunt. Aenean vel elit scelerisque mauris pellentesque pulvinar pellentesque habitant. Eget magna fermentum iaculis eu. Sapien nec sagittis aliquam malesuada. Suscipit tellus mauris a diam maecenas sed.";
                                                return p;
                                            })()
                                        );
                                        description.appendChild(
                                            (() => {
                                                const h4 = document.createElement("h4");
                                                h4.textContent = "header 4 h4";
                                                return h4;
                                            })()
                                        );
                                        description.appendChild(
                                            (() => {
                                                const h5 = document.createElement("h5");
                                                h5.textContent = "header 5 h5";
                                                return h5;
                                            })()
                                        );
                                        description.appendChild(
                                            (() => {
                                                const h6 = document.createElement("h6");
                                                h6.textContent = "header 6 h6";
                                                return h6;
                                            })()
                                        );
                                        return description;
                                    })()
                                );
                                return left;
                            })()
                        );
                        wrapper.appendChild(
                            (() => {
                                const right = document.createElement("div");
                                right.classList.add("right");
                                /**
                                 * @type {Observable.<"python"|"curl">}
                                 */
                                const activeTab = new Observable("python");
                                activeTab.addListenerAndInvoke((tab) => {
                                    if (tab === "python") {
                                        right.classList.add("python");
                                        right.classList.remove("curl");
                                    } else {
                                        right.classList.add("curl");
                                        right.classList.remove("python");
                                    }
                                });
                                right.appendChild(
                                    (() => {
                                        const box = document.createElement("div");
                                        box.classList.add("right-box");
                                        box.appendChild(
                                            (() => {
                                                const header = document.createElement("header");
                                                header.classList.add("box-header");
                                                header.appendChild(
                                                    (() => {
                                                        const python = document.createElement("button");
                                                        python.classList.add("python-btn");
                                                        python.textContent = "python";
                                                        python.addEventListener("click", () => {
                                                            activeTab.value = "python";
                                                        });
                                                        activeTab.addListenerAndInvoke((tab) => {
                                                            if (tab === "python") {
                                                                python.classList.add("active");
                                                            } else {
                                                                python.classList.remove("active");
                                                            }
                                                        });
                                                        return python;
                                                    })()
                                                );
                                                header.appendChild(
                                                    (() => {
                                                        const curl = document.createElement("button");
                                                        curl.classList.add("curl-btn");
                                                        curl.textContent = "curl";
                                                        curl.addEventListener("click", () => {
                                                            activeTab.value = "curl";
                                                        });
                                                        activeTab.addListenerAndInvoke((tab) => {
                                                            if (tab === "curl") {
                                                                curl.classList.add("active");
                                                            } else {
                                                                curl.classList.remove("active");
                                                            }
                                                        });
                                                        return curl;
                                                    })()
                                                );
                                                return header;
                                            })()
                                        );
                                        box.appendChild(
                                            (() => {
                                                const codeContent = document.createElement("div");
                                                codeContent.classList.add("code-content");
                                                codeContent.appendChild(
                                                    (() => {
                                                        const lineNumbers = document.createElement("div");
                                                        lineNumbers.classList.add("code-line-numbers");
                                                        for (let i = 1; i <= 3; i++) {
                                                            lineNumbers.appendChild(
                                                                (() => {
                                                                    const line = document.createElement("div");
                                                                    line.classList.add("code-line-number");
                                                                    line.textContent = i.toString();
                                                                    return line;
                                                                })()
                                                            );
                                                        }
                                                        return lineNumbers;
                                                    })()
                                                );
                                                codeContent.appendChild(
                                                    (() => {
                                                        const pre = document.createElement("pre");
                                                        pre.classList.add("box-code-pre");
                                                        pre.appendChild(
                                                            (() => {
                                                                const code = document.createElement("code");
                                                                code.classList.add("box-code");
                                                                const updateCode = () => {
                                                                    let codeText = "";
                                                                    if (activeTab.value === "python") {
                                                                        codeText =
                                                                            "EXAMPLE CODE HERE (PYTHON)\nNEXT LINE";
                                                                    } else if (activeTab.value === "curl") {
                                                                        codeText =
                                                                            "EXAMPLE CODE HERE (cURL)\nNEXT LINE";
                                                                    }
                                                                    code.textContent = "";
                                                                    const highlighted = hljs.highlight(codeText, {
                                                                        language: "python",
                                                                    });
                                                                    code.innerHTML = highlighted.value;
                                                                };
                                                                updateCode();
                                                                activeTab.addListener(updateCode);
                                                                return code;
                                                            })()
                                                        );
                                                        return pre;
                                                    })()
                                                );
                                                return codeContent;
                                            })()
                                        );
                                        return box;
                                    })()
                                );
                                return right;
                            })()
                        );
                        return wrapper;
                    })()
                );
                return content;
            })()
        );
        this.element.appendChild(this.titleBarController.element);
    }
}
