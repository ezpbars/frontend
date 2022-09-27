import { API_URL } from "/js/constants.js";

/**
 *
 * @param {string} url the relative url starting with a /
 * @returns {string} the api url
 */
export function apiUrl(url) {
    return API_URL + url;
}
