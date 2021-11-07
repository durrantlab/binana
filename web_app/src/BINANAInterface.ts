// This file is part of BINANA, released under the Apache 2.0 License. See
// LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
// details. Copyright 2020 Jacob D. Durrant.

import * as ThreeDMol from "./UI/ThreeDMol";
import { firstLetterCapital } from "./Utils";
import * as Store from "./Vue/Store";

declare var jQuery;

let viewer;
let receptorMol;
let ligandMol;
let binanaData;
let binanaFiles;

// A single atom may participate in multiple interactions with other atoms.
// Make sure each atom is rendered in the viewer only once.
let idxOfAtomsSeen;

interface ILegendItem {
    name: string;
    color: string;
    colorHex: string;
    representation: string;
    link: string
}

// See https://en.wikipedia.org/wiki/Web_colors
let interactionsInfo: {[key: string]: ILegendItem } = {
    "hydrogenBonds": {
        name: "Hydrogen bond",
        color: "BLACK",
        representation: "solid COLOR arrow from donor to acceptor",
        colorHex: "#000000",  // black
        link: "https://en.wikipedia.org/wiki/Hydrogen_bond"
    },
    "halogenBonds": {
        name: "Halogen bond",
        color: "GREEN",
        representation: "solid COLOR arrow from donor to acceptor",
        colorHex: "#00FF00",  // green
        link: "https://en.wikipedia.org/wiki/Halogen_bond"
    },
    "hydrophobicContacts": {
        name: "Hydrophobics",
        color: "GRAY",
        representation: "COLOR spheres",
        colorHex: "#808080",  // gray
        link: "https://en.wikipedia.org/wiki/Entropic_force#Hydrophobic_force"
    },
    "saltBridges": {
        name: "Salt bridge",
        color: "RED",
        representation: "COLOR dashed line",
        colorHex: "#FF0000",  //red
        link: "https://en.wikipedia.org/wiki/Salt_bridge_(protein_and_supramolecular)"
    },
    "closeContacts": {
        name: "Close contact",
        color: "PURPLE",
        representation: "COLOR spheres",
        colorHex: "#800080",  // purple
        link: "https://en.wikipedia.org/wiki/Steric_effects"
    },
    "closestContacts": {
        name: "Closest contact",
        color: "FUSCHA",
        representation: "COLOR spheres",
        colorHex: "#FF00FF",  // fuscha
        link: "https://en.wikipedia.org/wiki/Steric_effects"
    },
    "piPiStackingInteractions": {
        name: "π-π stacking",
        color: "BLUE",
        representation: "COLOR dashed line",
        colorHex: "#0000FF",  // blue
        link: "https://en.wikipedia.org/wiki/Pi-Stacking_(chemistry)"
    },
    "tStackingInteractions": {
        name: "T-stacking",
        color: "AQUA",
        representation: "COLOR dashed line",
        colorHex: "#00FFFF", // aqua
        link: "https://en.wikipedia.org/wiki/Pi-Stacking_(chemistry)"
    },
    "cationPiInteractions": {
        name: "Cation-π",
        color: "NAVY",
        representation: "COLOR dashed line",
        colorHex: "#000080",  // navy
        link: "https://en.wikipedia.org/wiki/Cation%E2%80%93pi_interaction"
    },
}

let sphereOnlyReps = ["hydrophobicContacts", "closeContacts", "closestContacts"];

// Certain representations must be represented after others. For example,
// closestContacts should be rendered after closeContacts so both with be
// visible. 
let renderOrder = [
    "hydrophobicContacts",
    "closeContacts",
    "closestContacts",

    // For below, order less important.
    "hydrogenBonds",
    "halogenBonds",
    "saltBridges",
    "piPiStackingInteractions",
    "tStackingInteractions",
    "cationPiInteractions",
]
interface IHighlightInfo {
    ligAtomInfs: any;
    recAtomInfs: any;
    interactionType: any[];
    interactionName: string;
}

/**
 * Sets up the interface, brining several variables into the module's scope.
 * @param  {*} view   The 3Dmoljs viewer.
 * @param  {*} recep  The 3Dmoljs receptor molecule object.
 * @param  {*} lig    The 3Dmoljs ligand molecule object.
 */
