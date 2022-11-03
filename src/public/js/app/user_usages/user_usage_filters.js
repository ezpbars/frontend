/**
 * the filters that can be used on user usages
 * @typedef {{userSub: ?import("/js/app/resources/filter_text_item.js").FilterTextItem, periodStartedAt: ?import("/js/app/resources/filter_item.js").FilterItem.<Date>}} UserUsageFilters
 */

/**
 * creates a new set of user filters which has no filters except where specified
 * @param {object} kwargs the initial filters
 * @param {import("/js/app/resources/filter_text_item.js").FilterTextItem} [kwargs.userSub]
 *   the subject of the user the usages belong to
 * @param {import("/js/app/resources/filter_item.js").FilterItem.<Date>} [kwargs.periodStartedAt]
 *  the date the billing period started
 */
export function newUserUsageFilters({ userSub = undefined, periodStartedAt = undefined }) {
    return {
        userSub: userSub === undefined ? null : userSub,
        periodStartedAt: periodStartedAt === undefined ? null : periodStartedAt,
    };
}

export function userUsageFiltersToApi(filters) {
    return {
        user_sub: filters.userSub,
        period_started_at:
            filters.periodStartedAt === null
                ? null
                : {
                      operator: filters.periodStartedAt.operator,
                      value: filters.periodStartedAt.value.getTime() / 1000,
                  },
    };
}
