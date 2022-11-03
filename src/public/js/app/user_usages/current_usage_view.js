import { Collapse } from "/js/app/resources/collapse.js";
import { ResourceSection } from "/js/app/resources/resource_section.js";
import { simpleArrayListener } from "/js/lib/replica_listener.js";

/**
 * A single row within the current usage summary which describes a certain
 * number of traces at a set price
 */
class CurrentUsageRow {
    /**
     *
     * @param {import("/js/app/user_usages/augmented_pricing_plan_tier.js").AugmentedPricingPlanTier} augmentedPricingPlanTier
     *   The tier to show
     */
    constructor(augmentedPricingPlanTier) {
        /**
         * The actual element containing the content of this row; this is
         * collapsed when there are no used traces in this row
         * @type {Element}
         * @private
         * @readonly
         */
        this.realElement = document.createElement("div");

        const collapse = new Collapse(this.realElement, { visible: augmentedPricingPlanTier.get("usedTraces") > 0 });
        augmentedPricingPlanTier.addListener("usedTraces", (usedTraces) => {
            collapse.visible.value = usedTraces > 0;
        });

        /**
         * The element this view is attached to
         * @type {Element}
         * @readonly
         */
        this.element = collapse.element;

        /**
         * The tier to show
         * @type {import("/js/app/user_usages/augmented_pricing_plan_tier.js").AugmentedPricingPlanTier}
         * @readonly
         */
        this.augmentedPricingPlanTier = augmentedPricingPlanTier;

        this.render();
    }

    /**
     * Adds the appropriate contents to the element for this view. Should
     * only be called once
     * @private
     */
    render() {
        this.realElement.classList.add("user-usages-current-usage-row");

        this.realElement.appendChild(
            (() => {
                const traceIndices = document.createElement("div");
                traceIndices.classList.add("user-usages-current-usage-row-trace-indices");

                traceIndices.appendChild(
                    (() => {
                        const left = document.createElement("div");
                        left.classList.add("user-usages-current-usage-row-trace-indices-left");
                        this.augmentedPricingPlanTier.addListenerAndInvoke("traceOffset", (traceOffset) => {
                            left.textContent = traceOffset.toString();
                        });
                        return left;
                    })()
                );
                traceIndices.appendChild(
                    (() => {
                        const separator = document.createElement("div");
                        separator.classList.add("user-usages-current-usage-row-trace-indices-separator");
                        separator.textContent = "-";
                        return separator;
                    })()
                );
                traceIndices.appendChild(
                    (() => {
                        const right = document.createElement("div");
                        right.classList.add("user-usages-current-usage-row-trace-indices-right");

                        const updateText = () => {
                            const startOffset = this.augmentedPricingPlanTier.get("traceOffset");
                            const numConsumed = this.augmentedPricingPlanTier.get("usedTraces");
                            const endOffset = startOffset + numConsumed - 1;

                            right.textContent = endOffset.toString();
                        };

                        updateText();
                        this.augmentedPricingPlanTier.addListener("traceOffset", updateText);
                        this.augmentedPricingPlanTier.addListener("usedTraces", updateText);

                        return right;
                    })()
                );
                return traceIndices;
            })()
        );

        this.realElement.appendChild(
            (() => {
                const priceSection = document.createElement("div");
                priceSection.classList.add("user-usages-current-usage-row-price-section");
                priceSection.appendChild(
                    (() => {
                        const priceCalculation = document.createElement("div");
                        priceCalculation.classList.add("user-usages-current-usage-row-price-calculation");

                        priceCalculation.appendChild(
                            (() => {
                                const usedTracesDiv = document.createElement("div");
                                usedTracesDiv.classList.add(
                                    "user-usages-current-usage-row-price-calculation-used-traces"
                                );
                                this.augmentedPricingPlanTier.addListenerAndInvoke("usedTraces", (usedTraces) => {
                                    usedTracesDiv.textContent = usedTraces.toString();
                                });
                                return usedTracesDiv;
                            })()
                        );
                        priceCalculation.appendChild(
                            (() => {
                                const separator = document.createElement("div");
                                separator.classList.add("user-usages-current-usage-row-price-calculation-separator");
                                separator.textContent = "@";
                                return separator;
                            })()
                        );
                        priceCalculation.appendChild(
                            (() => {
                                const pricePerUnitDiv = document.createElement("div");
                                pricePerUnitDiv.classList.add(
                                    "user-usages-current-usage-row-price-calculation-price-per-trace"
                                );
                                this.augmentedPricingPlanTier
                                    .get("pricingPlanTier")
                                    .addListenerAndInvoke("unitPriceCents", (unitPriceCents) => {
                                        const unitPriceDollars = unitPriceCents / 100;
                                        let formatted = unitPriceDollars.toLocaleString("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                        });
                                        if (formatted.endsWith(".00")) {
                                            formatted = formatted.slice(0, -3);
                                        }
                                        pricePerUnitDiv.textContent = formatted;
                                    });
                                return pricePerUnitDiv;
                            })()
                        );
                        priceCalculation.appendChild(
                            (() => {
                                const separator = document.createElement("div");
                                separator.classList.add("user-usages-current-usage-row-price-calculation-separator");
                                separator.textContent = "/";
                                return separator;
                            })()
                        );
                        priceCalculation.appendChild(
                            (() => {
                                const unitAmountDiv = document.createElement("div");
                                unitAmountDiv.classList.add("user-usages-current-usage-row-price-calculation-unit");
                                this.augmentedPricingPlanTier
                                    .get("pricingPlanTier")
                                    .addListenerAndInvoke("unitAmount", (unitAmount) => {
                                        unitAmountDiv.textContent = unitAmount.toString();
                                    });
                                return unitAmountDiv;
                            })()
                        );
                        priceCalculation.appendChild(
                            (() => {
                                const unitNameDiv = document.createElement("div");
                                unitNameDiv.classList.add("user-usages-current-usage-row-price-calculation-unit-name");
                                unitNameDiv.textContent = "traces";
                                return unitNameDiv;
                            })()
                        );
                        return priceCalculation;
                    })()
                );
                priceSection.appendChild(
                    (() => {
                        const separator = document.createElement("div");
                        separator.classList.add("user-usages-current-usage-row-price-section-separator");
                        separator.textContent = "=";
                        return separator;
                    })()
                );
                priceSection.appendChild(
                    (() => {
                        const priceDiv = document.createElement("div");
                        priceDiv.classList.add("user-usages-current-usage-row-price");
                        this.augmentedPricingPlanTier.addListenerAndInvoke("priceCents", (priceCents) => {
                            const priceDollars = priceCents / 100;
                            let formatted = priceDollars.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                            });
                            if (formatted.endsWith(".00")) {
                                formatted = formatted.slice(0, -3);
                            }
                            priceDiv.textContent = formatted;
                        });
                        return priceDiv;
                    })()
                );
                return priceSection;
            })()
        );
    }
}

