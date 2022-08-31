import { Collapse } from "/js/app/resources/collapse.js";
import { ResourceSection } from "/js/app/resources/resource_section.js";
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
         * the function to call after the user deleted the token
         * @type {function() : any}
         */
        this.onDelete = onDelete;
        this.render();
    }
    /**
     * Adds the appropriate contents to the element for this view. Should
     * only be called once.
     * @private
     */
    render() {
        this.element.classList.add("user-tokens-user-token-view");
        this.element.appendChild((() => {
            /** @type {ReplicaListener & ListenerOf.<string, "token">} */
            const data = this.userToken;
            return (new ResourceSection(data, "token", { formatter: (token) => token })).element;
        })());
        this.element.appendChild((new ResourceSection(this.userToken, "name", {})).element);
        this.element.appendChild((() => {
            /** @type {ReplicaListener & ListenerOf.<Date, "createdAt">} */
            const data = this.userToken;
            return (new ResourceSection(data, "createdAt", { formatter: (createdAt) => createdAt.toLocaleString() })).element;
        })());
        this.element.appendChild((() => {
            /** @type {ReplicaListener & ListenerOf.<Date, "expiresAt">} */
            const data = this.userToken;
            return (new ResourceSection(data, "expiresAt",
                {
                    formatter: (expiresAt) => {
                        if (expiresAt !== null) {
                            return expiresAt.toLocaleString();
                        }
                        return "Never Expires";
                    }
                })).element;
        })());
    }
}
