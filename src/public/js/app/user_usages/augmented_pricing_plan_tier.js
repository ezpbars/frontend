import { implementReplicaListener, ListenerOf, ReplicaListener } from "/js/lib/replica_listener.js";

/**
 * a pricing plan tier precomputed for a specific numebr of traces
 * @typedef {ReplicaListener & ListenerOf.<import("/js/app/user_usages/pricing_plan_tier.js").PricingPlanTier, "pricingPlanTier"> & ListenerOf.<number, "traceOffset"> & ListenerOf.<number, "usedTraces"> & ListenerOf.<number, "priceCents">} AugmentedPricingPlanTier
 */

/**
 * creates a new augmented pricing plan tier
 * @param {import("/js/app/user_usages/pricing_plan_tier.js").PricingPlanTier} pricingPlanTier the pricing plan tier
 * @param {number} traceOffset the trace that starts this tier, for example, if the first two tiers cover
 *   traces 1-5000 and 5001-95000 respectively, then the traceOffsets are 1 and 5001 respectively
 * @param {number} usedTraces the number of traces that have been used this month so far
 * @returns {AugmentedPricingPlanTier} the augmented pricing plan tier
 */
export function newAugmentedPricingPlanTier(pricingPlanTier, traceOffset, usedTraces) {
    return implementReplicaListener(
        { key: "pricingPlanTier", val: pricingPlanTier },
        { key: "traceOffset", val: traceOffset },
        { key: "usedTraces", val: usedTraces },
        {
            key: "priceCents",
            val: pricingPlanTier.get("unitPriceCents") * Math.floor(usedTraces / pricingPlanTier.get("unitAmount")),
        }
    );
}
