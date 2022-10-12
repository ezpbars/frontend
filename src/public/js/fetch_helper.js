import { API_URL, WS_URL } from "/js/constants.js";

/**
 *
 * @param {string} url the relative url starting with a /
 * @returns {string} the api url
 */
export function apiUrl(url) {
    return API_URL + url;
}

/**
 *
 * @param {string} url the relative url starting with a /
 * @returns {string} the websocket url
 */
export function wsUrl(url) {
    if (WS_URL === "") {
        return (window.location.protocol === "https:" ? "wss://" : "ws://") + window.location.host + url;
    }
    return WS_URL + url;
}
