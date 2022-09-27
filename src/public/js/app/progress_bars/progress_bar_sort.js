/**
 * sorts by uid
 * @typedef {import("/js/app/resources/sort_item.js").SortItem.<"uid">} ProgressBarSortItemUid
 */

/**
 * sorts by name
 * @typedef {import("/js/app/resources/sort_item.js").SortItem.<"name">} ProgressBarSortItemName
 */

/**
 * sorts by when the progress bar was created
 * @typedef {import("/js/app/resources/sort_item.js").SortItem.<"created_at">} ProgressBarSortItemCreatedAt
 */

/**
 * sorts by the max number of samples colelcted for the progress bar prediction
 * @typedef {import("/js/app/resources/sort_item.js").SortItem.<"sampling_max_count">} ProgressBarSortItemSamplingMaxCount
 */

/**
 * a single sort option for progress bars
 * @typedef {ProgressBarSortItemUid | ProgressBarSortItemName | ProgressBarSortItemCreatedAt | ProgressBarSortItemSamplingMaxCount} ProgressBarSortItem
 */

/**
 * describes a way of sorting progress bars
 * @typedef {Array.<ProgressBarSortItem>} ProgressBarSort
 */

/**
 * sorts by name alphabetically from a to z
 * @type {ProgressBarSort}
 */
export const NAME_ALPHABETICAL_AZ = [{ key: "name", dir: "asc", before: null, after: null }];

/**
 * sorts by name alphabetically from z to a
 * @type {ProgressBarSort}
 */
export const NAME_ALPHABETICAL_ZA = [{ key: "name", dir: "desc", before: null, after: null }];

/**
 * sorts by when the progress bars were created from oldest to newest
 * @type {ProgressBarSort}
 */
export const OLDEST_TO_NEWEST = [{ key: "created_at", dir: "desc", before: null, after: null }];

/**
 * sorts by when the progress bars were created from newest to oldest
 * @type {ProgressBarSort}
 */
export const NEWEST_TO_OLDEST = [{ key: "created_at", dir: "asc", before: null, after: null }];

/**
 * sorts by the maximum number of samples used for prediction from lowest to highest
 * @type {ProgressBarSort}
 */
export const SAMPLING_MAX_COUNT_LOWEST_TO_HIGHEST = [
    { key: "sampling_max_count", dir: "asc", before: null, after: null },
];

/**
 * sorts by the maximum number of samples used for prediction from highest to lowest
 * @type {ProgressBarSort}
 */
export const SAMPLING_MAX_COUNT_HIGHEST_TO_LOWEST = [
    { key: "sampling_max_count", dir: "desc", before: null, after: null },
];

/**
 * the user choosable sorts
 * @type {Array.<import("/js/app/resources/sort_item.js").SortOption.<ProgressBarSort>>}
 */
export const SORT_OPTIONS = [
    { name: "Alphabetical A-Z", val: NAME_ALPHABETICAL_AZ },
    { name: "Alphabetical Z-A", val: NAME_ALPHABETICAL_ZA },
    { name: "Date Created Newest-Oldest", val: NEWEST_TO_OLDEST },
    { name: "Date Created Oldest-Newest", val: OLDEST_TO_NEWEST },
    { name: "Sampling Max Count Lowest-Highest", val: SAMPLING_MAX_COUNT_LOWEST_TO_HIGHEST },
    { name: "Sampling Max Count Highest-Lowest", val: SAMPLING_MAX_COUNT_HIGHEST_TO_LOWEST },
];
