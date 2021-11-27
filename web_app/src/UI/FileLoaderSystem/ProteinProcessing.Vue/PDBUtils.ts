// This file is released under the Apache 2.0 License. See
// https://opensource.org/licenses/Apache-2.0 for full details. Copyright 2021
// Jacob D. Durrant.

import { IResidueInfo } from "../Common/Interfaces";
import { deepCopy } from "../Common/Utils";

export function getPDBLineInfo(pdbLine: string): string[] {
    let resname = pdbLine.slice(17,20).trim();
    let resid = pdbLine.slice(22,26).trim();
    let chain = pdbLine.slice(21,22).trim();
    return [
        resname,
        resid,
        chain,
    ]
}

export function getAtomLines(pdbText: string): string [] {
    let pdbLines = pdbText.split("\n");
    pdbLines = pdbLines.filter((l) => {
        return l.slice(0, 4) === "ATOM" || l.slice(0, 6) === "HETATM";
    });
    return pdbLines;
}

export function filterResidues(pdbTxt: string, resname: string, resid: string, chain: string): string[] {
    let pdbLines = getAtomLines(pdbTxt);
    let tmpResname: string;
    let tmpResid: string;
    let tmpChain: string;

    let deletedAtoms = [];
    
    let delFilter: Function;
    if (!resid) {
        // Just by residue name
        delFilter = (pdbLine: string) => {
            [tmpResname, tmpResid, tmpChain] = getPDBLineInfo(pdbLine);
            if (resname === tmpResname) {
                deletedAtoms.push(pdbLine);
                return false;
            }
            return true;
        }
    } else {
        // More specific than just residue name.
        delFilter = (pdbLine: string) => {
            [tmpResname, tmpResid, tmpChain] = getPDBLineInfo(pdbLine);
            if ((resname === tmpResname) && (resid === tmpResid) && (chain === tmpChain)) {
                deletedAtoms.push(pdbLine);
                return false;
            }
            return true;
        }
    }

    pdbLines = pdbLines.filter(l => delFilter(l));
    let pdbText = pdbLines.join("\n");

    let deletedAtomsTxt = deletedAtoms.join("\n");

    return [pdbText, deletedAtomsTxt];
}

// Must be called in context of vue component
export function deleteResidues(resname: string, resid?: string, chain?: string): string {
    let pdbTxt: string;
    let deletedAtomsTxt: string;
    [pdbTxt, deletedAtomsTxt] = filterResidues(
        this["value"][this["selectedFilename"]],
        resname, resid, chain
    );

    let files = deepCopy(this["value"]);
    files[this["selectedFilename"]] = pdbTxt
    this.$emit("input", files);

    return deletedAtomsTxt;
}

// Must be called in context of vue component
export function extractResidues(resname: string, resid?: string, chain?: string): void {
    let deletedLines = this["deleteResidues"](resname, resid, chain);
    this.$emit("onExtractAtoms", {
        residueId: [resname, resid, chain],
        residuePdbLines: deletedLines
    } as IResidueInfo);
}