// This file is released under the Apache 2.0 License. See
// https://opensource.org/licenses/Apache-2.0 for full details. Copyright 2022
// Jacob D. Durrant.

import { commonQueueProps } from "../../Common/CommonProps.VueFuncs";
import { endQueueAndDownloadFilesIfAvailable, numLeftInQueue } from "../LocalForageWrapper";

declare var Vue;

/** An object containing the vue-component computed functions. */
let computedFunctions = {};

/**
 * The vue-component mounted function.
 * @returns void
 */
function mountedFunction(): void {}

/**
 * Setup the file-list Vue commponent.
 * @returns void
 */
export function setupQueueCatcher(): void {
    Vue.component("queue-catcher", {
        /**
         * Get the data associated with this component.
         * @returns any  The data.
         */
        "data"(): any {
            return {
                "numItemsInQueue": -1,
                "active": false
            };
        },
        "watch": {
            /**
             * Useful for triggering the queue catcher externally. Just change
             * the `trigger` prop to anything new.
             * @param {boolean} newVal  The new value.
             * @param {boolean} oldVal  The old value.
             */
            "trigger"(newVal: boolean, oldVal: boolean) {
                this["beforeQueueNextItemFunc"]()
                .then(() => {
                    return numLeftInQueue(this["molLoaderIds"])
                })
                .then((numItems: number) => {
                    this["numItemsInQueue"] = numItems;
                    if (numItems === 0) {
                        // There are no entries left in the queue. Download them.
                        endQueueAndDownloadFilesIfAvailable(this["outputZipFilename"])
                        .then(() => {
                            this["active"] = false;
                        });
                    } else {            
                        // There are entries left in the queue. So make the count-down
                        // visible.
                        this["active"] = true;
                    }
                });
            }
        },
        "methods": {
            /**
             * Emit the onQueueNextItem event.
             */
            "onProceed"(): void {
                this.$emit("onQueueNextItem");
            }
        },
        "template": /*html*/ `
            <queue-timer
                v-if="active"
                :countDownSeconds="countDownSeconds"
                :numItemsInQueue="numItemsInQueue"
                @onProceed="onProceed"
            ></queue-timer>
        `,
        "props": {
            // "trigger" is a property that must be explicitly set to true
            // (after saving necessary files to localforage, for example) to
            // either (1) start the countdown for next queue item, or (2)
            // download the files if queue is now empty.
            ...commonQueueProps,

            "beforeQueueNextItemFunc": {
                "type": Function,
                "default": () => { return Promise.resolve(); }
            }
        },
        "computed": computedFunctions,

        /**
         * Runs when the vue component is mounted.
         * @returns void
         */
        "mounted": mountedFunction,
    });
}
