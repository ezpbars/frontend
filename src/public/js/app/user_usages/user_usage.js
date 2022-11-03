import { implementReplicaListener, ListenerOf, ReplicaListener } from "/js/lib/replica_listener.js";

/**
 * the record of a users past usage for one month which has already been paid for
 * @typedef {ReplicaListener & ListenerOf.<string, "userSub"> & ListenerOf.<string, "uid"> & ListenerOf.<string, "hostedInvoiceUrl"> & ListenerOf.<Date, "periodStartedAt"> & ListenerOf.<Date, "periodEndedAt"> & ListenerOf.<number, "traces"> & ListenerOf.<number, "cost">} UserUsage
 */

/**
 * parses the user usage from the api
 * @param {object} kwargs the user suage from the api
 * @param {string} kwargs.user_sub the user sub
 * @param {string} kwargs.uid the uid of the usage record
 * @param {string} kwargs.hosted_invoice_url the url for the hosted invoice page on stripe
 * @param {number} kwargs.period_started_at when the billing period started
 * @param {number} kwargs.period_ended_at when the billing period ended
 * @param {number} kwargs.traces the number of traces used for this billing period
 * @param {number} kwargs.cost the total cost the user was charged
 * @returns {UserUsage} the parsed user usage
 */
export function parseUserUsage({
    user_sub,
    uid,
    hosted_invoice_url,
    period_started_at,
    period_ended_at,
    traces,
    cost,
}) {
    return implementReplicaListener(
        { key: "userSub", val: user_sub },
        { key: "uid", val: uid },
        { key: "hostedInvoiceUrl", val: hosted_invoice_url },
        { key: "periodStartedAt", val: new Date(period_started_at * 1000) },
        { key: "periodEndedAt", val: new Date(period_ended_at * 1000) },
        { key: "traces", val: traces },
        { key: "cost", val: cost }
    );
}
