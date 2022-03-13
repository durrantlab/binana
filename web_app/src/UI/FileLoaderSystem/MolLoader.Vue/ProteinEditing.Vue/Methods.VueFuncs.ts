// This file is released under the Apache 2.0 License. See
// https://opensource.org/licenses/Apache-2.0 for full details. Copyright 2022
// Jacob D. Durrant.

import { IExtractInfo, iSelectionToStr } from '../../Common/Interfaces';
import { ISelection } from '../../Mols/ParentMol';
import { deleteResidues, extractResidues } from './PDBUtils';

/** An object containing the vue-component methods functions. */
export let proteinProcessingMethodsFunctions = {
    /**
     * It emits an event to the parent component when the user extracts a
     * selection of atoms.
     * @param {IExtractInfo} residueInfo The information about the extracted
     *                                   atoms.
     */
    "onExtractAtoms"(residueInfo: IExtractInfo): void {
        this.$emit("onExtractAtoms", residueInfo);
    },

    /**
     * Given a list of residue selections, keep only those relevant to
     * non-protein residues.
     * @param {any[]} nonProteinResidueSelections
     * @returns {any[]}
     */
    "keepNonProteinResidueSelections"(nonProteinResidueSelections: any[]): any[] {
        return nonProteinResidueSelections.filter(r => r["nonProtein"] === true);
    },

    /**
     * Delete the non-protein selections.
     * @param {*} removeResiduesSelections All selections that can be removed
     *                                     (including ones not limited to
     *                                     non-protein residues).
     */
    "deleteAllNonProteinResidues"(removeResiduesSelections: any[]): void {
        // Keep only the non-protein selections.
        removeResiduesSelections = this["keepNonProteinResidueSelections"](removeResiduesSelections);

        let pdb = this["value"][this["selectedFilename"]];

        for (let removeResidueSel of removeResiduesSelections) {
            pdb = pdb.deleteSelection(removeResidueSel);
        }
        
        this.$set(this["value"], this["selectedFilename"], pdb);
        this.$emit("input", this["value"]);
    },
    
    /**
     * Delete all hydrogen atoms.
     */
    "deleteHydrogens"(): void {
        this["deleteOrExtractResidues"]({elems: ["H"]} as ISelection);
    },

    /**
     * If the editAction is "delete", delete the selected residues. Otherwise,
     * extract the selected residues
     * @param {ISelection} sel  The selected residues to act on.
     */
    "deleteOrExtractResidues"(sel: ISelection): void {
        if (this["editAction"] === "delete") {
            deleteResidues.bind(this)(sel);
        } else {
            extractResidues.bind(this)(sel);
        }
    },
    
    /**
     * Returns a string representation of the given selection
     * @param {ISelection} sel  The selection.
     * @returns The string representation of the selection.
     */
    "selDesc"(sel: ISelection): string {
        return iSelectionToStr(sel);
    }
};
