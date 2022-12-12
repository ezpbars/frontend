import { BannerController } from "/js/pub/landing/banner_controller.js";
import { NavbarController } from "/js/pub/navbar/navbar_controller.js";
import headerImages from "/js/pub/header/header.images.js";

export class HeaderController {
    /**
     *
     * @param {string} activeLink the path to the current page e.g. "/index.html"
     */
    constructor(activeLink) {
        /**
         * the element this view is attached to
         * @type {Element}
         * @readonly
         */
        this.element = document.createElement("div");
        /**
         * the path to the current page e.g. "/index.html"
         * @type {string}
         * @private
         */
        this.activeLink = activeLink;
        this.navbarController = new NavbarController(activeLink);
        this.bannerController = new BannerController();
        this.reload();
    }
    /**
     * Adds the appropriate contents to the element for this view. Should
     * only be called once
     * @private
     */
    reload() {
        this.element.classList.add("header-controller");
        this.element.appendChild(
            (() => {
                /**
                 * selects the first size bigger on both dimensions, otherwise, the largest
                 * area
                 * @param {Array.<{width: number, height: number, url: string, choice: string}>} targets
                 * @param {number} width render width
                 * @param {number} height render height
                 * @returns {{width: number, height: number, url: string, choice: string}}
                 */
                const selectTarget = (targets, width, height) => {
                    let biggestRelevantArea = 0;
                    let smallestOverflowArea = Infinity;
                    let bestChoice = null;

                    for (const target of targets) {
                        const relevantWidth = Math.min(target.width, width);
                        const relevantHeight = Math.min(target.height, height);
                        const relevantArea = relevantWidth * relevantHeight;

                        let overflowArea = 0;
                        if (target.width > width && target.height > height) {
                            overflowArea = target.width * target.height - width * height;
                        } else if (target.width > width) {
                            overflowArea = (target.width - width) * target.height;
                        } else if (target.height > height) {
                            overflowArea = (target.height - height) * target.width;
                        }

                        if (relevantArea > biggestRelevantArea) {
                            biggestRelevantArea = relevantArea;
                            smallestOverflowArea = overflowArea;
                            bestChoice = target;
                        } else if (relevantArea === biggestRelevantArea && overflowArea < smallestOverflowArea) {
                            smallestOverflowArea = overflowArea;
                            bestChoice = target;
                        }
                    }

                    return bestChoice;
                };

                const picture = document.createElement("picture");

                /**
                 * @returns {{width: number, height: number, retry: boolean}}
                 */
                const getTargetSize = () => {
                    if (document.body.contains(picture)) {
                        const rect = picture.getBoundingClientRect();
                        return { width: rect.width, height: rect.height, retry: false };
                    } else {
                        return { width: window.innerWidth, height: 1, retry: true };
                    }
                };
                picture.classList.add("header-image");
                picture.appendChild(
                    (() => {
                        const source = document.createElement("source");
                        const setSrcSet = () => {
                            let image = headerImages.header;
                            const targetSize = getTargetSize();
                            const target = selectTarget(image.target.outputs.webp, targetSize.width, targetSize.height);
                            source.srcset = target.url;

                            if (targetSize.retry) {
                                setTimeout(setSrcSet, 1000);
                            }
                        };
                        setSrcSet();
                        window.addEventListener("resize", setSrcSet);
                        source.type = "image/webp";
                        return source;
                    })()
                );
                picture.appendChild(
                    (() => {
                        const img = document.createElement("img");
                        const setSrc = () => {
                            let image = headerImages.header;
                            const targetSize = getTargetSize();
                            const target = selectTarget(image.target.outputs.jpeg, targetSize.width, targetSize.height);

                            img.src = target.url;
                            img.width = target.width;
                            img.height = target.height;

                            if (targetSize.retry) {
                                setTimeout(setSrc, 1000);
                            }
                        };
                        setSrc();
                        window.addEventListener("resize", setSrc);
                        img.alt = "header image";
                        return img;
                    })()
                );
                return picture;
            })()
        );
        this.element.appendChild(
            (() => {
                const container = document.createElement("div");
                container.classList.add("header-container");
                container.appendChild(
                    (() => {
                        const header = document.createElement("header");
                        header.classList.add("header");
                        header.appendChild(this.navbarController.element);
                        header.appendChild(
                            (() => {
                                const inner = document.createElement("div");
                                inner.classList.add("header-inner");
                                inner.appendChild(
                                    (() => {
                                        const title = document.createElement("h1");
                                        title.classList.add("header-title");
                                        title.appendChild(
                                            (() => {
                                                const anchor = document.createElement("a");
                                                anchor.href = "/index.html";
                                                anchor.textContent = "ezpbars";
                                                return anchor;
                                            })()
                                        );
                                        if (
                                            this.activeLink === "/tutorials.html" ||
                                            this.activeLink === "/howto.html" ||
                                            this.activeLink === "/references.html" ||
                                            this.activeLink === "/explanation.html"
                                        ) {
                                            title.appendChild(
                                                (() => {
                                                    const docs = document.createElement("div");
                                                    docs.classList.add("header-title-docs");
                                                    docs.textContent = "Docs";
                                                    return docs;
                                                })()
                                            );
                                        }
                                        return title;
                                    })()
                                );
                                inner.appendChild(this.navbarController.element);
                                return inner;
                            })()
                        );
                        return header;
                    })()
                );
                if (this.activeLink === "/index.html") {
                    container.appendChild(this.bannerController.element);
                }
                return container;
            })()
        );
    }
}
