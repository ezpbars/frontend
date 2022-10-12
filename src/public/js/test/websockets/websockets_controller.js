import { FormGroup } from "/js/app/resources/form_group.js";
import { wsUrl } from "/js/fetch_helper.js";
import { Observable } from "/js/lib/observable.js";
import { ArrayListenerOf, newArrayListenerOf, simpleArrayListener } from "/js/lib/replica_listener.js";

export class WebSocketController {
    constructor() {
        /**
         * the element this view is attached to
         * @type {Element}
         * @readonly
         */
        this.element = document.createElement("div");
        /**
         * the list of messages
         * @type {ArrayListenerOf.<string>}
         * @readonly
         */
        this.messages = newArrayListenerOf([]);
        /**
         * the websocket connection
         * @type {WebSocket}
         * @readonly
         */
        this.websocket = new WebSocket(wsUrl("/api/2/test/ws"));
        this.websocket.addEventListener("message", (event) => {
            this.messages.push(event.data);
        });
        this.render();
    }

    render() {
        this.element.classList.add("ws");
        this.messages.addArrayListenerAndInvoke(
            simpleArrayListener(
                {
                    insert: (idx, val) => {
                        const element = document.createElement("div");
                        element.textContent = val;
                        this.element.classList.add("ws-message");
                        if (idx === 0) {
                            this.element.insertAdjacentElement("afterbegin", element);
                        } else {
                            this.element.children[idx - 1].insertAdjacentElement("afterend", element);
                        }
                    },
                    remove: (idx) => {
                        this.element.children[idx].remove();
                    },
                },
                { thisArg: this }
            )
        );
        this.element.appendChild(
            (() => {
                const form = document.createElement("form");
                form.classList.add("send-message-form");
                const message = new Observable("");
                form.appendChild(
                    (() => {
                        const formGroup = new FormGroup(
                            (() => {
                                const input = document.createElement("input");
                                input.type = "text";
                                input.id = "message";
                                message.addListenerAndInvoke((message) => {
                                    input.value = message;
                                });
                                input.addEventListener("change", (e) => {
                                    message.value = input.value;
                                });
                                return input;
                            })(),
                            "message"
                        );
                        return formGroup.element;
                    })()
                );
                form.appendChild(
                    (() => {
                        const button = document.createElement("button");
                        button.type = "submit";
                        button.textContent = "Send";
                        return button;
                    })()
                );
                form.addEventListener("submit", (e) => {
                    e.preventDefault();
                    this.websocket.send(message.value);
                    message.value = "";
                });
                return form;
            })()
        );
    }
}
