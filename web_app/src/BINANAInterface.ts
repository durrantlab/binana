// This file is part of BINANA, released under the Apache 2.0 License. See
// LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
// details. Copyright 2020 Jacob D. Durrant.

import * as ThreeDMol from "./UI/ThreeDMol";
import { store, defaultColorMsg } from "./Vue/Store";

let viewer;
let receptorMol;
let mol;
let binanaData;

// A single atom may participate in multiple interactions with other
// atoms. Make sure each atom is rendered in the viewer only once.
let idxOfAtomsSeen;

/**
 * Sets up the interface, brining several variables into the module's scope.
 * @param  {*} view   The 3Dmoljs viewer.
 * @param  {*} recep  The 3Dmoljs receptor molecule object.
 * @param  {*} lig    The 3Dmoljs ligand molecule object.
 */
export function setup(view: any, recep: any, lig: any) {
    viewer = view;
    receptorMol = recep;
    mol = lig;
}

/**
 * Starts BINANA.
 * @param  {string} pdbtxt  The text of the receptor.
 * @param  {string} ligtxt  The text of the ligand.
 * @returns void
 */
export function start(pdbtxt: string, ligtxt: string): void {
    let binana = window["binanaModule"];

    // Save to the fake file system
    binana["save_to_fake_fs"]("receptor.pdb", pdbtxt);
    binana["save_to_fake_fs"]("ligand.pdb", ligtxt);

    let params = ["-receptor", "receptor.pdb", "-ligand", "ligand.pdb"];

    let binanaParams = store.state["binanaParams"];
    const binanaParamNames = Object.keys(binanaParams);
    const binanaParamNamesLen = binanaParamNames.length;
    for (let i = 0; i < binanaParamNamesLen; i++) {
        const binanaParamName = binanaParamNames[i];
        const paramVal = binanaParams[binanaParamName];
        params.push("-" + binanaParamName);
        params.push(paramVal);
    }

    // Run binana
    binana["run"](params);

    // Get the json output.
    let json = binana["load_from_fake_fs"]("./ligand_receptor_output.json");

    binanaData = json;

    // highlight(1);
}

/**
 * Highlights the specified interaction in the viewer. Sets the atoms involved
 * in the interaction to a different color.
 * @param  {string} interactionName  The name of the interaction.
 * @returns void
 */
export function highlight(interactionName: string): void {
    clearInteraction();

    // make an array for the interactions
    let interactionType = binanaData[interactionName];

    // A single atom may participate in multiple interactions with other
    // atoms. Make sure each atom is rendered in the viewer only once.
    idxOfAtomsSeen = new Set([]);
    let ligAtomInfs = [];
    let recAtomInfs = [];

    let colorMsg = defaultColorMsg;

    // loop through the interactions
    for (let i = 0; i < interactionType.length; i++) {
        let ligandAtomInfs = interactionType[i]["ligandAtoms"];
        let receptorAtomInfs = interactionType[i]["receptorAtoms"];

        // Start by assuming color by molecule.
        let ligColor = "yellow";
        let recepColor = "red";
        colorMsg = "Ligand atoms are highlighted in yellow, and receptor atoms are highlighted in red.";

        if (store["state"]["colorByInteraction"]) {
            // Instead color by interaction.
            switch (interactionName) {
                case "hydrogenBonds":
                    if (ligandAtomInfs.length == 2) {
                        ligColor = "yellow";
                        recepColor = "red";
                    } else {
                        ligColor = "red";
                        recepColor = "yellow";
                    }
                    colorMsg = "Hydrogen-bond donors are highlighted in yellow, and hydrogen-bond acceptors are highlighted in red.";
                    break;
                case "saltBridges":
                    if (["LYS", "ARG", "HIS", "ARN", "HIP"].indexOf(receptorAtomInfs[0]["resName"]) !== -1) {
                        // Protein residue is positive.
                        recepColor = "blue";
                        ligColor = "red";
                    } else {
                        // Protein residue is negative.
                        recepColor = "red";
                        ligColor = "blue";
                    }
                    colorMsg = "Positively charged groups are highlighted in blue, and negatively charged groups are highlighted in red.";
                    break;
            }
        }

        store.commit("setVar", {
            name: "colorMessage",
            val: colorMsg
        });

        ligAtomInfs = ligAtomInfs.concat(getAtomObjRadiusColor(mol, ligandAtomInfs, ligColor));
        recAtomInfs = recAtomInfs.concat(getAtomObjRadiusColor(receptorMol, receptorAtomInfs, recepColor));
    }

    // Add spheres
    drawSpheres(ligAtomInfs.concat(recAtomInfs));

    // Render sticks of protein model too.
    ThreeDMol.showSticksAsAppropriate();
    receptorMol["setStyle"](
        {
            "index": recAtomInfs.map(
                i => i[0]["index"]
            ),
            "byres": true
        },
        {
            "stick": { "radius": 0.1 },  // 0.15
            "cartoon": { "color": 'spectrum' },
        }
    );

    viewer["render"]();
}