/**
 * shows a user's usage for the current billing period
 */
export class CurrentUsageView {
    /**
     *
     * @param {import("/js/app/user_usages/current_usage.js").CurrentUsage} currentUsage the users current usage to show
     */
    constructor(currentUsage) {
        /**
         * the element this view is attached to
         * @type {Element}
         */
        this.element = document.createElement("div");
        /**
         * the users current usage to show
         * @type {import("/js/app/user_usages/current_usage.js").CurrentUsage}
         * @readonly
         */
        this.currentUsage = currentUsage;
        this.render();
    }
    /**
     * Adds the appropriate contents to the element for this view. Should
     * only be called once
     * @private
     */
    render() {
        this.element.classList.add("current-usage-view", "elevation-medium");
        this.element.appendChild(
            (() => {
                const element = document.createElement("div");
                element.classList.add("current-usage-view-traces-since-period-start");
                const updateText = () => {
                    element.textContent = `Since ${this.currentUsage.get("periodStart").toLocaleString("en-US", {
                        timeZone: "UTC",
                        dateStyle: "full",
                    })}, you have used ${this.currentUsage.get("traces")} traces.`;
                };
                updateText();
                this.currentUsage.addListener("periodStart", updateText);
                this.currentUsage.addListener("traces", updateText);
                return element;
            })()
        );
        this.element.appendChild(
            (() => {
                const costSoFar = document.createElement("div");
                costSoFar.classList.add("current-usage-view-cost-so-far");
                costSoFar.appendChild(
                    (() => {
                        const title = document.createElement("div");
                        title.classList.add("current-usage-view-cost-so-far-title");
                        title.textContent = "Estimated cost so far:";
                        return title;
                    })()
                );

                costSoFar.appendChild(
                    (() => {
                        const rows = document.createElement("div");
                        rows.classList.add("current-usage-view-rows");
                        /**
                         * @type {Array.<import("/js/app/user_usages/augmented_pricing_plan_tier.js").AugmentedPricingPlanTier>}
                         * @readonly
                         */
                        const replicas = [];
                        this.currentUsage.get("tiers").addArrayListenerAndInvoke(
                            simpleArrayListener({
                                insert: (idx, tier) => {
                                    const replica = tier.createReplica();
                                    replica.detach();
                                    replica.set("pricingPlanTier", tier.get("pricingPlanTier").createReplica());
                                    replica.attach(tier);
                                    replicas.splice(idx, 0, replica);

                                    const view = new CurrentUsageRow(replica);
                                    if (idx === 0) {
                                        rows.insertAdjacentElement("afterbegin", view.element);
                                    } else {
                                        rows.children[idx - 1].insertAdjacentElement("afterend", view.element);
                                    }
                                },
                                remove: (idx) => {
                                    const replica = replicas.splice(idx, 1)[0];
                                    replica.detach();
                                    replica.get("pricingPlanTier").detach();

                                    rows.children[idx].remove();
                                },
                            })
                        );
                        return rows;
                    })()
                );
                return costSoFar;
            })()
        );
        this.element.appendChild(
            (() => {
                const total = document.createElement("div");
                total.classList.add("current-usage-view-total");
                const updateTotal = () => {
                    const totalDollars = this.currentUsage.get("subtotalCents") / 100;
                    let formatted = totalDollars.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                    });
                    if (formatted.endsWith(".00")) {
                        formatted = formatted.slice(0, -3);
                    }
                    total.textContent = `Subtotal: ${formatted}`;
                };
                updateTotal();
                this.currentUsage.addListener("subtotalCents", updateTotal);
                return total;
            })()
        );
    }
}
