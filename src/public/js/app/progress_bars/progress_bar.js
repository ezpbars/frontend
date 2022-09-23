import { parseProgressBarStep } from "/js/app/progress_bars/steps/progress_bar_step.js";
import { implementReplicaListener, ListenerOf, ReplicaListener } from "/js/lib/replica_listener.js";
/**
 * progress bar
 * @typedef {ReplicaListener & ListenerOf.<string, "userSub"> & ListenerOf.<string, "uid"> & ListenerOf.<string, "name"> & ListenerOf.<number, "samplingMaxCount"> & ListenerOf.<number, "samplingMaxAgeSeconds"> & ListenerOf.<"systematic" | "simpleRandom", "samplingTechnique"> & ListenerOf.<number, "version"> & ListenerOf.<Date, "createdAt"> & ListenerOf.<import("/js/app/progress_bars/steps/progress_bar_step.js").ProgressBarStep, "defaultStepConfig">} ProgressBar
 */

/**
 * @type {{"systematic": "systematic","simple_random": "simpleRandom"}}
 */
export const SAMPLING_TECHNIQUE_API_TO_NATIVE = {
    "systematic": "systematic",
    "simple_random": "simpleRandom"
};
export const SAMPLING_TECHNIQUE_NATIVE_TO_API = {
    "systematic": "systematic",
    "simpleRandom": "simple_random"
};

/**
 * parses a progress bar from the api
 * @param {object} kwargs the progress bar from the api
 * @param {string} kwargs.user_sub the subject of the user the progress bar belongs to
 * @param {string} kwargs.uid the universal identifier for the progress bar
 * @param {string} kwargs.name the name of the progress bar
 * @param {number} kwargs.sampling_max_count the maximum number of samples used in prediction for the progress bar
 * @param {number} kwargs.sampling_max_age_seconds the maximum age of samples to retain to be used in prediction for the progress bar in seconds
 * @param {"systematic" | "simple_random"} kwargs.sampling_technique the technique to use to choose which samples to retain for prediction
 * @param {number} kwargs.version the number of times the steps and traces had to be reset because we received a trace with different steps
 * @param {number} kwargs.created_at when the progress bar was created
 * @param {{user_sub: string, progress_bar_name: string, uid: string, name: string, position: number, iterated: number, one_off_technique: "percentile" | "harmonic_mean" | "geometric_mean" | "arithmetic_mean", one_off_percentile: number, iterated_technique: "best_fit.linear" | "percentile" | "harmonic_mean" | "geometric_mean" | "arithmetic_mean", iterated_percentile: number, created_at: number}} kwargs.default_step_config the configuration to use for the default step
 * @returns {ProgressBar} the parsed progress bar
 */
export function parseProgressBar({ user_sub, uid, name, sampling_max_count, sampling_max_age_seconds, sampling_technique, version, created_at, default_step_config }) {
    return implementReplicaListener(
        { key: "userSub", val: user_sub },
        { key: "uid", val: uid },
        { key: "name", val: name },
        { key: "samplingMaxCount", val: sampling_max_count },
        { key: "samplingMaxAgeSeconds", val: sampling_max_age_seconds },
        { key: "samplingTechnique", val: SAMPLING_TECHNIQUE_API_TO_NATIVE[sampling_technique] },
        { key: "version", val: version },
        { key: "createdAt", val: new Date(created_at * 1000) },
        { key: "defaultStepConfig", val: parseProgressBarStep(default_step_config) }
    );
}
