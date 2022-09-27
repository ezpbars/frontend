import { ProgressBarTraceFiltersController } from "/js/app/progress_bars/traces/progress_bar_trace_filters_controller.js";
import { ProgressBarTraceReader } from "/js/app/progress_bars/traces/progress_bar_trace_reader.js";
import { ProgressBarTraceView } from "/js/app/progress_bars/traces/progress_bar_trace_view.js";
import { Listing } from "/js/app/resources/listing.js";
import { PageableItems } from "/js/app/resources/pageable_items.js";
import { simpleArrayListener } from "/js/lib/replica_listener.js";

/**
 * loads and renders the logged in users progress bar traces
 */
export class ProgressBarTraceController {
    constructor() {
        /**
         * the element this view is attached to
         * @type {Element}
         * @readonly
         */
        this.element = document.createElement("div");
        /**
         * the object responsible for fetching progress bar traces from the api
         * @type {ProgressBarTraceReader}
         * @readonly
         */
        this.reader = new ProgressBarTraceReader();
        /**
         * the view for the items
         * @type {PageableItems.<ProgressBarTraceView>}
         * @readonly
         */
        this.itemsView = new PageableItems({ onMore: this.reader.loadNext.bind(this.reader) });
        this.reader.items.addArrayListenerAndInvoke(
            simpleArrayListener({
                insert: (index, progressBarTrace) => {
                    const replica = progressBarTrace.createReplica();
                    this.itemsView.items.items.splice(
                        index,
                        0,
                        new ProgressBarTraceView(replica, this.onDelete.bind(this, replica))
                    );
                },
                remove: (index) => {
                    this.itemsView.items.items.splice(index, 1)[0].progressBarTrace.detach();
                },
            })
        );
        this.reader.hasNextPage.addListenerAndInvoke((hasNext) => {
            this.itemsView.hasMore.value = hasNext;
        });
        this.filterController = new ProgressBarTraceFiltersController(
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
     *
     * @param {import("/js/app/progress_bars/traces/progress_bar_trace.js").ProgressBarTrace} progressBarTrace
     *   the progress bar trace that was deleted
     * @private
     */
    onDelete(progressBarTrace) {
        const index = this.reader.items.get().findIndex((trace) => progressBarTrace.get("uid") === trace.get("uid"));
        if (index !== -1) {
            this.reader.items.splice(index, 1);
        }
        this.reader.reload();
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
