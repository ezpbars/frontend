import { newAugmentedPricingPlanTier } from "/js/app/user_usages/augmented_pricing_plan_tier.js";
import { newCurrentUsage } from "/js/app/user_usages/current_usage.js";
import { CurrentUsageView } from "/js/app/user_usages/current_usage_view.js";
import { parsePricingPlanTier } from "/js/app/user_usages/pricing_plan_tier.js";
import { AuthHelper } from "/js/auth_helper.js";
import { apiUrl } from "/js/fetch_helper.js";

/**
 * loads a current usage and uses a currentUsageView to show it
 */
export class CurrentUsageController {
    constructor() {
        /**
         * the element this view is attached to
         * @type {Element}
         */
        this.element = document.createElement("div");
        this.currentUsage = newCurrentUsage();
        this.view = new CurrentUsageView(this.currentUsage);
        this.render();
        this.reload();
    }
    /**
     * Adds the appropriate contents to the element for this view. Should
     * only be called once
     * @private
     */
    render() {
        this.element.classList.add("current-usage-controller");
        this.element.appendChild(this.view.element);
    }
    /**
     * gets the necessary data for current usage from the backend and updates the current usage
     */
    async reload() {
        const currentResponse = await fetch(
            apiUrl("/api/1/user_usages/get_current"),
            AuthHelper.auth({
                method: "GET",
                headers: {
                    "content-type": "application/json; charset=utf-8",
                },
            })
        );
        if (!currentResponse.ok) {
            throw currentResponse;
        }
        const data = await currentResponse.json();
        const traces = data["traces"];
        const periodStart = new Date(data["period_start_at"] * 1000);

        const tiersResponse = await fetch(
            apiUrl("/api/1/users/pricing_plans/tiers/search"),
            AuthHelper.auth({
                method: "POST",
                headers: {
                    "content-type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                    sort: [
                        {
                            key: "position",
                            dir: "asc",
                        },
                    ],
                }),
            })
        );
        if (!tiersResponse.ok) {
            throw tiersResponse;
        }
        const tiersData = await tiersResponse.json();
        /**
         * @type {Array.<{user_sub: string, uid: string, position: number, units: number, unit_amount: number, unit_price_cents: number}>}
         */
        const rawTiers = tiersData["items"];
        const tiers = rawTiers.map(parsePricingPlanTier);

        let remainingTraces = traces;
        let traceOffset = 1;
        let subtotal = 0;
        this.currentUsage.get("tiers").set([]);
        for (let i = 0; i < tiers.length; i++) {
            const tier = tiers[i];
            const tierTraces = tier.get("unitAmount") * tier.get("units");
            const augmentedTier = newAugmentedPricingPlanTier(
                tier,
                traceOffset,
                remainingTraces > tierTraces ? tierTraces : remainingTraces
            );
            this.currentUsage.get("tiers").push(augmentedTier);
            remainingTraces -= augmentedTier.get("usedTraces");
            traceOffset +=
                augmentedTier.get("pricingPlanTier").get("unitAmount") *
                augmentedTier.get("pricingPlanTier").get("units");
            subtotal += augmentedTier.get("priceCents");
        }

        this.currentUsage.set("traces", traces);
        this.currentUsage.set("periodStart", periodStart);
        this.currentUsage.set("subtotalCents", subtotal);
    }
}
