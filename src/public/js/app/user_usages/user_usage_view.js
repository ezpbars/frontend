import { DumbResourceSection } from "/js/app/resources/dumb_resource_section.js";
import { ResourceSection } from "/js/app/resources/resource_section.js";
import { ListenerOf, ReplicaListener } from "/js/lib/replica_listener.js";

/**
 * shows a user usage
 */
export class UserUsageView {
    /**
     *
     * @param {import("/js/app/user_usages/user_usage.js").UserUsage} userUsage the user usage to show
     */
    constructor(userUsage) {
        /**
         * the element this view is attached to
         * @type {Element}
         * @readonly
         */
        this.element = document.createElement("div");
        /**
         * the user usage to show
         * @type {import("/js/app/user_usages/user_usage.js").UserUsage}
         * @readonly
         */
        this.userUsage = userUsage;
        this.render();
    }
    /**
     * Adds the appropriate contents to the element for this view. Should
     * only be called once
     * @private
     */
    render() {
        this.element.classList.add("user-usage-view", "elevation-medium");
        this.element.appendChild(
            (() => {
                const section = new DumbResourceSection("Billing Period", "");
                const updateValue = () => {
                    section.value.value =
                        this.userUsage.get("periodStartedAt").toLocaleDateString(undefined, { timeZone: "UTC" }) +
                        " - " +
                        this.userUsage.get("periodEndedAt").toLocaleDateString(undefined, { timeZone: "UTC" });
                };
                updateValue();
                this.userUsage.addListener("periodStartedAt", updateValue);
                this.userUsage.addListener("periodEndedAt", updateValue);
                return section.element;
            })()
        );
        this.element.appendChild(
            (() => {
                /** @type {ReplicaListener & ListenerOf.<number, "traces">} */
                const data = this.userUsage;
                const section = new ResourceSection(data, "traces", {
                    label: "Traces",
                    formatter: (value) => value.toLocaleString(),
                });
                return section.element;
            })()
        );
        this.element.appendChild(
            (() => {
                /** @type {ReplicaListener & ListenerOf.<number, "cost">} */
                const data = this.userUsage;
                const section = new ResourceSection(data, "cost", {
                    label: "Cost",
                    formatter: (value) => (value / 100).toLocaleString("en-US", { style: "currency", currency: "USD" }),
                });
                return section.element;
            })()
        );
        this.element.appendChild(
            (() => {
                /** @type {ReplicaListener & ListenerOf.<string, "hostedInvoiceUrl">} */
                const data = this.userUsage;
                const section = new ResourceSection(data, "hostedInvoiceUrl", {
                    label: "Invoice",
                    formatter: (value) => {
                        if (value === null) {
                            return null;
                        }
                        const link = document.createElement("a");
                        link.href = value;
                        link.textContent = "View on Stripe";
                        return link;
                    },
                });
                return section.element;
            })()
        );
    }
}
