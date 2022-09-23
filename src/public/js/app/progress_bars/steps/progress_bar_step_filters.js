/**
 * the filters that can be used on progress bar steps
 * @typedef {{userSub: import("/js/app/resources/filter_text_item.js").FilterTextItem, name: import("/js/app/resources/filter_text_item.js").FilterTextItem, progressBarName: import("/js/app/resources/filter_text_item.js").FilterTextItem, createdAt: import("/js/app/resources/filter_item.js").FilterItem.<Date>}} ProgressBarStepFilters
 */


/**
 * creates a new set of user filters which has no filters except where specified
 * @param {object} kwargs the initial filters
 * @param {import("/js/app/resources/filter_text_item.js").FilterTextItem} [kwargs.userSub]
 *   the subject of the user which owns the progress bar the step belongs to
 * @param {import("/js/app/resources/filter_text_item.js").FilterTextItem} [kwargs.name]
 *   the name of the step
 * @param {import("/js/app/resources/filter_text_item.js").FilterTextItem} [kwargs.progressBarName]
 *   the name of the progress bar the step is a part of
 * @param {import("/js/app/resources/filter_item.js").FilterItem.<Date>} [kwargs.createdAt]
 *   when the step was created
 */
export function newProgressBarStepFilters({ userSub = undefined, name = undefined, progressBarName = undefined, createdAt = undefined }) {
    return {
        userSub: userSub === undefined ? null : userSub,
        name: name === undefined ? null : name,
        progressBarName: progressBarName === undefined ? null : progressBarName,
        createdAt: createdAt === undefined ? null : createdAt
    };
}

export function progressBarStepFiltersToApi(filters) {
    return {
        user_sub: filters.userSub,
        name: filters.name,
        progress_bar_name: filters.progressBarName,
        created_at: filters.createdAt === null ? null : {
            operator: filters.createdAt.operator,
            value: filters.createdAt.value.getTime() / 1000
        }
    };
}
