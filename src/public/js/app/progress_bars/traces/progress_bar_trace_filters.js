/**
 * the filters that can be used on progress bar traces
 * @typedef {{userSub: ?import("/js/app/resources/filter_text_item.js").FilterTextItem, progressBarName: ?import("/js/app/resources/filter_text_item.js").FilterTextItem, createdAt: import("/js/app/resources/filter_item.js").FilterItem.<Date>}} ProgressBarTraceFilters
 */

/**
 * creates a new set of user filters which has no filters except where specified
 * @param {object} kwargs the initial filters
 * @param {import("/js/app/resources/filter_text_item.js").FilterTextItem} [kwargs.userSub] 
 *   the subject of the user which the progress bar trace belongs to
 * @param {import("/js/app/resources/filter_text_item.js").FilterTextItem} [kwargs.progressBarName]
 *   the name of the progress bar the trace belongs to
 * @param {import("/js/app/resources/filter_item.js").FilterItem.<Date>} [kwargs.createdAt]
 *   when the trace was created
 * @returns {ProgressBarTraceFilters}
 */
export function newProgressBarTraceFilters({ userSub = undefined, progressBarName = undefined, createdAt = undefined }) {
    return {
        userSub: userSub === undefined ? null : userSub,
        progressBarName: progressBarName === undefined ? null : progressBarName,
        createdAt: createdAt === undefined ? null : createdAt
    };
}

export function progressBarTraceFiltersToApi(filters) {
    return {
        user_sub: filters.userSub,
        progress_bar_name: filters.progressBarName,
        created_at: filters.createdAt === null ? null : {
            operator: filters.createdAt.operator,
            value: filters.createdAt.value.getTime() / 1000
        }
    };
}
