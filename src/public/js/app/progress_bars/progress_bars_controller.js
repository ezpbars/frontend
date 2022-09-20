import { ProgressBarFilterController } from "/js/app/progress_bars/progress_bar_filter_controller.js";
import { ProgressBarReader } from "/js/app/progress_bars/progress_bar_reader.js";
import { ProgressBarView } from "/js/app/progress_bars/progress_bar_view.js";
import { CreateProgressBarFormController } from "/js/app/progress_bars/steps/create_progress_bar_form_controller.js";
import { Listing } from "/js/app/resources/listing.js";
import { PageableItems } from "/js/app/resources/pageable_items.js";
import { simpleArrayListener } from "/js/lib/replica_listener.js";

export class ProgressBarsController {
    constructor() {
        /**
         * the element this view is attached to
         * @type {Element}
         * @readonly
         */
        this.element = document.createElement("div");
        /**
         * the object responsible for fetching progress bars form the api
         * @type {ProgressBarReader}
         * @readonly
         */
        this.reader = new ProgressBarReader();
        /**
         * the view for the items
         * @type {PageableItems.<ProgressBarView>}
         * @readonly
         */
        this.itemsView = new PageableItems({ onMore: this.reader.loadNext.bind(this.reader) });
        this.reader.items.addArrayListenerAndInvoke(simpleArrayListener({
            insert: (index, progressBar) => {
                const replica = progressBar.createReplica();
                this.itemsView.items.items.splice(index, 0, new ProgressBarView(replica, this.onDelete.bind(this, replica)));
            },
            remove: (index) => {
                this.itemsView.items.items.splice(index, 1)[0].progressBar.detach();
            }
        }));
        this.reader.hasNextPage.addListenerAndInvoke((hasNext) => {
            this.itemsView.hasMore.value = hasNext;
        });
        /**
         * the form to create new items
         * @type {CreateProgressBarFormController}
         * @readonly
         */
        this.createProgressBarForm = new CreateProgressBarFormController((progressBar) => {
            this.reader.items.push(progressBar);
        });
        /**
         * the view for changing the filters and sort
         */
        this.filterController = new ProgressBarFilterController(this.reader.filters.value, this.reader.sort.value);
        this.filterController.filters.addListener((filters) => {
            this.reader.filters.value = filters;
        });
        this.filterController.sort.addListener((sort) => {
            this.reader.sort.value = sort;
        });
        this.render();
    }
    /**
     * called after a progress bar is deleted
     * @param {import("/js/app/progress_bars/progress_bar.js").ProgressBar} progressBar the progress bar which was deleted
     * @private
     */
    onDelete(progressBar) {
        const index = this.reader.items.get().findIndex((pb) => progressBar.get("uid") === pb.get("uid"));
        if (index !== -1) {
            this.reader.items.splice(index, 1);
        }
    }
    /**
     * adds the appropriate contents to the element for thsi view. Should
     * only be called once
     * @private
     */
    render() {
        this.element.appendChild(new Listing(this.itemsView, this.createProgressBarForm, this.filterController).element);
    }
}
