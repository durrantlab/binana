// Released under the Apache 2.0 License. See LICENSE.md or go to
// https://opensource.org/licenses/Apache-2.0 for full details. Copyright 2022
// Jacob D. Durrant.

import { ISelection, ParentMol } from "../../Mols/ParentMol";

/** An object containing the vue-component computed functions. */
export let computedFunctions = {
    /**
     * Return the current molecule.
     * @returns {ParentMol}  The current molecule.
     */
    currentMol(): ParentMol {
        return this["value"][this["selectedFilename"]];
    },

    /**
     * Returns a list of the chains in the current molecule
     * @returns {string[]}  A list of the chains in the current molecule.
     */
    chainsList(): string[] {
        let pdb: ParentMol = this.currentMol;
        if (pdb === undefined) { return []; }
        return pdb.getChains();
    },

    /**
     * Returns true if the current molecule has hydrogens.
     * @returns {boolean}  A boolean value.
     */
    hasHydrogens(): boolean {
        let pdb: ParentMol = this.currentMol;
        if (pdb === undefined) { return false; }
        return pdb.hasHydrogens();
    },

    /**
     * It returns a dictionary describing residues in the molecule that do not
     * belong to the protein.
     * @returns {*}  The data is being returned as a dictionary. The keys are
     *               the residue names.
     */
    nonProteinResiduesData(): any {
        let pdb: ParentMol = this.currentMol;

        if (pdb === undefined) {
            return {};
        }

        // Make sets for each residue name
        let data = {};
        let nonProteinMol = pdb.getNonProteinMol();
        for (let frame of nonProteinMol.frames) {
            for (let atom of frame.atoms) {
                data[atom.resn] = new Set([]);
            }
        }

        // Add specific keys to those sets
        for (let frame of nonProteinMol.frames) {
            for (let atom of frame.atoms) {
                let key = atom.resn;
                key += ":" + atom.resi;
                key += ":" + atom.chain;
                data[atom.resn].add(key);
            }
        }

        return data;
    },

    /**
     * Gets information about residue selections that can be removed.
     * @returns {string[][]}  A list of selections.
     */
    "removeResiduesSelections"(): string[][] {
        let nonProtData = this.nonProteinResiduesData;
        let chainsList = this.chainsList;

        let resnames = Object.keys(nonProtData);
        resnames.sort();

        let results1 = [];
        let results2 = [];
        
        for (let resname of resnames) {
            if (nonProtData[resname].size > 10) {
                // If more than ten residues, consider it a single thing. Like
                // "waters."
                results1.push({
                    "resnames": [resname],
                    "nonProtein": true
                } as ISelection);
            } else {
                // If less than ten, treat as separate things (multiple copies
                // of ligand).
                let singles = []
                nonProtData[resname].forEach(key => {
                    singles.push(key);
                });
                singles.sort((a, b) => {
                    if(a["resname"] < b["resname"]) { return -1; }
                    if(a["resname"] > b["resname"]) { return 1; }
                    return 0;
                });
                for (let single of singles) {
                    // html += "Single: " + single + ". ";
                    let prts = single.split(":");
                    results2.push({
                        "resnames": [prts[0]],
                        "resids": [prts[1]],
                        "chains": [prts[2]],
                        "nonProtein": true
                    } as ISelection);
                }
            }
        }

        let results3 = [];
        if (chainsList.length > 1) {
            for (let chain of chainsList) {
                results3.push({
                    "chains": [chain],
                    "nonProtein": false
                } as ISelection)
            }
        }

        let toReturn = [...results1, ...results2, ...results3];

        return toReturn;
    },
};