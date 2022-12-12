import { Observable } from "/js/lib/observable.js";
import hljsRaw from "/js/lib/highlight-core.js";
import hljsJavascript from "/js/lib/highlight-javascript.js";
import main_contentImages from "/js/pub/landing/main_content.images.js";

/** @type {any} */
const hljs = hljsRaw;

hljs.registerLanguage("javascript", hljsJavascript);

export class MainContentController {
    constructor() {
        /**
         * the element this view is attached to
         * @type {Element}
         * @readonly
         */
        this.element = document.createElement("div");
        this.reload();
    }
    /**
     * Adds the appropriate contents to the element for this view. Should
     * only be called once
     * @private
     */
    reload() {
        this.element.classList.add("main-content-controller");
        /** informative statements */
        this.element.appendChild(
            (() => {
                const section1 = document.createElement("div");
                section1.classList.add("wrapper", "content-section-1");
                section1.appendChild(
                    (() => {
                        const inner = document.createElement("div");
                        inner.classList.add("inner");
                        inner.appendChild(
                            (() => {
                                const container = document.createElement("section");
                                container.classList.add("content-section-1-container", "container");
                                container.appendChild(
                                    (() => {
                                        const header = document.createElement("div");
                                        header.classList.add("content-section-1-header");
                                        header.appendChild(
                                            (() => {
                                                const title = document.createElement("h2");
                                                title.classList.add("content-section-1-title");
                                                title.textContent = "the perfect progress bar";
                                                return title;
                                            })()
                                        );
                                        header.appendChild(
                                            (() => {
                                                const subtitle = document.createElement("p");
                                                subtitle.classList.add("content-section-1-subtitle");
                                                subtitle.textContent = "without the hassle";
                                                return subtitle;
                                            })()
                                        );
                                        return header;
                                    })()
                                );
                                container.appendChild(
                                    (() => {
                                        const sectionSubcontent = document.createElement("div");
                                        sectionSubcontent.classList.add("content-section-1-subcontents", "row");
                                        sectionSubcontent.appendChild(
                                            (() => {
                                                const subcontent = document.createElement("div");
                                                subcontent.classList.add("content-section-1-subcontent", "column");
                                                subcontent.appendChild(
                                                    (() => {
                                                        const picture = document.createElement("picture");
                                                        picture.classList.add("subcontent-image");
                                                        picture.appendChild(
                                                            (() => {
                                                                const source = document.createElement("source");
                                                                const image = main_contentImages.subcontent1;
                                                                source.srcset = image.target.outputs.webp
                                                                    .map((img) => `${img.url} ${img.width}w`)
                                                                    .join(", ");
                                                                source.type = "image/webp";
                                                                return source;
                                                            })()
                                                        );
                                                        picture.appendChild(
                                                            (() => {
                                                                const img = document.createElement("img");
                                                                const image = main_contentImages.subcontent1;
                                                                img.src = image.target.outputs.jpeg
                                                                    .map((img) => `${img.url} ${img.width}w`)
                                                                    .join(", ");
                                                                img.width = image.target.settings.width;
                                                                img.height = image.target.settings.height;
                                                                return img;
                                                            })()
                                                        );
                                                        return picture;
                                                    })()
                                                );
                                                subcontent.appendChild(
                                                    (() => {
                                                        const title = document.createElement("h1");
                                                        title.classList.add("subcontent-title");
                                                        title.textContent = "easy to use";
                                                        return title;
                                                    })()
                                                );
                                                subcontent.appendChild(
                                                    (() => {
                                                        const description = document.createElement("h3");
                                                        description.classList.add("subcontent-description");
                                                        description.textContent = "so easy my cat could use it";
                                                        return description;
                                                    })()
                                                );
                                                return subcontent;
                                            })()
                                        );
                                        sectionSubcontent.appendChild(
                                            (() => {
                                                const subcontent = document.createElement("div");
                                                subcontent.classList.add("content-section-1-subcontent", "column");
                                                subcontent.appendChild(
                                                    (() => {
                                                        const picture = document.createElement("picture");
                                                        picture.classList.add("subcontent-image");
                                                        picture.appendChild(
                                                            (() => {
                                                                const source = document.createElement("source");
                                                                const image = main_contentImages.subcontent2;
                                                                source.srcset = image.target.outputs.webp
                                                                    .map((img) => `${img.url} ${img.width}w`)
                                                                    .join(", ");
                                                                source.type = "image/webp";
                                                                return source;
                                                            })()
                                                        );
                                                        picture.appendChild(
                                                            (() => {
                                                                const img = document.createElement("img");
                                                                const image = main_contentImages.subcontent2;
                                                                img.src = image.target.outputs.jpeg
                                                                    .map((img) => `${img.url} ${img.width}w`)
                                                                    .join(", ");
                                                                img.width = image.target.settings.width;
                                                                img.height = image.target.settings.height;
                                                                return img;
                                                            })()
                                                        );
                                                        return picture;
                                                    })()
                                                );
                                                subcontent.appendChild(
                                                    (() => {
                                                        const title = document.createElement("h1");
                                                        title.classList.add("subcontent-title");
                                                        title.textContent = "free to start";
                                                        return title;
                                                    })()
                                                );
                                                subcontent.appendChild(
                                                    (() => {
                                                        const description = document.createElement("h3");
                                                        description.classList.add("subcontent-description");
                                                        description.textContent =
                                                            "first 5000 traces/month completely free";
                                                        return description;
                                                    })()
                                                );
                                                return subcontent;
                                            })()
                                        );
                                        sectionSubcontent.appendChild(
                                            (() => {
                                                const subcontent = document.createElement("div");
                                                subcontent.classList.add("content-section-1-subcontent", "column");
                                                subcontent.appendChild(
                                                    (() => {
                                                        const picture = document.createElement("picture");
                                                        picture.classList.add("subcontent-image");
                                                        picture.appendChild(
                                                            (() => {
                                                                const source = document.createElement("source");
                                                                const image = main_contentImages.subcontent3;
                                                                source.srcset = image.target.outputs.webp
                                                                    .map((img) => `${img.url} ${img.width}w`)
                                                                    .join(", ");
                                                                source.type = "image/webp";
                                                                return source;
                                                            })()
                                                        );
                                                        picture.appendChild(
                                                            (() => {
                                                                const img = document.createElement("img");
                                                                const image = main_contentImages.subcontent3;
                                                                img.src = image.target.outputs.jpeg
                                                                    .map((img) => `${img.url} ${img.width}w`)
                                                                    .join(", ");
                                                                img.width = image.target.settings.width;
                                                                img.height = image.target.settings.height;
                                                                return img;
                                                            })()
                                                        );
                                                        return picture;
                                                    })()
                                                );
                                                subcontent.appendChild(
                                                    (() => {
                                                        const title = document.createElement("h1");
                                                        title.classList.add("subcontent-title");
                                                        title.textContent = "easy to cancel";
                                                        return title;
                                                    })()
                                                );
                                                subcontent.appendChild(
                                                    (() => {
                                                        const description = document.createElement("h3");
                                                        description.classList.add("subcontent-description");
                                                        description.textContent = "we wont hide the cancel button";
                                                        return description;
                                                    })()
                                                );
                                                return subcontent;
                                            })()
                                        );
                                        return sectionSubcontent;
                                    })()
                                );
                                container.appendChild(
                                    (() => {
                                        const footer = document.createElement("div");
                                        footer.classList.add("content-section-1-footer");
                                        footer.appendChild(
                                            (() => {
                                                const p = document.createElement("p");
                                                p.classList.add("content-section-1-footer-text");
                                                p.textContent = "websockets got you down? let us handle it for you";
                                                return p;
                                            })()
                                        );
                                        return footer;
                                    })()
                                );
                                return container;
                            })()
                        );
                        return inner;
                    })()
                );
                return section1;
            })()
        );
        /** social proof */
        this.element.appendChild(
            (() => {
                const section2 = document.createElement("div");
                section2.classList.add("wrapper", "content-section-2");
                section2.appendChild(
                    (() => {
                        const inner = document.createElement("div");
                        inner.classList.add("inner");
                        inner.appendChild(
                            (() => {
                                const container = document.createElement("section");
                                container.classList.add("content-section-2-container", "container");
                                container.appendChild(
                                    (() => {
                                        const row = document.createElement("div");
                                        row.classList.add("row");
                                        row.appendChild(
                                            (() => {
                                                const item = document.createElement("div");
                                                item.classList.add("content-section-2-item", "column");
                                                item.appendChild(
                                                    (() => {
                                                        const section = document.createElement("section");
                                                        section.classList.add("content-section-2-item-section");
                                                        section.appendChild(
                                                            (() => {
                                                                const header = document.createElement("header");
                                                                header.classList.add("content-section-2-item-header");
                                                                header.appendChild(
                                                                    (() => {
                                                                        const title = document.createElement("h2");
                                                                        title.classList.add(
                                                                            "content-section-2-item-title"
                                                                        );
                                                                        title.textContent = "amazing!";
                                                                        return title;
                                                                    })()
                                                                );
                                                                header.appendChild(
                                                                    (() => {
                                                                        const subtitle = document.createElement("p");
                                                                        subtitle.classList.add(
                                                                            "content-section-2-item-subtitle"
                                                                        );
                                                                        subtitle.textContent = "some guy";
                                                                        return subtitle;
                                                                    })()
                                                                );
                                                                return header;
                                                            })()
                                                        );
                                                        section.appendChild(
                                                            (() => {
                                                                const text = document.createElement("p");
                                                                text.classList.add("content-section-2-item-text");
                                                                text.textContent =
                                                                    "this progress bar made me a billionare!";
                                                                return text;
                                                            })()
                                                        );
                                                        return section;
                                                    })()
                                                );
                                                return item;
                                            })()
                                        );
                                        row.appendChild(
                                            (() => {
                                                const item = document.createElement("div");
                                                item.classList.add("content-section-2-item", "column");
                                                item.appendChild(
                                                    (() => {
                                                        const section = document.createElement("section");
                                                        section.classList.add("content-section-2-item-section");
                                                        section.appendChild(
                                                            (() => {
                                                                const header = document.createElement("header");
                                                                header.classList.add("content-section-2-item-header");
                                                                header.appendChild(
                                                                    (() => {
                                                                        const title = document.createElement("h2");
                                                                        title.classList.add(
                                                                            "content-section-2-item-title"
                                                                        );
                                                                        title.textContent = "so simple!";
                                                                        return title;
                                                                    })()
                                                                );
                                                                header.appendChild(
                                                                    (() => {
                                                                        const subtitle = document.createElement("p");
                                                                        subtitle.classList.add(
                                                                            "content-section-2-item-subtitle"
                                                                        );
                                                                        subtitle.textContent = "different guy";
                                                                        return subtitle;
                                                                    })()
                                                                );
                                                                return header;
                                                            })()
                                                        );
                                                        section.appendChild(
                                                            (() => {
                                                                const text = document.createElement("p");
                                                                text.classList.add("content-section-2-item-text");
                                                                text.textContent =
                                                                    "i dont even know how to code and was able to use this!";
                                                                return text;
                                                            })()
                                                        );
                                                        return section;
                                                    })()
                                                );
                                                return item;
                                            })()
                                        );
                                        return row;
                                    })()
                                );
                                return container;
                            })()
                        );
                        return inner;
                    })()
                );
                return section2;
            })()
        );
        /** example code */
        this.element.appendChild(
            (() => {
                const section3 = document.createElement("div");
                section3.classList.add("wrapper", "content-section-3");
                section3.appendChild(
                    (() => {
                        const inner = document.createElement("div");
                        inner.classList.add("inner");
                        inner.appendChild(
                            (() => {
                                const container = document.createElement("section");
                                container.classList.add("content-section-3-container", "container");
                                container.appendChild(
                                    (() => {
                                        const left = document.createElement("div");
                                        left.classList.add("content-section-3-left", "column");
                                        left.appendChild(
                                            (() => {
                                                const header = document.createElement("header");
                                                header.classList.add("content-section-3-left-header");
                                                header.textContent = "Easy to use";
                                                return header;
                                            })()
                                        );
                                        left.appendChild(
                                            (() => {
                                                const text = document.createElement("p");
                                                text.classList.add("content-section-3-left-text");
                                                text.textContent = "We do the hard part so you dont have to.";
                                                return text;
                                            })()
                                        );
                                        return left;
                                    })()
                                );
                                container.appendChild(
                                    (() => {
                                        const right = document.createElement("div");
                                        /**
                                         * @type {Observable.<"frontend"|"backend">}
                                         */
                                        const activeTab = new Observable("frontend");

                                        right.classList.add("content-section-3-right");
                                        activeTab.addListenerAndInvoke((tab) => {
                                            if (tab === "frontend") {
                                                right.classList.add("frontend");
                                                right.classList.remove("backend");
                                            } else {
                                                right.classList.add("backend");
                                                right.classList.remove("frontend");
                                            }
                                        });
                                        right.appendChild(
                                            (() => {
                                                const box = document.createElement("div");
                                                box.classList.add("content-section-3-right-box");
                                                box.appendChild(
                                                    (() => {
                                                        const header = document.createElement("header");
                                                        header.classList.add("content-section-3-right-box-header");
                                                        header.appendChild(
                                                            (() => {
                                                                const frontend = document.createElement("button");
                                                                frontend.classList.add("frontend-btn");
                                                                frontend.textContent = "frontend";
                                                                frontend.addEventListener("click", () => {
                                                                    activeTab.value = "frontend";
                                                                });
                                                                activeTab.addListenerAndInvoke((tab) => {
                                                                    if (tab === "frontend") {
                                                                        frontend.classList.add("active");
                                                                    } else {
                                                                        frontend.classList.remove("active");
                                                                    }
                                                                });
                                                                return frontend;
                                                            })()
                                                        );
                                                        header.appendChild(
                                                            (() => {
                                                                const backend = document.createElement("button");
                                                                backend.classList.add("backend-btn");
                                                                backend.textContent = "backend";
                                                                backend.addEventListener("click", () => {
                                                                    activeTab.value = "backend";
                                                                });
                                                                activeTab.addListenerAndInvoke((tab) => {
                                                                    if (tab === "backend") {
                                                                        backend.classList.add("active");
                                                                    } else {
                                                                        backend.classList.remove("active");
                                                                    }
                                                                });
                                                                return backend;
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
                                                                for (let i = 1; i <= 34; i++) {
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
                                                                pre.classList.add(
                                                                    "content-section-3-right-box-code-pre"
                                                                );
                                                                pre.appendChild(
                                                                    (() => {
                                                                        const code = document.createElement("code");
                                                                        code.classList.add(
                                                                            "content-section-3-right-box-code"
                                                                        );
                                                                        const updateCode = () => {
                                                                            let codeText = "";
                                                                            if (activeTab.value === "frontend") {
                                                                                codeText =
                                                                                    "import {\n    waitForCompletion, StandardProgressDisplay\n} from 'ezpbarsjs';\n\nconst pbar = new StandardProgressDisplay();\ndocument.body.appendChild(pbar.element);\nconst response = await fetch(\n    'https://ezpbars.com/api/1/examples/job',\n    {\n       method: 'POST',\n       headers: {\n         'content-type': 'application/json; charset=UTF-8'\n       },\n       body: JSON.stringify({\n          duration: 5,\n          stdev: 1,\n    })}\n)\n/** @type {{uid: str, sub: str, pbar_name: str}} */\nconst data = await response.json();\nconst getResult = async () => {\n    const response = await fetch(\n      `https://ezpbars.com/api/1/examples/job?uid=${data.uid}`\n    )\n    const result = await response.json();\n    if (result.status === 'complete') {\n        return result.data;\n    }\n    return null;\n}\nconst pollResult = async () => (await getResult()) !== null;\nawait waitForCompletion({sub: data.sub, pbarName: data.pbar_name, uid: data.uid, pbar, pollResult});\nconsole.log(await getResult());";
                                                                            } else if (activeTab.value === "backend") {
                                                                                codeText =
                                                                                    "EXAMPLE CODE HERE (BACKEND)\nNEXT LINE";
                                                                            }
                                                                            code.textContent = "";
                                                                            const highlighted = hljs.highlight(
                                                                                codeText,
                                                                                {
                                                                                    language: "javascript",
                                                                                }
                                                                            );
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
                                return container;
                            })()
                        );
                        return inner;
                    })()
                );
                return section3;
            })()
        );
    }
}
