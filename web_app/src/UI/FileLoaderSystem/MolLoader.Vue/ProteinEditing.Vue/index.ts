// This file is released under the Apache 2.0 License. See
// https://opensource.org/licenses/Apache-2.0 for full details. Copyright 2022
// Jacob D. Durrant.

import { commonProteinEditingProps } from "../../Common/CommonProps.VueFuncs";
import { addCSS } from "../../Common/Utils";
import { computedFunctions } from "./Computeds.VueFuncs";
import { proteinProcessingMethodsFunctions as proteinProcessingMethodsFunctions } from "./Methods.VueFuncs";

declare var Vue;

/**
 * The vue-component mounted function.
 * @returns void
 */
function mountedFunction(): void {
    this["editAction"] = (this["allowAtomDelete"]) ? "delete" : "extract";
    addCSS("#select-action-btns .btn { padding:0; line-height:1.4; }")
}

/**
 * Setup the protein-editing Vue commponent.
 * @returns void
 */
export function setupProteinEditing(): void {
    Vue.component("protein-editing", {
        /**
         * Get the data associated with this component.
         * @returns any  The data.
         */
        "data"(): any {
            return {
                "localValue": {}, // Watching value (so bound)
                "editAction": "delete",
                "editActions": [
                    { html: '&#10006;&nbsp; Delete', value: 'delete' },
                    { html: '<span style="display:inline-block; transform: scaleX(-1);">&#10138; </span>&nbsp; Extract', value: 'extract' },
                ]
            };
        },
        "watch": {
            /**
             * Update localValue based on the changed value.
             * @param {string} newValue  The new value of the property.
             * @param {string} oldValue  The previous value of the property.
             */
            "value"(newValue: string, oldValue: string): void {
                this["localValue"] = newValue;
            },

            /**
             * When the localValue property changes, emit the input event with the new value.
             * @param {string} newValue  The new value of the input.
             * @param {string} oldValue  The previous value of the input.
             */
            "localValue"(newValue: string, oldValue: string): void {
                this.$emit("input", newValue);
            }
        },
        "methods": proteinProcessingMethodsFunctions,
        "template": /*html*/ `
            <span v-if="(removeResiduesSelections.length > 0) && (allowAtomExtract || allowAtomDelete)">
                <b-alert class="mt-2 mb-0" show variant="warning">
                    <b-form-group v-if="allowAtomExtract && allowAtomDelete">
                        <!-- :aria-describedby="ariaDescribedby" -->
                        <b-form-radio-group
                            class="d-flex flex-wrap"
                            style="margin-bottom:-12px; padding:0px;"
                            id="select-action-btns"
                            v-model="editAction"
                            :options="editActions"
                            name="select-action-btns"
                            buttons
                            size="sm"
                            button-variant="outline-secondary"
                        ></b-form-radio-group>
                    </b-form-group>
                    <span v-else>
                        <span v-if="allowAtomDelete">Delete:</span>
                        <span v-if="allowAtomExtract">Extract:</span>
                    </span>
                    <small-pill-btn 
                        v-if="keepNonProteinResidueSelections(removeResiduesSelections).length > 0"
                        :actionStyling="editAction" 
                        @click="deleteAllNonProteinResidues(removeResiduesSelections)">
                        All Non-Protein
                    </small-pill-btn><small-pill-btn v-if="hasHydrogens && editAction === 'delete'" :actionStyling="editAction" @click="deleteHydrogens()">
                        Hydrogens
                    </small-pill-btn><small-pill-btn 
                        :actionStyling="editAction"
                        v-for="result, i of removeResiduesSelections" 
                        :key="i"
                        @click="deleteOrExtractResidues(result)"
                    >{{selDesc(result)}}</small-pill-btn>
                </b-alert>
            </span>
        `,
        "props": {
            "selectedFilename": {
                "type": String,
                "default": ""
            },
            
            // for v-model
            "value": {
                "type": Object,
                "default": {}
            },
            ...commonProteinEditingProps
        },
        "computed": computedFunctions,

        /**
         * Runs when the vue component is mounted.
         * @returns void
         */
        "mounted": mountedFunction,
    });
}
