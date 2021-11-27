// This file is released under the Apache 2.0 License. See
// https://opensource.org/licenses/Apache-2.0 for full details. Copyright 2021
// Jacob D. Durrant.

import { proteinProcessingMethodsFunctions as proteinProcessingMethodsFunctions } from "./Methods.VueFuncs";
import { getAtomLines, getPDBLineInfo } from "./PDBUtils";

declare var Vue;


export let proteinResnames = [
    "ALA",
    "ARG",
    "ASN",
    "ASP",
    "ASH",
    "ASX",
    "CYS",
    "CYM",
    "CYX",
    "GLN",
    "GLU",
    "GLH",
    "GLX",
    "GLY",
    "HIS",
    "HID",
    "HIE",
    "HIP",
    "ILE",
    "LEU",
    "LYS",
    "LYN",
    "MET",
    "MSE",
    "PHE",
    "PRO",
    "SER",
    "THR",
    "TRP",
    "TYR",
    "VAL",
]

/** An object containing the vue-component computed functions. */
let computedFunctions = {
    currentPDB(): string {
        return this["value"][this["selectedFilename"]];
    },
    
    nonProteinResiduesData(): any {
        let pdbTxt: string = this.currentPDB;

        if (pdbTxt === undefined) {
            return {};
        }

        let pdbLines = getAtomLines(pdbTxt);

        let data = {};
        let resname: string;
        let resid: string;
        let chain: string;
        for (let l of pdbLines) {
            // let resname = l.slice(17,20).trim();
            // let resid = l.slice(22,26).trim();
            // let chain = l.slice(21,22).trim();
            [resname, resid, chain] = getPDBLineInfo(l);
            let key = resname;
            key += ":" + resid;
            key += ":" + chain;
            if (proteinResnames.indexOf(resname) === -1) {
                if (!data[resname]) {
                    data[resname] = new Set([]);
                }
                data[resname].add(key);
            }
        }

        return data;
    },

    "removeResiduesHtml"(): string[][] {
        let data = this.nonProteinResiduesData;

        let resnames = Object.keys(data);
        resnames.sort();

        let results1 = [];
        let results2 = [];
        
        for (let resname of resnames) {
            if (data[resname].size > 10) {
                // If more than ten residues, consider it a single thing. Like
                // "waters."
                results1.push([resname]);
                // html += "Group: " + resname + ". ";
            } else {
                // If less than ten, treat as separate things (multiple copies
                // of ligand).
                let singles = []
                data[resname].forEach(key => {
                    singles.push(key);
                });
                singles.sort();
                for (let single of singles) {
                    // html += "Single: " + single + ". ";
                    results2.push(single.split(":"));
                }
            }
        }
        return [...results1, ...results2];
    },

    deleteExtractDescription(): string {
        if (this["allowDeleteHeteroAtoms"] && this["allowExtractHeteroAtoms"]) {
            return "Alternatively, delete individual residues or extract them as ligands";
        }
        if (this["allowDeleteHeteroAtoms"]) {
            return "Alternatively, delete individual residues";
        }
        return "Alternatively, extract individual residues as ligands";
    }
};

/**
 * The vue-component mounted function.
 * @returns void
 */
function mountedFunction(): void {}

/**
 * Setup the protein-processing Vue commponent.
 * @returns void
 */
export function setupProteinProcessing(): void {
    Vue.component("protein-processing", {
        /**
         * Get the data associated with this component.
         * @returns any  The data.
         */
        "data"(): any {
            return {
                "localValue": {}
            };
        },
        "watch": {
            "value"(newValue: string, oldValue: string): void {
                this["localValue"] = newValue;
                // this.$emit("input", newValue);
            },
            "localValue"(newValue: string, oldValue: string): void {
                this.$emit("input", newValue);
            }
        },
        "methods": proteinProcessingMethodsFunctions,
        "template": /*html*/ `
            <span v-if="removeResiduesHtml.length > 0 && (allowDeleteHeteroAtoms || allowExtractHeteroAtoms)">
                <b-alert class="mt-2 mb-0" show variant="warning">
                    The file "{{selectedFilename}}" includes one or more non-protein
                    residue(s). You can <b-link href="#" @click="deleteAllNonProteinResidues(removeResiduesHtml)">delete these residues</b-link>
                    or leave the file unchanged. {{deleteExtractDescription}}:
                    <span v-for="result, i of removeResiduesHtml">
                        ({{i+1}})
                        <span v-if="result.length===3">
                            {{result.join(":")}}
                            <protein-processing-delete-extract
                                v-model="localValue"
                                :selectedFilename="selectedFilename"
                                :residueToRemove="result"
                                :allowDeleteHeteroAtoms="allowDeleteHeteroAtoms"
                                :allowExtractHeteroAtoms="allowExtractHeteroAtoms"
                                @onExtractAtoms="onExtractAtoms"
                            ></protein-processing-delete-extract>.
                        </span>
                        <span v-else>
                            {{result[0]}}
                            <protein-processing-delete-extract
                                v-model="localValue"
                                :selectedFilename="selectedFilename"
                                :residueToRemove="result"
                                :allowDeleteHeteroAtoms="allowDeleteHeteroAtoms"
                                :allowExtractHeteroAtoms="allowExtractHeteroAtoms"
                                @onExtractAtoms="onExtractAtoms"
                            ></protein-processing-delete-extract>.
                        </span>
                    </span>
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

            "allowDeleteHeteroAtoms": {
                "type": Boolean,
                "default": false
            },
            
            "allowExtractHeteroAtoms": {
                "type": Boolean,
                "default": false
            },
        },
        "computed": computedFunctions,

        /**
         * Runs when the vue component is mounted.
         * @returns void
         */
        "mounted": mountedFunction,
    });
}
