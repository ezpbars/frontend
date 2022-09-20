import { parseProgressBar } from "/js/app/progress_bars/progress_bar.js";
import { FormGroup } from "/js/app/resources/form_group.js";
import { AuthHelper } from "/js/auth_helper.js";
import { apiUrl } from "/js/fetch_helper.js";
import { Observable } from "/js/lib/observable.js";


export class CreateProgressBarFormController {
    /**
     * 
     * @param {function(import("/js/app/progress_bars/progress_bar.js").ProgressBar) : any} onCreated the function to call when the form id submitted
     */
    constructor(onCreated) {
        /**
         * the element this function is atteched to
         * @type {Element}
         * @readonly
         */
        this.element = document.createElement("div");
        /**
         * the function to call after the form is submitted
         * @type {function(import("/js/app/progress_bars/progress_bar.js").ProgressBar) : any}
         */
        this.onCreated = onCreated;
        this.render();
    }
    /**
     * Adds the appropriate contents to the element for this view. Should
     * only be called once.
     * @private
     */
    render() {
        this.element.textContent = "";
        this.element.classList.add("elevation-medium");
        this.element.appendChild((() => {
            const form = document.createElement("form");
            form.classList.add("progress-bar-create-form");
            const name = new Observable("");
            form.appendChild((() => {
                const formGroup = new FormGroup((() => {
                    const input = document.createElement("input");
                    input.type = "text";
                    input.name = "name";
                    input.id = "progress-bar-create-form-name";
                    input.setAttribute("required", "");
                    name.addListenerAndInvoke((name) => {
                        input.value = name;
                    });
                    input.addEventListener("change", (e) => {
                        name.value = input.value;
                    });
                    return input;
                })(), "name");
                return formGroup.element;
            })());
            const disabled = new Observable(false);
            form.appendChild((() => {
                const btn = document.createElement("button");
                disabled.addListenerAndInvoke((d) => {
                    btn.disabled = d;
                });
                btn.type = "submit";
                btn.textContent = "Submit";
                return btn;
            })());
            form.addEventListener("submit", (
                async (event) => {
                    event.preventDefault();
                    disabled.value = true;
                    try {
                        const response = await fetch(
                            apiUrl("/api/1/progress_bars/"),
                            AuthHelper.auth({
                                method: "POST",
                                headers: {
                                    "content-type": "application/json; charset=utf-8"
                                },
                                body: JSON.stringify({
                                    name: name.value,
                                })
                            })
                        );
                        if (!response.ok) {
                            throw response;
                        }
                        const data = await response.json();
                        this.onCreated(parseProgressBar(data));
                    } finally {
                        disabled.value = false;
                    }
                }
            ));
            return form;
        })());
    }
}
