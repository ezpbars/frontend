/**
 * sorts by uid
 * @typedef {import("/js/app/resources/sort_item.js").SortItem.<"uid">} UserUsageSortItemUid
 */

/**
 * sorts by when the billing period started
 * @typedef {import("/js/app/resources/sort_item.js").SortItem.<"period_started_at">} UserUsageSortItemPeriodStartedAt
 */

/**
 * sorts by the number of traces used
 * @typedef {import("/js/app/resources/sort_item.js").SortItem.<"traces">} UserUsageSortItemTraces
 */

/**
 * sorts by the total cost the user was charged
 * @typedef {import("/js/app/resources/sort_item.js").SortItem.<"cost">} UserUsageSortItemCost
 */

/**
 * a single sort option for user usages
 * @typedef {UserUsageSortItemUid | UserUsageSortItemPeriodStartedAt | UserUsageSortItemTraces | UserUsageSortItemCost} UserUsageSortItem
 */

/**
 * describes a way of sorting user usages
 * @typedef {Array.<UserUsageSortItem>} UserUsageSort
 */

/**
 * sorts by period started at from the most to least recent
 * @type {UserUsageSort}
 */
export const PERIOD_STARTED_AT_MOST_TO_LEAST_RECENT = [
    { key: "period_started_at", dir: "desc", before: null, after: null },
];

/**
 * sorts by period started at from the least to most recent
 * @type {UserUsageSort}
 */
export const PERIOD_STARTED_AT_LEAST_TO_MOST_RECENT = [
    { key: "period_started_at", dir: "asc", before: null, after: null },
];

/**
 * sorts by the number of traces used from most to least
 * @type {UserUsageSort}
 */
export const TRACES_MOST_TO_LEAST = [{ key: "traces", dir: "desc", before: null, after: null }];

/**
 * sorts by the number of traces used from least to most
 * @type {UserUsageSort}
 */
export const TRACES_LEAST_TO_MOST = [{ key: "traces", dir: "asc", before: null, after: null }];

/**
 * sorts by the cost from high to low
 * @type {UserUsageSort}
 */
export const COST_HIGH_TO_LOW = [{ key: "cost", dir: "desc", before: null, after: null }];

/**
 * sorts by the cost from low to high
 * @type {UserUsageSort}
 */
export const COST_LOW_TO_HIGH = [{ key: "cost", dir: "asc", before: null, after: null }];

/**
 * the user choosable sorts
 * @type {Array.<import("/js/app/resources/sort_item.js").SortOption.<UserUsageSort>>}
 */
export const SORT_OPTIONS = [
    { name: "Period Started At Most-Least Recent", val: PERIOD_STARTED_AT_MOST_TO_LEAST_RECENT },
    { name: "Period Started At Least-Most Recent", val: PERIOD_STARTED_AT_LEAST_TO_MOST_RECENT },
    { name: "Traces Most-Least", val: TRACES_MOST_TO_LEAST },
    { name: "Traces Least-Most", val: TRACES_LEAST_TO_MOST },
    { name: "Cost High-Low", val: COST_HIGH_TO_LOW },
    { name: "Cost Low-High", val: COST_LOW_TO_HIGH },
];
