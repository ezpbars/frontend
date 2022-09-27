/**
 * sorts by uid
 * @typedef {import("/js/app/resources/sort_item.js").SortItem.<"uid">} ProgressBarTraceSortItemUid
 */

/**
 * sorts by progress bar name
 * @typedef {import("/js/app/resources/sort_item.js").SortItem.<"progress_bar_name">} ProgressBarTraceSortItemProgressBarName
 */

/**
 * sorts by when the trace was created
 * @typedef {import("/js/app/resources/sort_item.js").SortItem.<"created_at">} ProgressBarTraceSortItemCreatedAt
 */

/**
 * a single sort option for progress bar traces
 * @typedef {ProgressBarTraceSortItemUid | ProgressBarTraceSortItemProgressBarName | ProgressBarTraceSortItemCreatedAt} ProgressBarTraceSortItem
 */

/**
 * describes a way of sorting progress bar traces
 * @typedef {Array.<ProgressBarTraceSortItem>} ProgressBarTraceSort
 */

/**
 * sorts by when the trace was created from newest to oldest
 * @type {ProgressBarTraceSort}
 */
export const NEWEST_TO_OLDEST = [{ key: "created_at", dir: "desc", before: null, after: null }];

/**
 * sorts by when the trace was created from oldest to newest
 * @type {ProgressBarTraceSort}
 */
export const OLDEST_TO_NEWEST = [{ key: "created_at", dir: "asc", before: null, after: null }];

/**
 * sorts first by progress bar name a to z, then by when the trace was created from newest to oldest
 * @type {ProgressBarTraceSort}
 */
export const PBAR_NAME_ALPHABETICAL_AZ = [
    { key: "progress_bar_name", dir: "asc", before: null, after: null },
    { key: "created_at", dir: "desc", before: null, after: null },
];

/**
 * sorts first by progress bar name z to a, then by when the trace was created from newest to oldest
 * @type {ProgressBarTraceSort}
 */
export const PBAR_NAME_ALPHABETICAL_ZA = [
    { key: "progress_bar_name", dir: "desc", before: null, after: null },
    { key: "created_at", dir: "desc", before: null, after: null },
];

export const SORT_OPTIONS = [
    { name: "Date Created Newest-Oldest", val: NEWEST_TO_OLDEST },
    { name: "Date Created Oldest-Newest", val: OLDEST_TO_NEWEST },
    { name: "Progress Bar Name A-Z", val: PBAR_NAME_ALPHABETICAL_AZ },
    { name: "Progress Bar Name Z-A", val: PBAR_NAME_ALPHABETICAL_ZA },
];
