// This file is released under the Apache 2.0 License. See
// https://opensource.org/licenses/Apache-2.0 for full details. Copyright 2021
// Jacob D. Durrant.

import { IResidueInfo } from '../Common/Interfaces';
import { deepCopy } from '../Common/Utils';
import { filterResidues } from './PDBUtils';

/** An object containing the vue-component methods functions. */
export let proteinProcessingMethodsFunctions = {
    "filterResidues": filterResidues,
    // "extractResidues": extractResidues,
    "onExtractAtoms"(residueInfo: IResidueInfo): void {
        this.$emit("onExtractAtoms", residueInfo);
    },
    "deleteAllNonProteinResidues"(removeResiduesHtml) {
        let pdbTxt = this["value"][this["selectedFilename"]];
        let deletedAtomsTxt: string;

        for (let removeResidueHtml of removeResiduesHtml) {
            [pdbTxt, deletedAtomsTxt] = this["filterResidues"](
                pdbTxt,
                removeResidueHtml[0], removeResidueHtml[1], removeResidueHtml[2]
            );
        }
        
        let files = deepCopy(this["value"]);
        files[this["selectedFilename"]] = pdbTxt
        this.$emit("input", files);
    }
};
