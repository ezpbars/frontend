import { newAugmentedPricingPlanTier } from "/js/app/user_usages/augmented_pricing_plan_tier.js";
import { parsePricingPlanTier } from "/js/app/user_usages/pricing_plan_tier.js";
import { AuthHelper } from "/js/auth_helper.js";
import {
    ArrayListenerOf,
    implementReplicaListener,
    ListenerOf,
    newArrayListenerOf,
    ReplicaListener,
} from "/js/lib/replica_listener.js";

/**
 * current usage
 * @typedef {ReplicaListener & ListenerOf.<number, "traces"> & ListenerOf.<Date, "periodStart"> & ListenerOf.<ArrayListenerOf.<import("/js/app/user_usages/augmented_pricing_plan_tier.js").AugmentedPricingPlanTier>, "tiers"> & ListenerOf.<number, "subtotalCents">} CurrentUsage
 */

/**
 * creates a blank current usage with one tier
 * @returns {CurrentUsage} the blank current usage
 */
export function newCurrentUsage() {
    return implementReplicaListener(
        { key: "traces", val: 0 },
        { key: "periodStart", val: new Date() },
        {
            key: "tiers",
            val: newArrayListenerOf([
                newAugmentedPricingPlanTier(
                    parsePricingPlanTier({
                        user_sub: AuthHelper.retrieveSub() || "",
                        uid: "",
                        position: 0,
                        units: null,
                        unit_amount: 1000,
                        unit_price_cents: 0,
                    }),
                    1,
                    0
                ),
            ]),
        },
        { key: "subtotalCents", val: 0 }
    );
}
