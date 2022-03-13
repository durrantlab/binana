// This file is released under the Apache 2.0 License. See
// https://opensource.org/licenses/Apache-2.0 for full details. Copyright 2022
// Jacob D. Durrant.

import { commonQueueProps } from "../../Common/CommonProps.VueFuncs";
import { IFileInfo } from "../../Common/Interfaces";
import { getMol } from "../../Mols";
import { endQueueAndDownloadFilesIfAvailable, popQueue, numLeftInQueue, saveOutputToLocalForage } from "../LocalForageWrapper";

declare var Vue;

/** An object containing the vue-component computed functions. */
let computedFunctions = {};

/**
 * The vue-component mounted function.
 * @returns void
 */
function mountedFunction(): void {
    numLeftInQueue(this["molLoaderIds"])
    .then((numItems: number) => {
        this["numItemsInQueue"] = numItems;
        if (numItems === 0) {
            // Either the queue is empty or there was an error. Either way,
            // download files if they are available.
            endQueueAndDownloadFilesIfAvailable(this["outputZipFilename"]);
        } else {
            // There are entries you can use.
            this["active"] = true;
        }
    });
}

/**
 * Setup the queue-controller Vue commponent.
 * @returns void
 */
export function setupQueueController(): void {
    Vue.component("queue-controller", {
        /**
         * Get the data associated with this component.
         * @returns any  The data.
         */
        "data"(): any {
            return {
                "active": false,
                "numItemsInQueue": -1
            };
        },
        "watch": {
            /**
             * Useful for triggering the queue controller externally. Just
             * change the `trigger` prop to anything new.
             * @param {boolean} newVal  The new value.
             * @param {boolean} oldVal  The old value.
             */
             "trigger"(newVal: boolean, oldVal: boolean) {
                this["onProceed"]();
            }
        },
        "methods": {
            /**
             * Pop the next file off the queue and emits it.
             */
            "onProceed"(): void {
                popQueue(this["molLoaderIds"])
                .then((fileInfos: IFileInfo[]) => {
                    let files = {};
                    this["molLoaderIds"].forEach((id: string, idx: number) => {
                        let fileInfo = fileInfos[idx];
                        fileInfo.mol = getMol(fileInfo.filename, fileInfo.mol);
                        files[id] = fileInfo;
                    });
                    this.$emit("onQueueDelivery", files);
                });
            },

            /**
             * Ends the queue and downloads the files if available.
             */
            "onStop"(): void {
                endQueueAndDownloadFilesIfAvailable(this["outputZipFilename"]);
            }
        },
        "template": /*html*/ `
            <queue-timer
                v-if="active"
                :countDownSeconds="countDownSeconds"
                :numItemsInQueue="numItemsInQueue"
                @onProceed="onProceed"
                @onStop="onStop"
            >
            </queue-timer>
            <div v-else>
                <slot></slot>
            </div>
        `,
        "props": {
            // "trigger" is a property that must be explicitly set to true to
            // either (1) return the next item in the queue via
            // emit("onQueueDelivery"), or (2) download the files if queue is
            // now empty. Useful if you just loaded models into the file system
            // and you want to trigger first item in queue (via "Start Calc"
            // button, for example).
            ...commonQueueProps
        },
        "computed": computedFunctions,

        /**
         * Runs when the vue component is mounted.
         * @returns void
         */
        "mounted": mountedFunction,
    });
}
