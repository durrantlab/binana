// This file is part of BINANA, released under the Apache 2.0 License. See
// LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
// details. Copyright 2020 Jacob D. Durrant.


import * as Utils from "../Utils";

// @ts-ignore
import ExampleReceptorPDBQT from "../example/1xdn.pdbqt";

// @ts-ignore
import ExampleLigandPDBQT from "../example/ATP.pdbqt";

// @ts-ignore
import ExampleOutputPDBQT from "../example/binana_out.pdbqt";

declare var Vuex;
declare var jQuery;

export let defaultInteractionVisibilityStatus = JSON.stringify({
    "hydrogenBonds": true,
    "halogenBonds": true,
    "saltBridges": true,
    "piPiStackingInteractions": true,
    "tStackingInteractions": true,
    "cationPiInteractions": true,
});
interface IVueXStoreSetVar {
    name: string;
    val: any;
}

interface iVueXParam {
    stateVarName?: string;
    name: string;
    val: any;
}

interface IModal {
    title: string;
    body: string;
}

interface IFileConvertModal {
    ext: string;
    type: string;
    file: string;
}

interface IInputFileNames {
    type: string;
    filename: string;
}

export const enum InteractionColoring {
    // Note: const enum needed for closure-compiler compatibility.
    MOLECULE = 1,
    INTERACTION = 2,
    NONE = 3
}

// DEPRECIATED IN FAVOR OF TABLE DECRIPTION, but leave this commented in
// case you want to bring it back.
// export var defaultColorMsg = "No atoms selected.";

export const store = new Vuex.Store({
    "state": {
        "binanaParams": {
            // Defaults
            "close_contacts_dist1_cutoff" : 2.5,
            "close_contacts_dist2_cutoff" : 4.0,
            "electrostatic_dist_cutoff" : 4.0,
            "active_site_flexibility_dist_cutoff" : 4.0,
            "hydrophobic_dist_cutoff" : 4.0,
            "hydrogen_halogen_bond_dist_cutoff" : 4.0,
            "hydrogen_halogen_bond_angle_cutoff" : 40.0,
            "pi_padding_dist" : 0.75,
            "pi_pi_interacting_dist_cutoff" : 7.5,
            "pi_stacking_angle_tolerance" : 30.0,
            "T_stacking_angle_tolerance" : 30.0,
            "T_stacking_closest_dist_cutoff" : 5.0,
            "cation_pi_dist_cutoff" : 6.0,
            "salt_bridge_dist_cutoff" : 5.5,
        },
        "validation": {},
        "tabIdx": 0,
        "receptorFileName": "",
        "ligandFileName": "",
        "receptorContents": "",
        "receptorContentsExample": ExampleReceptorPDBQT,
        "ligandContents": "",
        "ligandContentsExample": ExampleLigandPDBQT,
        "outputContents": "",
        "outputContentsExample": ExampleOutputPDBQT,
        "modalShow": false,
        "modalTitle": "Title",
        "modalBody": "Some text here...",
        "binanaParamsValidates": false,
        "time": 0,  // Used to keep track of execution time.
        "receptorMol": undefined,
        "ligandMol": undefined,
        "renderProteinSticks": false,
        "colorByInteraction": InteractionColoring.MOLECULE,
        "bondVisible": true,

        // DEPRECIATED IN FAVOR OF TABLE DECRIPTION, but leave this commented in
        // case you want to bring it back.
        // "colorMessage": defaultColorMsg,
        
        // "jsonOutput": "{}",
        "interactionVisibilityStatus": defaultInteractionVisibilityStatus,
        "filesToSave": {},
        "legendItems": [],
        "showMissingHydrogensWarning": false
    },
    "mutations": {
        /**
         * Set one of the VueX store variables.
         * @param  {*}                state    The VueX state.
         * @param  {IVueXStoreSetVar} payload  An object containing
         *                                     information about which
         *                                     variable to set.
         * @returns void
         */
        "setVar"(state: any, payload: IVueXStoreSetVar): void {
            state[payload.name] = payload.val;
        },

        /**
         * Set one of the binana parameters.
         * @param  {*}          state    The VueX state.
         * @param  {iVueXParam} payload  An object with information about
         *                               which binana parameter to set.
         * @returns void
         */
        "setBinanaParam"(state: any, payload: iVueXParam): void {
            // By redefining the whole variable, it becomes reactive. Directly
            // changing individual properties is not reactive.
            state["binanaParams"] = Utils.getNewObjWithUpdate(
                state["binanaParams"],
                payload.name,
                payload.val
            );
        },

        /**
         * Set a validation parameter (either validates or doesn't).
         * @param  {*}          state    The VueX state.
         * @param  {iVueXParam} payload  An object containing information
         *                               about what to set.
         * @returns void
         */
        "setValidationParam"(state: any, payload: iVueXParam): void {
            // By redefining the whole variable, it becomes reactive. Directly
            // changing individual properties is not reactive.
            state["validation"] = Utils.getNewObjWithUpdate(
                state["validation"],
                payload.name,
                payload.val
            );
        },

        /**
         * Open the modal.
         * @param  {*}      state    The VueX state.
         * @param  {IModal} payload  An object with the title and body.
         * @returns void
         */
        "openModal"(state: any, payload: IModal): void {
            state["modalTitle"] = payload.title;
            state["modalBody"] = payload.body;
            state["modalShow"] = true;
            jQuery("body").removeClass("waiting");
        },

        /**
         * Update the filenames of the receptor and ligand input files.
         * @param  {*}               state    The VueX state.
         * @param  {IInputFileNames} payload  An object describing the
         *                                    filename change.
         * @returns void
         */
        "updateFileName"(state: any, payload: IInputFileNames): void {
            // Also update file names so example binana command line is valid.
            state[payload.type + "FileName"] = payload.filename;
        }
    }
});

// Good for debugging.
window["store"] = store;
