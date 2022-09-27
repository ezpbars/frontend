/**
 * manages the access and retrieval of amazon cognito tokens
 */
export class AuthHelper {
    /**
     * stores the given tokens in local storage
     * @param {!string} id id token; contains claims about our identity
     * @param {?string} access access token; contains scopes
     * @param {?string} refresh refresh token; allows retrieving new id and access tokens
     */
    static store(id, access, refresh) {
        const data = { id, access, refresh };
        localStorage.setItem("auth", JSON.stringify(data));
    }

    /**
     * clears stored tokens if there are any
     */
    static clear() {
        localStorage.removeItem("auth");
    }

    /**
     * retrieves the stored tokens
     * @returns {?{id:!string,access:?string,refresh:?string}}
     */
    static retrieve() {
        const serd = localStorage.getItem("auth");
        if (serd === null) {
            return null;
        }
        return JSON.parse(serd);
    }
    /**
     * adds the appropriate authorization headers to the given fetch arguments
     *
     * example:
     * ```
     * const response = await fetch(
     *     "/api/1/user/me",
     *     AuthHelper.auth()
     * );
     * ```
     * @param {*} fetchArgs the arguments to fetch
     * @returns {*} the new fetch arguments
     */
    static auth(fetchArgs) {
        const tokens = AuthHelper.retrieve();
        if (tokens === null) {
            return fetchArgs;
        }
        const result = Object.assign({}, fetchArgs);
        result.credentials = "omit";
        if (fetchArgs.headers !== null) {
            result.headers = new Headers(result.headers);
        } else {
            result.headers = new Headers();
        }
        result.headers.set("authorization", `bearer ${tokens.id}`);
        return result;
    }
    /**
     *
     * @returns {boolean} true if logged in, false if not
     */
    static isLoggedIn() {
        return AuthHelper.retrieve() !== null;
    }
}
