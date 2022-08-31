import { implementReplicaListener, ListenerOf, ReplicaListener } from "/js/lib/replica_listener.js";
/**
 * a user token acts as a shared secret for server to server authentication
 * @typedef {ReplicaListener & ListenerOf.<string, "uid"> & ListenerOf.<?string, "token"> & ListenerOf.<string, "name"> & ListenerOf.<Date, "createdAt"> & ListenerOf.<?Date, "expiresAt">} UserToken 
 */

/**
 * parses a user token from the api
 * @param {object} kwargs the user token from the api
 * @param {string} kwargs.uid the universal identifier for the token
 * @param {?string} kwargs.token the shared secret if known
 * @param {string} kwargs.name the human-readable name for the token
 * @param {number} kwargs.created_at when the token was created in seconds since the unix epoch
 * @param {?number} kwargs.expires_at when the token expires, if applicable, in seconds since the unix epoch
 * @returns {UserToken} the parsed user token
 */
export function parseUserToken({ uid, token = undefined, name, created_at, expires_at = undefined }) {
    return implementReplicaListener(
        { key: "uid", val: uid },
        { key: "token", val: (token === undefined ? null : token) },
        { key: "name", val: name },
        { key: "createdAt", val: new Date(created_at * 1000) },
        { key: "expiresAt", val: (expires_at === undefined || expires_at === null) ? null : new Date(expires_at * 1000) }
    );
}
