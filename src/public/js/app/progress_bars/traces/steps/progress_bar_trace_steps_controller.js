import { ProgressBarTraceStepFiltersController } from "/js/app/progress_bars/traces/steps/progress_bar_trace_step_filters_controller.js";
import { ProgressBarTraceStepReader } from "/js/app/progress_bars/traces/steps/progress_bar_trace_step_reader.js";
import { ProgressBarTraceStepView } from "/js/app/progress_bars/traces/steps/progress_bar_trace_step_view.js";
import { Listing } from "/js/app/resources/listing.js";
import { PageableItems } from "/js/app/resources/pageable_items.js";
import { simpleArrayListener } from "/js/lib/replica_listener.js";

/**
 * Shows a listing for progress bar trace steps and allows filtering
 */
export class ProgressBarTraceStepsController {
    constructor() {
        /**
         * the element this view is attached to
         * @type {Element}
         * @readonly
         */
        this.element = document.createElement("div");
        /**
         * the object responsible for fetching progress bar trace steps from the api
         * @type {ProgressBarTraceStepReader}
         * @readonly
         */
        this.reader = new ProgressBarTraceStepReader();
        /**
         * the view for the items
         * @type {PageableItems.<ProgressBarTraceStepView>}
         * @readonly
         */
        this.itemsView = new PageableItems({ onMore: this.reader.loadNext.bind(this.reader) });
        this.reader.items.addArrayListenerAndInvoke(
            simpleArrayListener({
                insert: (index, progressBarTraceStep) => {
                    const replica = progressBarTraceStep.createReplica();
                    this.itemsView.items.items.splice(index, 0, new ProgressBarTraceStepView(replica));
                },
                remove: (index) => {
                    this.itemsView.items.items.splice(index, 1)[0].progressBarTraceStep.detach();
                },
            })
        );
        this.reader.hasNextPage.addListenerAndInvoke((hasNext) => {
            this.itemsView.hasMore.value = hasNext;
        });
        /**
         * the view for changing the filters and sort
         * @type {ProgressBarTraceStepFiltersController}
         * @readonly
         */
        this.filterController = new ProgressBarTraceStepFiltersController(
            this.reader.filters.value,
            this.reader.sort.value
        );
        this.filterController.filters.addListener((filters) => {
            this.reader.filters.value = filters;
        });
        this.filterController.sort.addListener((sort) => {
            this.reader.sort.value = sort;
        });
        this.render();
    }
    /**
     * adds the appropriate contents to the element for this view. Should
     * only be called once
     * @private
     */
    render() {
        this.element.appendChild(
            new Listing(this.itemsView, { element: document.createElement("div") }, this.filterController).element
        );
    }
}
