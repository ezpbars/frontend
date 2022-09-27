import { implementReplicaListener, ListenerOf, ReplicaListener } from "/js/lib/replica_listener.js";

/**
 * progress bar trace step
 * describes how long a single step took in a trace

 * @typedef {ReplicaListener & ListenerOf.<string, "userSub"> & ListenerOf.<string, "progressBarName"> & ListenerOf.<string, "progressBarStepName"> & ListenerOf.<number, "progressBarStepPosition"> & ListenerOf.<string, "progressBarTraceUid"> & ListenerOf.<string, "uid"> & ListenerOf.<number, "iterations"> & ListenerOf.<Date, "startedAt"> & ListenerOf.<Date, "finishedAt">} ProgressBarTraceStep
 */

/**
 * parses a progress bar trace step from the api representation
 * @param {object} kwargs the api representation
 * @param {string} kwargs.user_sub the sub for the user the progress bar belongs to
 * @param {string} kwargs.progress_bar_name the name of the progress bar to which the step belongs
 * @param {string} kwargs.progress_bar_step_name the name of the progress bar step to which the trace step belongs
 * @param {number} kwargs.progress_bar_step_position the position of the progress bar step to which the trace step belongs
 * @param {string} kwargs.progress_bar_trace_uid the uid of the progress bar trace to which the trace step belongs
 * @param {string} kwargs.uid the primary stable external identifier
 * @param {number} kwargs.iterations if the step is iterated, how many iterations were needed for this step in this trace
 * @param {number} kwargs.started_at the time the step began for this trace in seconds
 * @param {number} kwargs.finished_at the time the step finished for this trace in seconds
 * @returns {ProgressBarTraceStep} the parsed progress bar trace step
 */
export function parseProgressBarTraceStep(kwargs) {
    return implementReplicaListener(
        { key: "userSub", val: kwargs.user_sub },
        { key: "progressBarName", val: kwargs.progress_bar_name },
        { key: "progressBarStepName", val: kwargs.progress_bar_step_name },
        { key: "progressBarStepPosition", val: kwargs.progress_bar_step_position },
        { key: "progressBarTraceUid", val: kwargs.progress_bar_trace_uid },
        { key: "uid", val: kwargs.uid },
        { key: "iterations", val: kwargs.iterations },
        { key: "startedAt", val: new Date(kwargs.started_at * 1000) },
        { key: "finishedAt", val: new Date(kwargs.finished_at * 1000) }
    );
}
