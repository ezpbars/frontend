import { CreateProgressBarStepFormController } from "/js/app/progress_bars/steps/create_progress_bar_step_form_controller.js";
import { ProgressBarStepFiltersController } from "/js/app/progress_bars/steps/progress_bar_step_filters_controller.js";
import { ProgressBarStepReader } from "/js/app/progress_bars/steps/progress_bar_step_reader.js";
import { ProgressBarStepView } from "/js/app/progress_bars/steps/progress_bar_step_view.js";
import { Listing } from "/js/app/resources/listing.js";
import { PageableItems } from "/js/app/resources/pageable_items.js";
import { simpleArrayListener } from "/js/lib/replica_listener.js";

export class ProgressBarStepsController {
    constructor() {
        /**
         * the element this view is attached to
         * @type {Element}
         * @readonly
         */
        this.element = document.createElement("div");
        /**
         * the object responsible for fetching progress bar steps from the api
         * @type {ProgressBarStepReader}
         * @readonly
         */
        this.reader = new ProgressBarStepReader();
        /**
         * the view for the items
         * @type {PageableItems.<ProgressBarStepView>}
         * @readonly
         */
        this.itemsView = new PageableItems({ onMore: this.reader.loadNext.bind(this.reader) });
        this.reader.items.addArrayListenerAndInvoke(
            simpleArrayListener({
                insert: (index, progressBarStep) => {
                    const replica = progressBarStep.createReplica();
                    this.itemsView.items.items.splice(
                        index,
                        0,
                        new ProgressBarStepView(replica, this.onDelete.bind(this, replica))
                    );
                },
                remove: (index) => {
                    this.itemsView.items.items.splice(index, 1)[0].progressBarStep.detach();
                },
            })
        );
        this.reader.hasNextPage.addListenerAndInvoke((hasNext) => {
            this.itemsView.hasMore.value = hasNext;
        });
        /**
         * the form to create new items
         * @type {CreateProgressBarStepFormController}
         * @readonly
         */
        this.createProgressBarStepForm = new CreateProgressBarStepFormController((progressBarStep) => {
            this.reader.items.push(progressBarStep);
        });
        /**
         * the view for changing the filter and sort
         */
        this.filterController = new ProgressBarStepFiltersController(this.reader.filters.value, this.reader.sort.value);
        this.filterController.filters.addListener((filters) => {
            this.reader.filters.value = filters;
        });
        this.filterController.sort.addListener((sort) => {
            this.reader.sort.value = sort;
        });
        this.render();
    }
    /**
     * called after a progress bar step as been deleted
     * @param {import("/js/app/progress_bars/steps/progress_bar_step.js").ProgressBarStep} progressBarStep the progress bar step which was deleted
     * @private
     */
    onDelete(progressBarStep) {
        const index = this.reader.items.get().findIndex((step) => progressBarStep.get("uid") == step.get("uid"));
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
            new Listing(this.itemsView, this.createProgressBarStepForm, this.filterController).element
        );
    }
}
