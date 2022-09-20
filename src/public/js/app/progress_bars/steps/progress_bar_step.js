import { implementReplicaListener, ListenerOf, ReplicaListener } from "/js/lib/replica_listener.js";

/**
 * progress bar step
 * @typedef {ReplicaListener & ListenerOf.<string, "userSub"> & ListenerOf.<string, "progressBarName"> & ListenerOf.<string, "uid"> & ListenerOf.<string, "name"> & ListenerOf.<number, "position"> & ListenerOf.<number, "iterated"> & ListenerOf.<"percentile" | "harmonicMean" | "geometricMean" | "arithmeticMean", "oneOffTechnique"> & ListenerOf.<number, "oneOffPercentile"> & ListenerOf.<"bestFit.linear" | "percentile" | "harmonicMean" | "geometricMean" | "arithmeticMean", "iteratedTechnique"> & ListenerOf.<number, "iteratedPercentile"> & ListenerOf.<Date, "createdAt">} ProgressBarStep
 */

export const ITERATED_TECHNIQUE_API_TO_NATIVE = {
    "best_fit.linear": "bestFit.linear",
    "percentile": "percentile",
    "harmonic_mean": "harmonicMean",
    "geometric_mean": "geometricMean",
    "arithmetic_mean": "arithemticMean"
};
export const ONE_OFF_TECHNIQUE_API_TO_NATIVE = {
    "percentile": "percentile",
    "harmonic_mean": "harmonicMean",
    "geometric_mean": "geometricMean",
    "arithmetic_mean": "arithemticMean"
};
export const ITERATED_TECHNIQUE_NATIVE_TO_API = {
    "percentile": "percentile",
    "harmonicMean": "harmonic_mean",
    "geometricMean": "geometric_mean",
    "arithmeticMean": "arithmetic_mean",
    "bestFit.linear": "best_fit.linear"
};
export const ONE_OFF_TECHNIQUE_NATIVE_TO_API = {
    "percentile": "percentile",
    "harmonicMean": "harmonic_mean",
    "geometricMean": "geometric_mean",
    "arithmeticMean": "arithmetic_mean",
};

/**
 * parses a progress bar step from the api
 * @param {object} kwargs the progress bar step from the api
 * @param {string} kwargs.user_sub the subject of the user the progress bar
 *   belongs to
 * @param {string} kwargs.progress_bar_name the name of the progress bar the
 *   step belongs to
 * @param {string} kwargs.uid the universal identifier of the step
 * @param {string} kwargs.name the name of the step
 * @param {number} kwargs.position when the step occurs within the overall task
 *   for the progress bar
 * @param {number} kwargs.iterated indicates whether the step is iterated; 1 if
 *   it is, 0 if not
 * @param {"percentile" | "harmonic_mean" | "geometric_mean" | "arithmetic_mean"} kwargs.one_off_technique required for non-iterated i.e.,
 *   one-off steps. The technique to use to predict the time step will take.
 * @param {number} kwargs.one_off_percentile required for non-iterated steps
 *   using the percentile technique. the percent of samples which should complete
 *   faster than the predicted amount of time.
 * @param {"best_fit.linear" | "percentile" | "harmonic_mean" | "geometric_mean" | "arithmetic_mean"} kwargs.iterated_technique required for iterated steps. The
 *   technique used to predict the time the step takes
 * @param {number} kwargs.iterated_percentile see one-off percentile
 * @param {number} kwargs.created_at when the progress bar step was created
 * @returns {ProgressBarStep} the parsed progress bar step
 */
export function parseProgressBarStep({ user_sub, progress_bar_name, uid, name, position, iterated, one_off_technique, one_off_percentile, iterated_technique, iterated_percentile, created_at }) {
    // @ts-ignore
    return implementReplicaListener(
        { key: "userSub", val: user_sub },
        { key: "progressBarName", val: progress_bar_name },
        { key: "uid", val: uid },
        { key: "name", val: name },
        { key: "position", val: position },
        { key: "iterated", val: iterated },
        {
            key: "oneOffTechnique", val: ONE_OFF_TECHNIQUE_API_TO_NATIVE[one_off_technique]
        },
        { key: "oneOffPercentile", val: one_off_percentile },
        {
            key: "iteratedTechnique", val: ITERATED_TECHNIQUE_API_TO_NATIVE[iterated_technique]
        },
        { key: "iteratedPercentile", val: iterated_percentile },
        // @ts-ignore
        { key: "createdAt", val: new Date(created_at * 1000) }
    );
}
