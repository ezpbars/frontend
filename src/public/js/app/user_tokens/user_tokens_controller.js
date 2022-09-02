import { PageableItems } from "/js/app/resources/pageable_items.js";
import { CreateUserTokensFormController } from "/js/app/user_tokens/create_user_tokens_form_controller.js";
import { UserTokenReader } from "/js/app/user_tokens/user_token_reader.js";
import { UserTokenView } from "/js/app/user_tokens/user_token_view.js";
import { simpleArrayListener } from "/js/lib/replica_listener.js";

/**
 * loads and renders the logged in users user tokens, allowing them to create
 * new ones or update and delete existing ones
 */
export class UserTokensController {
    constructor() {
        /**
         * the element this view is attached to
         * @type {Element}
         * @readonly
         */
        this.element = document.createElement("div");
        /**
         * the object responsible for fetching user tokens from the api
         * @type {UserTokenReader}
         * @readonly
         */
        this.reader = new UserTokenReader();
        /**
         * the view for the items
         * @type {PageableItems.<UserTokenView>}
         * @readonly
         */
        this.itemsView = new PageableItems({ onMore: this.reader.loadNext.bind(this.reader) });
        this.reader.items.addArrayListenerAndInvoke(simpleArrayListener({
            insert: (index, userToken) => {
                const replica = userToken.createReplica();
                this.itemsView.items.items.splice(index, 0, new UserTokenView(replica, this.onDelete.bind(this, replica)));
            },
            remove: (index) => {
                this.itemsView.items.items.splice(index, 1)[0].userToken.detach();
            }
        }));
        this.reader.hasNextPage.addListenerAndInvoke((hasNext) => {
            this.itemsView.hasMore.value = hasNext;
        });
        /**
         * the form to create new items
         * @type {CreateUserTokensFormController}
         * @readonly
         */
        this.createUserTokensForm = new CreateUserTokensFormController((userToken) => {
            this.reader.items.push(userToken);
        });
        this.render();
    }
    /**
     * called after a user token was deleted
     * @param {import("/js/app/user_tokens/user_token.js").UserToken} userToken the user token which was deleted
     * @private
     */
    onDelete(userToken) {
        const index = this.reader.items.get().findIndex((ut) => userToken.get("uid") === ut.get("uid"));
        if (index !== -1) {
            this.reader.items.splice(index, 1);
        }
    }
    /**
     * Adds the appropriate contents to the element for this view. Should
     * only be called once.
     * @private
     */
    render() {
        this.element.appendChild(this.itemsView.element);
        this.element.appendChild(this.createUserTokensForm.element);
    }
}