export function setup(view: any, recep: any, lig: any) {
    viewer = view;
    receptorMol = recep;
    ligandMol = lig;
}

/**
 * Starts BINANA.
 * @param  {string} pdbtxt  The text of the receptor.
 * @param  {string} ligtxt  The text of the ligand.
 * @returns void
 */
export function start(pdbtxt: string, ligtxt: string): void {
    let binanaParams = Store.store.state["binanaParams"];

    jQuery("body").addClass("waiting");

    setTimeout(() => {
        var myWorker = new Worker('binanaWebWorker.js', { type: "module" });
        myWorker.postMessage([pdbtxt, ligtxt, binanaParams]);

        myWorker.onmessage = function(e) {
            binanaFiles = e.data;
            binanaData = JSON.parse(binanaFiles["output.json"]);

            // Update the store too.
            // Store.store.commit("setVar", {
            //     name: "jsonOutput",
            //     val: binanaFiles["output.json"]  // JSON.stringify(binanaData, undefined, 1)
            // });
            
            Store.store.commit("setVar", {
                name: "filesToSave",
                val: binanaFiles
            });

            highlightAll();
            
            jQuery("body").removeClass("waiting");
        }
    }, 250);
}

export function highlight(highlightInfos: IHighlightInfo[]) {
    // Render sticks of protein model too. Clears (resets) the protein
    // rendering.
    ThreeDMol.showSticksAsAppropriate();

    let residues = [];

    for (let highlightInfo of highlightInfos) {
        // Add spheres
        if (Store.store["state"]["colorByInteraction"] !== Store.InteractionColoring.NONE) {
            drawSpheres(highlightInfo.ligAtomInfs.concat(highlightInfo.recAtomInfs), highlightInfo.interactionName);
        }
    
        if (Store.store["state"]["bondVisible"]) {
            drawCylinders(highlightInfo.interactionType, highlightInfo.interactionName);
        }

        residues.push(...highlightInfo.recAtomInfs.map(
            i => i[0]["index"]
        ));
    }

    // console.log(residues);

    // Regardless, make sure residues participating in interactions appear.
    receptorMol["setStyle"](
        {
            "index": residues,
            "byres": true
        },
        {
            "stick": { "radius": 0.1 },  // 0.15
            "cartoon": { "color": 'spectrum' },
        },
        true  // add
    );

    // Show protein ribbon again (otherwise sometimes parts of ribbon
    // disappear).
    ThreeDMol.showProteinRibbon(true);

    viewer["render"]();
}

/**
 * Highlights the specified interaction in the viewer. Sets the atoms involved
 * in the interaction to a different color.
 * @param  {string} interactionName  The name of the interaction.
 * @returns *  Information about this interaction, that will ultimately be used
 *             to highlight the atoms.
 */
export function getInfoForHighlight(interactionName: string): IHighlightInfo {
    // make an array for the interactions
    let interactionType = binanaData[interactionName];

    // A single atom may participate in multiple interactions with other
    // atoms. Make sure each atom is rendered in the viewer only once.
    idxOfAtomsSeen = new Set([]);
    let ligAtomInfs = [];
    let recAtomInfs = [];

    // DEPRECIATED IN FAVOR OF TABLE DECRIPTION, but leave this commented in
    // case you want to bring it back.
    // let colorMsg = Store.defaultColorMsg;

    // loop through the interactions
    for (let i = 0; i < interactionType.length; i++) {
        let ligandAtomInfs = interactionType[i]["ligandAtoms"];
        let receptorAtomInfs = interactionType[i]["receptorAtoms"];

        // Start by assuming color by molecule.
        let ligColor = "yellow";
        let recepColor = "red";
        // colorMsg = "Ligand atoms are highlighted in yellow, and receptor atoms are highlighted in red.";

        if (Store.store["state"]["colorByInteraction"] === Store.InteractionColoring.INTERACTION) {
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
                    // colorMsg = "Hydrogen-bond donors are highlighted in yellow, and hydrogen-bond acceptors are highlighted in red.";
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
                    // colorMsg = "Positively charged groups are highlighted in blue, and negatively charged groups are highlighted in red.";
                    break;
            }
        }

        // Store.store.commit("setVar", {
        //     name: "colorMessage",
        //     val: colorMsg
        // });

        ligAtomInfs = ligAtomInfs.concat(
            getAtomObjRadiusColor(ligandMol, ligandAtomInfs, ligColor)
        );
        recAtomInfs = recAtomInfs.concat(
            getAtomObjRadiusColor(receptorMol, receptorAtomInfs, recepColor)
        );
    }

    return {
        ligAtomInfs,
        recAtomInfs,
        interactionType,
        interactionName,
    }
}

