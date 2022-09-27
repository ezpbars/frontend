/**
 * the filters that can be used on progress bars
 * @typedef {{userSub: ?import("/js/app/resources/filter_text_item.js").FilterTextItem, name: ?import("/js/app/resources/filter_text_item.js").FilterTextItem, createdAt: ?import("/js/app/resources/filter_item.js").FilterItem.<Date>, samplingMaxCount: ?import("/js/app/resources/filter_item.js").FilterItem.<number>}} ProgressBarFilters
 */

/**
 * creates a new set of user filters which has no filters except where specified
 * @param {object} kwargs the initial filters
 * @param {?import("/js/app/resources/filter_text_item.js").FilterTextItem} [kwargs.userSub]
 *   the subject of the user the progress bar belongs to
 * @param {?import("/js/app/resources/filter_text_item.js").FilterTextItem} [kwargs.name]
 *   the name of the progress bar
 * @param {?import("/js/app/resources/filter_item.js").FilterItem.<Date>} [kwargs.createdAt]
 *   when the progress bar was created
 * @param {import("/js/app/resources/filter_item.js").FilterItem.<number>} [kwargs.samplingMaxCount]
 *   the maximum number of samples used for prediction for this progress bar
 * @returns {ProgressBarFilters}
 */
export function newProgressBarFilters({
    userSub = undefined,
    name = undefined,
    createdAt = undefined,
    samplingMaxCount = undefined,
}) {
    return {
        userSub: userSub === undefined ? null : userSub,
        name: name === undefined ? null : name,
        createdAt: createdAt === undefined ? null : createdAt,
        samplingMaxCount: samplingMaxCount === undefined ? null : samplingMaxCount,
    };
}

/**
 * converts the given progress bar filters to the format expected by the api
 * @param {ProgressBarFilters} filters the filters to convert
 * @returns {any} the api representation
 */
export function progressBarFiltersToApi(filters) {
    return {
        user_sub: filters.userSub,
        name: filters.name,
        created_at:
            filters.createdAt === null
                ? null
                : {
                      operator: filters.createdAt.operator,
                      value: filters.createdAt.value.getTime() / 1000,
                  },
        sampling_max_count: filters.samplingMaxCount,
    };
}
