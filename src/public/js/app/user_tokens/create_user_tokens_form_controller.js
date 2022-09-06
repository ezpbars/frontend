import { FormGroup } from "/js/app/resources/form_group.js";
import { parseUserToken } from "/js/app/user_tokens/user_token.js";
import { AuthHelper } from "/js/auth_helper.js";
import { apiUrl } from "/js/fetch_helper.js";
import { Observable } from "/js/lib/observable.js";

export class CreateUserTokensFormController {
    /**
     * 
     * @param {function(import("/js/app/user_tokens/user_token.js").UserToken) : any} onCreated the function to call when the form is submitted
     */
    constructor(onCreated) {
        /**
         * the element this view is attached to
         * @type {Element}
         * @readonly
         */
        this.element = document.createElement("div");
        /**
         * the function to call after the form is submitted
         * @type {function(import("/js/app/user_tokens/user_token.js").UserToken) : any}
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
            form.classList.add("user-tokens-create-form");
            const name = new Observable("");
            const duration = new Observable("31536000");
            form.appendChild((() => {
                const formGroup = new FormGroup((() => {
                    const input = document.createElement("input");
                    input.type = "text";
                    input.name = "name";
                    input.id = "user-tokens-create-form-name";
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
            form.appendChild((() => {
                const formGroup = new FormGroup((() => {
                    const select = document.createElement("select");
                    select.name = "duration";
                    select.id = "user-tokens-create-form-duration";
                    select.appendChild((() => {
                        const option = document.createElement("option");
                        option.value = "forever";
                        option.textContent = "Forever";
                        return option;
                    })());
                    select.appendChild((() => {
                        const option = document.createElement("option");
                        option.value = "31536000";
                        option.textContent = "1 year";
                        option.selected = true;
                        return option;
                    })());
                    select.appendChild((() => {
                        const option = document.createElement("option");
                        option.value = "2678400";
                        option.textContent = "31 days";
                        return option;
                    })());
                    select.appendChild((() => {
                        const option = document.createElement("option");
                        option.value = "86400";
                        option.textContent = "1 day";
                        return option;
                    })());
                    select.appendChild((() => {
                        const option = document.createElement("option");
                        option.value = "3600";
                        option.textContent = "1 hour";
                        return option;
                    })());
                    duration.addListenerAndInvoke((duration) => {
                        select.value = duration;
                    });
                    select.addEventListener("change", (e) => {
                        duration.value = select.value;
                    });
                    return select;
                })(), "time until expiration");
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
                        let expiresAt = null;
                        if (duration.value !== "forever") {
                            expiresAt = (Date.now() / 1000) + parseInt(duration.value);
                        }
                        const response = await fetch(
                            apiUrl("/api/1/users/tokens/"),
                            AuthHelper.auth({
                                method: "POST",
                                headers: {
                                    "content-type": "application/json; charset=utf-8"
                                },
                                body: JSON.stringify({
                                    name: name.value,
                                    expires_at: expiresAt,
                                })
                            })
                        );
                        if (!response.ok) {
                            throw response;
                        }
                        const data = await response.json();
                        this.onCreated(parseUserToken(data));
                    } finally {
                        disabled.value = false;
                    }
                }
            ));
            return form;
        })());
    }
}
