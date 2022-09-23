/**
 * sorts by uid
 * @typedef {import("/js/app/resources/sort_item.js").SortItem.<"uid">} ProgressBarStepSortItemUid
 */

/**
 * sorts by name
 * @typedef {import("/js/app/resources/sort_item.js").SortItem.<"name">} ProgressBarStepSortItemName
 */

/**
 * sorts by the progress bar name
 * @typedef {import("/js/app/resources/sort_item.js").SortItem.<"progress_bar_name">} ProgressBarStepSortItemProgressBarName
 */

/**
 * sorts by when the step was created
 * @typedef {import("/js/app/resources/sort_item.js").SortItem.<"created_at">} ProgressbarStepSortItemCreatedAt
 */

/**
 * sorts by the position
 * @typedef {import("/js/app/resources/sort_item.js").SortItem.<"position">} ProgressBarStepSortItemPosition
 */

/**
 * a single sort option for progress bar steps
 * @typedef {ProgressBarStepSortItemUid | ProgressBarStepSortItemName | ProgressBarStepSortItemProgressBarName | ProgressbarStepSortItemCreatedAt | ProgressBarStepSortItemPosition} ProgressBarStepSortItem
 */

/**
 * describes a way of sorting progress bar steps
 * @typedef {Array.<ProgressBarStepSortItem>} ProgressBarStepSort
 */

/**
 * sorts by step name a to z
 * @type {ProgressBarStepSort}
 */
export const NAME_ALPHABETICAL_AZ = [
    { key: "name", dir: "asc", before: null, after: null }
];

/**
 * sorts by step name z to a
 * @type {ProgressBarStepSort}
 */
export const NAME_ALPHABETICAL_ZA = [
    { key: "name", dir: "desc", before: null, after: null }
];

/**
 * sorts first by progress bar name a to z, then by ascending step position
 * @type {ProgressBarStepSort}
 */
export const PBAR_NAME_ALPHABETICAL_AZ = [
    { key: "progress_bar_name", dir: "asc", before: null, after: null },
    { key: "position", dir: "asc", before: null, after: null }
];

/**
 * sorts first by progress bar name z to a, then by ascending step position
 * @type {ProgressBarStepSort}
 */
export const PBAR_NAME_ALPHABETICAL_ZA = [
    { key: "progress_bar_name", dir: "desc", before: null, after: null },
    { key: "position", dir: "asc", before: null, after: null }
];

/**
 * sorts by when the progress bar steps were created from oldest to newest
 * @type {ProgressBarStepSort}
 */
export const OLDEST_TO_NEWEST = [
    { key: "created_at", dir: "desc", before: null, after: null }
];

/**
 * sorts by when the progress bar steps were created from newest to oldest
 * @type {ProgressBarStepSort}
 */
export const NEWEST_TO_OLDEST = [
    { key: "created_at", dir: "asc", before: null, after: null }
];

/**
 * sorts by the step position from first to be done to last
 * @type {ProgressBarStepSort}
 */
export const POSITION_FIRST_TO_LAST = [
    { key: "position", dir: "asc", before: null, after: null }
];

/**
 * sorts by the step position from last to be done to first
 * @type {ProgressBarStepSort}
 */
export const POSITION_LAST_TO_FIRST = [
    { key: "position", dir: "desc", before: null, after: null }
];

/**
 * the user choosable sorts
 * @type {Array.<import("/js/app/resources/sort_item.js").SortOption.<ProgressBarStepSort>>}
 * 
 */
export const SORT_OPTIONS = [
    { name: "Alphabetical A-Z", val: NAME_ALPHABETICAL_AZ },
    { name: "Alphabetical Z-A", val: NAME_ALPHABETICAL_ZA },
    { name: "Date Created Newest-Oldest", val: NEWEST_TO_OLDEST },
    { name: "Date Created Oldest-Newest", val: OLDEST_TO_NEWEST },
    { name: "Progress Bar Name A-Z", val: PBAR_NAME_ALPHABETICAL_AZ },
    { name: "Progress Bar Name Z-A", val: PBAR_NAME_ALPHABETICAL_ZA },
    { name: "Position First to Last", val: POSITION_FIRST_TO_LAST },
    { name: "Position LAst to First", val: POSITION_LAST_TO_FIRST }
];
