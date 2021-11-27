// This file is released under the Apache 2.0 License. See
// https://opensource.org/licenses/Apache-2.0 for full details. Copyright 2021
// Jacob D. Durrant.

import { deepCopy } from "../Common/Utils";
import { deleteResidues, extractResidues, getAtomLines, getPDBLineInfo } from "./PDBUtils";

declare var Vue;

/**
 * Setup the protein-processing-delete-extract Vue commponent.
 * @returns void
 */
export function setupProteinProcessingDeleteExtract(): void {
    Vue.component("protein-processing-delete-extract", {
        /**
         * Get the data associated with this component.
         * @returns any  The data.
         */
        "data"(): any {
            return {};
        },
        "methods": {
            "deleteResidues": deleteResidues,        
            "extractResidues": extractResidues
        },
        "template": /*html*/ `
            <span>
                (<b-link 
                    v-if="allowDeleteHeteroAtoms"
                    href="#" 
                    @click="deleteResidues(residueToRemove[0], residueToRemove[1], residueToRemove[2])"
                >delete</b-link><span 
                    v-if="allowDeleteHeteroAtoms && allowExtractHeteroAtoms"
                >/</span><b-link 
                    v-if="allowExtractHeteroAtoms"
                    href="#" 
                    @click="extractResidues(residueToRemove[0], residueToRemove[1], residueToRemove[2])"
                >extract</b-link>)</span>`,
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

            "residueToRemove": {
                "type": Array,
                "default": []
            },

            "allowDeleteHeteroAtoms": {
                "type": Boolean,
                "default": false
            },
            
            "allowExtractHeteroAtoms": {
                "type": Boolean,
                "default": false
            },
        },
        "computed": {},

        /**
         * Runs when the vue component is mounted.
         * @returns void
         */
        "mounted": () => {},
    });
}
