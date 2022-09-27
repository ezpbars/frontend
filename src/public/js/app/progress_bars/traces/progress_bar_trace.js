import { implementReplicaListener, ListenerOf, ReplicaListener } from "/js/lib/replica_listener.js";
/**
 * @typedef {ReplicaListener & ListenerOf.<string, "userSub"> & ListenerOf.<string, "progressBarName"> & ListenerOf.<string, "uid"> & ListenerOf.<Date, "createdAt">} ProgressBarTrace
 */

/**
 * @param {object} kwargs the progress bar trace from tha api
 * @param {string} kwargs.user_sub the subject of the user the trace belongs to
 * @param {string} kwargs.progress_bar_name the name of the progress bar the trace belongs to
 * @param {string} kwargs.uid the uid of the trace
 * @param {number} kwargs.created_at when the trace was created
 * @returns {ProgressBarTrace} the parsed progress bar trace
 */
export function parseProgressBarTrace({ user_sub, progress_bar_name, uid, created_at }) {
    return implementReplicaListener(
        { key: "userSub", val: user_sub },
        { key: "progressBarName", val: progress_bar_name },
        { key: "uid", val: uid },
        { key: "createdAt", val: new Date(created_at * 1000) }
    );
}
