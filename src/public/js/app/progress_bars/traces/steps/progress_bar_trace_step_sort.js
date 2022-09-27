/**
 * sorts by uid
 * @typedef {import("/js/app/resources/sort_item.js").SortItem.<"uid">} ProgressBarTraceStepSortItemUid
 */

/**
 * sorts by progress bar name
 * @typedef {import("/js/app/resources/sort_item.js").SortItem.<"progress_bar_name">} ProgressBarTraceStepSortItemProgressBarName
 */

/**
 * sorts by progress bar step name
 * @typedef {import("/js/app/resources/sort_item.js").SortItem.<"progress_bar_step_name">} ProgressBarTraceStepSortItemProgressBarStepName
 */

/**
 * sorts by progress bar step position
 * @typedef {import("/js/app/resources/sort_item.js").SortItem.<"progress_bar_step_position">} ProgressBarTraceStepSortItemProgressBarStepPosition
 */

/**
 * sorts by when the progress bar trace step was started
 * @typedef {import("/js/app/resources/sort_item.js").SortItem.<"started_at">} ProgressBarTraceStepSortItemStartedAt
 */

/**
 * sorts by when the progress bar trace step was finished
 * @typedef {import("/js/app/resources/sort_item.js").SortItem.<"finished_at">} ProgressBarTraceStepSortItemFinishedAt
 */

/**
 * sorts by the duration of the progress bar trace step
 * @typedef {import("/js/app/resources/sort_item.js").SortItem.<"duration">} ProgressBarTraceStepSortItemDuration
 */

/**
 * sorts by the normalized duration (duration / iterations) of the progress bar trace step
 * @typedef {import("/js/app/resources/sort_item.js").SortItem.<"normalized_duration">} ProgressBarTraceStepSortItemNormalizedDuration
 */

/**
 * a single sort option for progress bar trace steps
 * @typedef {ProgressBarTraceStepSortItemUid | ProgressBarTraceStepSortItemProgressBarName | ProgressBarTraceStepSortItemProgressBarStepName | ProgressBarTraceStepSortItemProgressBarStepPosition | ProgressBarTraceStepSortItemStartedAt | ProgressBarTraceStepSortItemFinishedAt | ProgressBarTraceStepSortItemDuration | ProgressBarTraceStepSortItemNormalizedDuration} ProgressBarTraceStepSortItem
 */

/**
 * describes a way of sorting progress bar trace steps
 * @typedef {Array.<ProgressBarTraceStepSortItem>} ProgressBarTraceStepSort
 */

/**
 * sorts by finished at from newest to oldest
 * @type {ProgressBarTraceStepSort}
 */
export const FINISHED_AT_NEWEST_TO_OLDEST = [{ key: "finished_at", dir: "desc", before: null, after: null }];

/**
 * sorts by finished at from oldest to newest
 * @type {ProgressBarTraceStepSort}
 */
export const FINISHED_AT_OLDEST_TO_NEWEST = [{ key: "finished_at", dir: "asc", before: null, after: null }];

/**
 * sorts by normalized duration from longest to shortest
 * @type {ProgressBarTraceStepSort}
 */
export const NORMALIZED_DURATION_LONGEST_TO_SHORTEST = [
    { key: "normalized_duration", dir: "desc", before: null, after: null },
    ...FINISHED_AT_NEWEST_TO_OLDEST,
];

/**
 * sorts by normalized duration from shortest to longest
 * @type {ProgressBarTraceStepSort}
 */
export const NORMALIZED_DURATION_SHORTEST_TO_LONGEST = [
    { key: "normalized_duration", dir: "asc", before: null, after: null },
    ...FINISHED_AT_NEWEST_TO_OLDEST,
];

/**
 * sorts by raw duration from longest to shortest
 * @type {ProgressBarTraceStepSort}
 */
export const RAW_DURATION_LONGEST_TO_SHORTEST = [
    { key: "duration", dir: "desc", before: null, after: null },
    ...FINISHED_AT_NEWEST_TO_OLDEST,
];

/**
 * sorts by raw duration from shortest to longest
 * @type {ProgressBarTraceStepSort}
 */
export const RAW_DURATION_SHORTEST_TO_LONGEST = [
    { key: "duration", dir: "asc", before: null, after: null },
    ...FINISHED_AT_NEWEST_TO_OLDEST,
];

/**
 * sorts by position from smallest to largest
 * @type {ProgressBarTraceStepSort}
 */
export const POSITION_FIRST_TO_LAST = [
    { key: "progress_bar_step_position", dir: "asc", before: null, after: null },
    ...FINISHED_AT_NEWEST_TO_OLDEST,
];

/**
 * sorts by position from largest to smallest
 * @type {ProgressBarTraceStepSort}
 */
export const POSITION_LAST_TO_FIRST = [
    { key: "progress_bar_step_position", dir: "desc", before: null, after: null },
    ...FINISHED_AT_NEWEST_TO_OLDEST,
];

/**
 * the user choosable sorts
 * @type {Array.<import("/js/app/resources/sort_item.js").SortOption.<ProgressBarTraceStepSort>>}
 */
export const SORT_OPTIONS = [
    {
        name: "Normalized Duration (Longest to Shortest)",
        val: NORMALIZED_DURATION_LONGEST_TO_SHORTEST,
    },
    {
        name: "Normalized Duration (Shortest to Longest)",
        val: NORMALIZED_DURATION_SHORTEST_TO_LONGEST,
    },
    {
        name: "Duration (Longest to Shortest)",
        val: RAW_DURATION_LONGEST_TO_SHORTEST,
    },
    {
        name: "Duration (Shortest to Longest)",
        val: RAW_DURATION_SHORTEST_TO_LONGEST,
    },
    { name: "Finished At (Newest to Oldest)", val: FINISHED_AT_NEWEST_TO_OLDEST },
    { name: "Finished At (Oldest to Newest)", val: FINISHED_AT_OLDEST_TO_NEWEST },
];
