// Released under the Apache 2.0 License. See LICENSE.md or go to
// https://opensource.org/licenses/Apache-2.0 for full details. Copyright 2022
// Jacob D. Durrant.

import { getBasename, getExt, getFileTypeFromExt } from "../Common/Utils";
import { ParentMol } from "./ParentMol";
import { PDBMol } from "./PDBMol";

/**
 * Given a filename and its contents, return a ParentMol object (or something
 * that extends it).
 * @param {string}  filename              The name of the file to read.
 * @param {*}       fileContents          The contents of the file. If an
 *                                        object, will be loaded as raw data.
 *                                        Otherwise, a string that is parsed.
 * @param {boolean} [mseToMet=true]       If true, convert MSE residues to MET.
 * @param {boolean} [removeAltLocs=true]  If true, remove all alternate
 *                                        locations.
 * @returns A ParentMol object (or an object that extends it).
 */
export function getMol(filename: string, fileContents: any, mseToMet = true, removeAltLocs = true): ParentMol {
    let ext = getExt(filename);

    let fileType = getFileTypeFromExt(
        ext, 
        ["pdb", "pdbqt", "ent", "brk"]
    );

    switch (fileType) {
        case "pdb":
            return new PDBMol(fileContents, mseToMet, removeAltLocs);
        case "pdbqt":
            return new PDBMol(fileContents, mseToMet, removeAltLocs);
        case "ent":
            return new PDBMol(fileContents, mseToMet, removeAltLocs);
        case "brk":
            // Acceptable extension for PDB file per
            // https://en.wikipedia.org/wiki/Protein_Data_Bank_(file_format)
            return new PDBMol(fileContents, mseToMet, removeAltLocs);
        default:
            // In absense of other information, assume PDB.
            return new PDBMol(fileContents, mseToMet, removeAltLocs);
    }
}