/**
 * Draws interaction spheres in the 3Dmoljs viewer.
 * @param  {*} atomInfs  Information about the atoms.
 * @param  {string} interactionName  The name of the interaction.
 * @returns void
 */
function drawSpheres(atomInfs: any[], interactionName: string): void {
    // Certain interactionNames aren't associated with spheres.
    if (sphereOnlyReps.indexOf(interactionName) === -1) {
        return;
    }

    const coorsLen = atomInfs.length;
    for (let i = 0; i < coorsLen; i++) {
        const atomInf = atomInfs[i];
        const atom = atomInf[0];
        viewer["addSphere"]({
            "center": {"x": atom["x"], "y": atom["y"], "z": atom["z"]},
            "radius": 0.6 * atomInf[1],   // scale down vdw radius a bit. Was 0.6.
            "color": interactionsInfo[interactionName].colorHex,  // atomInf[2],
            "opacity": 0.65
        });
    }
}

/**
 * Draws the cylinders representing the interactions.
 * @param  {*}      interactionType  The atom informations that match this
 *                                   interaction type.
 * @param  {string} interactionName  The name of the interaction.
 * @returns void
 */
function drawCylinders(interactionType: any[], interactionName: string): void {
    // Certain interactionNames aren't associated with cylinder bonds.
    if (sphereOnlyReps.indexOf(interactionName) !== -1) {
        return;
    }


    // Get atoms.
    let interactionTypeAtoms = interactionType.map(i => [
        i["ligandAtoms"].map(l => atomInfTo3DMolAtom(ligandMol, l)),
        i["receptorAtoms"].map(r => atomInfTo3DMolAtom(receptorMol, r))
    ]);

    if (["hydrogenBonds", "halogenBonds"].indexOf(interactionName) !== -1) {
        let hBondHeavyAtomPairs = interactionTypeAtoms.map(i => [
            [2 - i[0].length, i[0].filter(a => a["elem"] !== "H")[0]],
            [2 - i[1].length, i[1].filter(a => a["elem"] !== "H")[0]]
        ]);
        hBondHeavyAtomPairs = hBondHeavyAtomPairs.map(i => i.sort().map(i2 => i2[1]));
    
        for (let i = 0; i < hBondHeavyAtomPairs.length; i++){
            // viewer["addCylinder"]({
            viewer["addArrow"]({
                "dashed": true,
                "start": {"x": hBondHeavyAtomPairs[i][0]["x"], "y": hBondHeavyAtomPairs[i][0]["y"], "z": hBondHeavyAtomPairs[i][0]["z"]},
                "end": {"x": hBondHeavyAtomPairs[i][1]["x"], "y": hBondHeavyAtomPairs[i][1]["y"], "z": hBondHeavyAtomPairs[i][1]["z"]},
                "radius": 0.125, // 0.1,
                "radiusRatio": 3.0,
                "mid": 0.7,
                "fromCap": 2,
                "toCap": 2,
                "color": interactionsInfo[interactionName].colorHex // 'black'
            });
        }
    } else {
        // If not hydrogen bond, just line between geometric centers.
        let centerPoints = interactionTypeAtoms.map(i => [
            [i[0].length, i[0].map(a => [a["x"], a["y"], a["z"]]).reduce(
                (c1, c2) => [(c1[0] + c2[0]), (c1[1] + c2[1]), (c1[2] + c2[2])]
            )],
            [i[1].length, i[1].map(a => [a["x"], a["y"], a["z"]]).reduce(
                (c1, c2) => [(c1[0] + c2[0]), (c1[1] + c2[1]), (c1[2] + c2[2])]
            )],
        ]);
        centerPoints = centerPoints.map(i => [
            i[0][1].map(v => v / i[0][0]),
            i[1][1].map(v => v / i[1][0]),
        ]);
    
        for (let i = 0; i < centerPoints.length; i++) {
            let start = {"x": centerPoints[i][0][0], "y": centerPoints[i][0][1], "z": centerPoints[i][0][2]};
            let end = {"x": centerPoints[i][1][0], "y": centerPoints[i][1][1], "z": centerPoints[i][1][2]};
    
            viewer["addCylinder"]({
            // viewer["addArrow"]({
                "dashed": true,
                "start": start,
                "end": end,
                "radius": 0.125,  // 0.1,
                // "radiusRatio": 3.0,
                // "mid": 0.7,
                "fromCap": 2,
                "toCap": 2,
                "color": interactionsInfo[interactionName].colorHex  // 'black'
            });
        }
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
 * Converts atom information to a 3dmoljs atom.
 * @param  {*} mol      The 3dmol.js molecule.
 * @param  {*} atomInf  Information about the atom.
 * @returns *  The 3dmoljs atom.
 */
function atomInfTo3DMolAtom(mol: any, atomInf: any): any {
    let selecteds = mol["selectedAtoms"]({
        "atom": atomInf["atomName"],
        "serial": atomInf["atomIndex"],
        "resi": atomInf["resID"]
    });
    let selected = selecteds[0];  //  Should be only one such atom.
    return selected;
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
        let atom = atomInfTo3DMolAtom(mol, atomInf);
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
    // Store.store.commit("setVar", {
    //     name: "colorMessage",
    //     val: Store.defaultColorMsg
    // });

    if (viewer === undefined) {
        return;
    }

    ThreeDMol.showSticksAsAppropriate();

    viewer["removeAllShapes"]();
    viewer["render"]();
}

export function highlightAll(): void {
    let interactionVisibilityStatus = JSON.parse(Store.store.state["interactionVisibilityStatus"]);

    // if (interactionName !== undefined) {
    clearInteraction();

    let highlightInfos = [];
    let tableData = [];
    for (let interactionName of renderOrder) {
    // for (let interactionName in interactionVisibilityStatus) {
        if (interactionVisibilityStatus[interactionName]) {
            highlightInfos.push(
                getInfoForHighlight(interactionName)
            );

            let interactionInfo = interactionsInfo[interactionName];
            let linewidth = "50";
            let linkIcon = `<svg version="1.1" baseProfile="tiny" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="612px" height="792px" viewBox="0 0 612 792" xml:space="preserve"> <path fill="#FFFFFF" stroke="#000000" stroke-width="${linewidth}" d="M30.6,304.2h367.2v367.2H30.6V304.2z"/> <path fill="#FFFFFF" stroke="#000000" stroke-width="${linewidth}" d="M275.4,181.8v-61.2h306v306h-61.2L459,365.4L275.4,549L153,426.6 L336.6,243L275.4,181.8z"/></svg>`;
            let linkEncoded = "data:image/svg+xml;base64," + btoa(linkIcon);

            tableData.push({
                "Name": `${interactionInfo.name} <a target="_blank" href="${interactionInfo.link}"><img style="width:15px; height:15px; position:relative; top:-2px; margin-left:3px;" src="${linkEncoded}"></a>`,
                "Representation": firstLetterCapital(
                    interactionInfo.representation
                        .replace(/COLOR/g, `<span style="font-weight:bold; color:${interactionInfo.colorHex}; text-shadow: 1px 1px 2px #555555;">${interactionInfo.color}</span>`)
                ) + ".",
                // "Link": interactionInfo.link
            });
        }
    }

    Store.store.commit("setVar", {
        name: "legendItems",
        val: tableData
    })

    highlight(highlightInfos);

    // }
}