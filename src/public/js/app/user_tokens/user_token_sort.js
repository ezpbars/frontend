/**
 * sorts by uid
 * @typedef {import("/js/app/resources/sort_item.js").SortItem.<"uid">} UserTokenSortItemUid
 */

/**
 * sorts by name
 * @typedef {import("/js/app/resources/sort_item.js").SortItem.<"name">} UserTokenSortItemName
 */

/**
 * sorts by when the token was created
 * @typedef {import("/js/app/resources/sort_item.js").SortItem.<"created_at">} UserTokenSortItemCreatedAt
 */

/**
 * sorts by when the token expires
 * @typedef {import("/js/app/resources/sort_item.js").SortItem.<"expires_at">} UserTokenSortItemExpiresAt
 */

/**
 * a single sort option for user tokens
 * @typedef {UserTokenSortItemUid | UserTokenSortItemName | UserTokenSortItemCreatedAt | UserTokenSortItemExpiresAt} UserTokenSortItem
 */

/**
 * describes a way of sorting user tokens
 * @typedef {Array.<UserTokenSortItem>} UserTokenSort
 */

/**
 * sorts by name alphabetically from a to z
 * @type {UserTokenSort}
 */
export const NAME_ALPHABETICAL_AZ = [{ key: "name", dir: "asc", before: null, after: null }];

/**
 * sorts by name alphabetically from z to a
 * @type {UserTokenSort}
 */
export const NAME_ALPHABETICAL_ZA = [{ key: "name", dir: "desc", before: null, after: null }];

/**
 * sorts by when the tokens were created from oldest to newest
 * @type {UserTokenSort}
 */
export const OLDEST_TO_NEWEST = [{ key: "created_at", dir: "desc", before: null, after: null }];

/**
 * sorts by when the tokens were created from newest to oldest
 * @type {UserTokenSort}
 */
export const NEWEST_TO_OLDEST = [{ key: "created_at", dir: "asc", before: null, after: null }];

/**
 * sorts by when the tokens expire from soonest to latest
 * @type {UserTokenSort}
 */
export const EXPIRES_SOONEST_TO_LATEST = [
    { key: "expires_at", dir: "asc", before: null, after: null },
    ...NAME_ALPHABETICAL_AZ,
];

/**
 * sorts by when the tokens expire from latest to soonest
 * @type {UserTokenSort}
 */
export const EXPIRES_LATEST_TO_SOONEST = [
    { key: "expires_at", dir: "desc", before: null, after: null },
    ...NAME_ALPHABETICAL_AZ,
];

/**
 * the user choosable sorts
 * @type {Array.<import("/js/app/resources/sort_item.js").SortOption.<UserTokenSort>>}
 */
export const SORT_OPTIONS = [
    { name: "Alphabetical A-Z", val: NAME_ALPHABETICAL_AZ },
    { name: "Alphabetical Z-A", val: NAME_ALPHABETICAL_ZA },
    { name: "Date Created Newest-Oldest", val: NEWEST_TO_OLDEST },
    { name: "Date Created Oldest-Newest", val: OLDEST_TO_NEWEST },
    { name: "Expiry Date Soonest-Latest", val: EXPIRES_SOONEST_TO_LATEST },
    { name: "Expiry Date Latest-Soonest", val: EXPIRES_LATEST_TO_SOONEST },
];
