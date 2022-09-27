import { Controls } from "/js/app/resources/controls.js";
import { ResourceSection } from "/js/app/resources/resource_section.js";
import { AuthHelper } from "/js/auth_helper.js";
import { apiUrl } from "/js/fetch_helper.js";
import { Observable } from "/js/lib/observable.js";
import { ListenerOf, ReplicaListener } from "/js/lib/replica_listener.js";

/**
 * shows a user token and controls
 */
export class UserTokenView {
    /**
     *
     * @param {import("/js/app/user_tokens/user_token.js").UserToken} userToken the user token to show
     * @param {function() : any} onDelete function to call after the user deleted this user token
     */
    constructor(userToken, onDelete) {
        /**
         * the element this view is attached to
         * @type {Element}
         * @readonly
         */
        this.element = document.createElement("div");
        /**
         * the user token to show
         * @type {import("/js/app/user_tokens/user_token.js").UserToken}
         * @readonly
         */
        this.userToken = userToken;
        /**
         * if we are in editing mode
         * @type {Observable.<boolean>}
         * @readonly
         */
        this.editing = new Observable(false);
        /**
         * the function to call after the user deleted the token
         * @type {function() : any}
         * @readonly
         */
        this.onDelete = onDelete;
        this.render();
    }
    /**
     * handles deleting the token and then calling the callback
     * @private
     */
    async _onDelete() {
        const response = await fetch(
            apiUrl(`/api/1/users/tokens/${this.userToken.get("uid")}`),
            AuthHelper.auth({ method: "DELETE" })
        );
        if (!response.ok) {
            throw response;
        }
        if (this.onDelete !== null) {
            this.onDelete();
        }
    }
    /**
     * handles switching to/from editing mode
     * @private
     */
    async _onEdit() {
        if (!this.editing.value) {
            this.editing.value = true;
            return;
        }
        const name = this.userToken.get("name");
        const response = await fetch(
            apiUrl(`/api/1/users/tokens/${this.userToken.get("uid")}`),
            AuthHelper.auth({
                method: "PUT",
                headers: { "content-type": "application/json; charset=UTF-8" },
                body: JSON.stringify({
                    name,
                }),
            })
        );
        if (!response.ok) {
            throw response;
        }
        this.editing.value = false;
    }
    /**
     * Adds the appropriate contents to the element for this view. Should
     * only be called once.
     * @private
     */
    render() {
        this.element.classList.add("user-tokens-user-token-view", "elevation-medium");
        this.element.appendChild(
            new Controls({
                onDelete: this._onDelete.bind(this),
                onEdit: this._onEdit.bind(this),
                editing: this.editing,
            }).element
        );
        this.element.appendChild(
            (() => {
                /** @type {ReplicaListener & ListenerOf.<string, "token">} */
                const data = this.userToken;
                return new ResourceSection(data, "token", { formatter: (token) => token }).element;
            })()
        );
        this.element.appendChild(
            (() => {
                /** @type {ReplicaListener & ListenerOf.<string, "name">} */
                const data = this.userToken;
                return new ResourceSection(data, "name", { edit: { fromString: (s) => s, editing: this.editing } })
                    .element;
            })()
        );
        this.element.appendChild(
            (() => {
                /** @type {ReplicaListener & ListenerOf.<Date, "createdAt">} */
                const data = this.userToken;
                return new ResourceSection(data, "createdAt", { formatter: (createdAt) => createdAt.toLocaleString() })
                    .element;
            })()
        );
        this.element.appendChild(
            (() => {
                /** @type {ReplicaListener & ListenerOf.<Date, "expiresAt">} */
                const data = this.userToken;
                return new ResourceSection(data, "expiresAt", {
                    formatter: (expiresAt) => {
                        if (expiresAt !== null) {
                            return expiresAt.toLocaleString();
                        }
                        return "Never Expires";
                    },
                }).element;
            })()
        );
    }
}