/**
 * Draws interaction spheres in the 3Dmoljs viewer.
 * @param  {*} atomInfs  Information about the atoms.
 * @returns void
 */
function drawSpheres(atomInfs: any[]): void {
    const coorsLen = atomInfs.length;
    for (let i = 0; i < coorsLen; i++) {
        const atomInf = atomInfs[i];
        const atom = atomInf[0];
        viewer["addSphere"]({
            "center": {"x": atom["x"], "y": atom["y"], "z": atom["z"]},
            "radius": 0.6 * atomInf[1],   // scale down vdw radius a bit.
            "color": atomInf[2],
            "opacity": 0.8
        });
    }
}

// See https://en.wikipedia.org/wiki/Atomic_radii_of_the_elements_(data_page)
let vdwRadii = {
    "H": 1.20,
    "He": 1.40,
    "Li": 1.82,
    "Be": 1.53,
    "B": 1.92,
    "C": 1.70,
    "N": 1.55,
    "O": 1.52,
    "F": 1.47,
    "Ne": 1.54,
    "Na": 2.27,
    "Mg": 1.73,
    "Al": 1.84,
    "Si": 2.10,
    "P": 1.80,
    "S": 1.80,
    "Cl": 1.75,
    "Ar": 1.88,
    "K": 2.75,
    "Ca": 2.31,
    "Sc": 2.11,
    "Ni": 1.63,
    "Cu": 1.40,
    "Zn": 1.39,
    "Ga": 1.87,
    "Ge": 2.11,
    "As": 1.85,
    "Se": 1.90,
    "Br": 1.85,
    "Kr": 8.8,
    "Rb": 3.03,
    "Sr": 2.49,
    "Pd": 1.63,
    "Ag": 1.72,
    "Cd": 1.58,
    "In": 1.93,
    "Sn": 2.17,
    "Sb": 2.06,
    "Te": 2.06,
    "I": 1.98,
    "Xe": 1.08,
    "Cs": 3.43,
    "Ba": 2.68,
    "Pr": 1.0,
    "Nd": 2.0,
    "Pt": 1.75,
    "Au": 1.66,
    "Hg": 1.55,
    "Tl": 1.96,
    "Pb": 2.02,
    "Bi": 2.07,
    "Po": 1.97,
    "At": 1.27,
    "Rn": 1.20
}

/**
 * Gets the info about the atoms.
 * @param  {*} mol         The molecule with the atoms.
 * @param  {*} atomInfs    The atom information.
 * @param  {string} color  The highlighting color to use.
 * @returns *  A list of atom data ([atom,radius,color], [atom,radius,color],
 *             ...)
 */
function getAtomObjRadiusColor(mol: any, atomInfs: any, color: string): any[] {
    // Keep track of ligand and receptor coordinates where spheres should be
    // added.
    let atomObjsRadiiColors = [];

    for (let j = 0; j < atomInfs.length; j++) {
        // change the color for the atom
        let atomInf = atomInfs[j];
        if (idxOfAtomsSeen.has(atomInf["atomIndex"])) {
            continue;
        }
        idxOfAtomsSeen.add(atomInf["atomIndex"]);
        let atom = mol["selectedAtoms"]({
            "atom": atomInf["atomName"],
            "serial": atomInf["atomIndex"],
            "resi": atomInf["resID"]
        })[0];  //  Should be only one such atom.

        let radius = vdwRadii[atom["elem"]];
        radius = radius === undefined ? 1.5 : radius;

        atomObjsRadiiColors.push([atom, radius, color])
    }

    return atomObjsRadiiColors;
}

/**
 * Clears the previous interactions displayed in the 3Dmoljs viewer.
 * @returns void
 */
export function clearInteraction(): void {
    // receptorMol["setStyle"]({},{"stick": {"color": 'red'}});
    // mol["setStyle"]({}, {"sphere": {"color": 'green'}});

    store.commit("setVar", {
        name: "colorMessage",
        val: defaultColorMsg
    });

    ThreeDMol.showSticksAsAppropriate();

    viewer["removeAllShapes"]();
    viewer["render"]();
}
