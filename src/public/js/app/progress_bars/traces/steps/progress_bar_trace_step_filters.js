/**
 * the filters that can be used on progress bar trace steps
 * @typedef {{userSub: ?import("/js/app/resources/filter_text_item.js").FilterTextItem, progressBarName: ?import("/js/app/resources/filter_text_item.js").FilterTextItem, progressBarStepName: ?import("/js/app/resources/filter_text_item.js").FilterTextItem, progressBarStepPosition: ?import("/js/app/resources/filter_item.js").FilterItem.<number>, progressBarTraceUid: ?import("/js/app/resources/filter_text_item.js").FilterTextItem, uid: ?import("/js/app/resources/filter_text_item.js").FilterTextItem, iterations: ?import("/js/app/resources/filter_item.js").FilterItem.<number>, startedAt: ?import("/js/app/resources/filter_item.js").FilterItem.<Date>, finishedAt: ?import("/js/app/resources/filter_item.js").FilterItem.<Date>, duration: ?import("/js/app/resources/filter_item.js").FilterItem.<number>, normalizedDuration: ?import("/js/app/resources/filter_item.js").FilterItem.<number>}} ProgressBarTraceStepFilters
 */

/**
 * creates a new set of progress bar trace step filters which has no filters except where
 * specified
 * @param {object} kwargs the initial filters
 * @param {?import("/js/app/resources/filter_text_item.js").FilterTextItem} [kwargs.userSub]
 *   the sub for the user the progress bar belongs to
 * @param {?import("/js/app/resources/filter_text_item.js").FilterTextItem} [kwargs.progressBarName]
 *   the name of the progress bar to which the step belongs
 * @param {?import("/js/app/resources/filter_text_item.js").FilterTextItem} [kwargs.progressBarStepName]
 *   the name of the progress bar step to which the trace step belongs
 * @param {?import("/js/app/resources/filter_item.js").FilterItem.<number>} [kwargs.progressBarStepPosition]
 *   the position of the progress bar step to which the trace step belongs
 * @param {?import("/js/app/resources/filter_text_item.js").FilterTextItem} [kwargs.progressBarTraceUid]
 *   the uid of the progress bar trace to which the trace step belongs
 * @param {?import("/js/app/resources/filter_text_item.js").FilterTextItem} [kwargs.uid]
 *   the primary stable external identifier
 * @param {?import("/js/app/resources/filter_item.js").FilterItem.<number>} [kwargs.iterations]
 *   if the step is iterated, how many iterations were needed for this step in this trace
 * @param {?import("/js/app/resources/filter_item.js").FilterItem.<Date>} [kwargs.startedAt]
 *   the time the step began for this trace in seconds since the unix epoch
 * @param {?import("/js/app/resources/filter_item.js").FilterItem.<Date>} [kwargs.finishedAt]
 *   the time the step finished for this trace in seconds since the unix epoch
 * @param {?import("/js/app/resources/filter_item.js").FilterItem.<number>} [kwargs.duration]
 *   the duration of the step for this trace in seconds
 * @param {?import("/js/app/resources/filter_item.js").FilterItem.<number>} [kwargs.normalizedDuration]
 *   the normalized duration of the step for this trace in seconds
 * @returns {ProgressBarTraceStepFilters} the new filters
 */
export function newProgressBarTraceStepFilters({
    userSub = undefined,
    progressBarName = undefined,
    progressBarStepName = undefined,
    progressBarStepPosition = undefined,
    progressBarTraceUid = undefined,
    uid = undefined,
    iterations = undefined,
    startedAt = undefined,
    finishedAt = undefined,
    duration = undefined,
    normalizedDuration = undefined,
}) {
    return {
        userSub: userSub === undefined ? null : userSub,
        progressBarName: progressBarName === undefined ? null : progressBarName,
        progressBarStepName: progressBarStepName === undefined ? null : progressBarStepName,
        progressBarStepPosition: progressBarStepPosition === undefined ? null : progressBarStepPosition,
        progressBarTraceUid: progressBarTraceUid === undefined ? null : progressBarTraceUid,
        uid: uid === undefined ? null : uid,
        iterations: iterations === undefined ? null : iterations,
        startedAt: startedAt === undefined ? null : startedAt,
        finishedAt: finishedAt === undefined ? null : finishedAt,
        duration: duration === undefined ? null : duration,
        normalizedDuration: normalizedDuration === undefined ? null : normalizedDuration,
    };
}

/**
 * converts the given progress bar trace step filters to the format expected by the API
 * @param {ProgressBarTraceStepFilters} filters
 * @returns {any} the filters in the format expected by the API
 */
export function progressBarTraceStepFiltersToApi(filters) {
    return {
        user_sub: filters.userSub,
        progress_bar_name: filters.progressBarName,
        progress_bar_step_name: filters.progressBarStepName,
        progress_bar_step_position: filters.progressBarStepPosition,
        progress_bar_trace_uid: filters.progressBarTraceUid,
        uid: filters.uid,
        iterations: filters.iterations,
        started_at:
            filters.startedAt === null
                ? null
                : {
                      operator: filters.startedAt.operator,
                      value: filters.startedAt.value.getTime() / 1000,
                  },
        finished_at:
            filters.finishedAt === null
                ? null
                : {
                      operator: filters.finishedAt.operator,
                      value: filters.finishedAt.value.getTime() / 1000,
                  },
        duration: filters.duration,
        normalized_duration: filters.normalizedDuration,
    };
}
