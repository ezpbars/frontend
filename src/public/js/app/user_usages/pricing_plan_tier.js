import { implementReplicaListener, ListenerOf, ReplicaListener } from "/js/lib/replica_listener.js";

/**
 * one graduated pricing tier within a pricing plan
 *
 * the plan that a user is on is refered to as a pricing plan, for the most
 * part, people are on the public plan. Each plan is composed of an (ordered)
 * list of tiers. Each tier has the number of `units` and a `unitPriceCents`
 * that corresponds to how many units are available at that price.
 *
 * Since we are using graduated pricing, if the `units` for each tier are `x`, `y`, `z`
 * respectively, and the `unitPriceCents` are `a`, `b`, `c` respectively, then the first
 * `x` units are `a` cents each, the next `y` units are `b` cents each, and the next `z`
 * units are `c` cents each. Note that the last tier within a given plan always has
 * `units = null`, which means there is no limit on the number of units in that tier
 *
 * for more information on graduated pricing, go to
 * https://stripe.com/docs/products-prices/pricing-models#usage-based-pricing
 * @typedef {ReplicaListener & ListenerOf.<string, "userSub"> & ListenerOf.<string, "uid"> & ListenerOf.<number, "position"> & ListenerOf.<number, "units"> & ListenerOf.<number, "unitAmount"> & ListenerOf.<number, "unitPriceCents">} PricingPlanTier
 */

/**
 * parses the users pricing plan tier from the api
 * @param {object} kwargs the pricing plan tier from the api
 * @param {string} kwargs.user_sub the users sub
 * @param {string} kwargs.uid the universal identifier for the tier
 * @param {number} kwargs.position the position of the tier within the pricing plan
 * @param {number} kwargs.units the number of units the tier covers
 * @param {number} kwargs.unit_amount the amount of traces in a unit
 * @param {number} kwargs.unit_price_cents the price of each unit in cents
 * @returns {PricingPlanTier} the parsed pricing plan tier
 */
export function parsePricingPlanTier({ user_sub, uid, position, units, unit_amount, unit_price_cents }) {
    return implementReplicaListener(
        { key: "userSub", val: user_sub },
        { key: "uid", val: uid },
        { key: "position", val: position },
        { key: "units", val: units },
        { key: "unitAmount", val: unit_amount },
        { key: "unitPriceCents", val: unit_price_cents }
    );
}
