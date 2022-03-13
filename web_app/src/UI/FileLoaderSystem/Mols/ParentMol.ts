// Released under the Apache 2.0 License. See LICENSE.md or go to
// https://opensource.org/licenses/Apache-2.0 for full details. Copyright 2022
// Jacob D. Durrant.

export interface IAtom {
    serial?: string;  // atom index (I think it can sometimes be non-numeric)
    resn?: string;  // residue name
    x?: number;  // coordinate
    y?: number;  // coordinate
    z?: number;  // coordinate
    elem?: string;
    hetflag?: boolean;  // true if hetatm
    chain?: string;
    resi?: string;  // residue number (I think it can sometimes be non-numeric)
    atom?: string;  // atom name
    nonAtomLine?: string;  // e.g., "TORSDOF" from PDBQT format.
    // origLine?: string;  // For debugging
    altLoc?: string;  // rotamers
}

export interface ISelection {
    atomNames?: string[];
    resnames?: string[];
    resids?: string[];
    chains?: string[];
    elems?: string[];
    nonProtein?: boolean;
}

export interface IPruneParams {
    targetNumAtoms: number;
    removeHydrogens?: boolean;
    removeSidechains?: boolean;
    keepOnlyFirstFrame?: boolean;
    removeRegularlySpacedAtoms?: boolean;
    keepOnlyProtein?: boolean;
}

export const PROTEIN_RESNAMES = new Set([
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
]);

type SetConstructor<T extends ParentMol> = {
    new (items:any[]): T;
}

export abstract class ParentMol {
    frames: Frame[] = [];
    
    /**
     * If a fileContents is passed in, load it. Otherwise, do nothing
     * @param {string} [fileContents=undefined]  The contents of the file.
     * @param {*}      [params=undefined]        Any extra parameters to pass to
     *                                           the load function.
     */
    constructor(fileContents: any = undefined, params = undefined) {
        if (fileContents === undefined) {
            return;
        }

        if (typeof fileContents === "string") {
            this.load(fileContents, params);
        } else {
            this.loadFromRawData(fileContents);
        }
    }

    /**
     * Takes a string of molecule data and parses it into a list of atoms.
     * @param {string}  fileContents  The contents of the PDB file.
     * @param {*}       params        Any extra parameters to pass to the load
     *                                function.
     */
    abstract load(fileContents: string, params: any): void;

    /**
     * Converts the frames of the molecule into a text format.
     * @returns The text of the file.
     */
    abstract toText(): string;

    /**
     * Given a frame index, return a string containing the text of the frame.
     * @param {number} frameIdx  The frame index.
     * @returns {string} The file contents.
     */
    abstract frameToText(frameIdx: number): string;

    /**
     * When molecules are saved to local storage, they are serialized and so
     * loose all functions. This loads in that serialized data so you can access
     * the functions of the original object again.
     * @param {*} rawData  The data (taken from local storage).
     */
    loadFromRawData(rawData: any): void {
        if (rawData["frames"]) {
            for (let frame of rawData["frames"]) {
                this.startNewFrame();
                for (let atom of frame["atoms"]) {
                    this.addAtomToCurrentFrame(atom);
                }
            }
            delete rawData["frames"];
        }

        // Pick up any additional properties
        for (let key in rawData) {
            this[key] = rawData[key];
        }
    }

    /**
     * Create a new molecule of this type that contains only one frame.
     * @param {number} frameIdx  The index of the frame to be copied.
     * @returns A new molecule with a single frame.
     */
    frameToMol(frameIdx: number): this {
        let newMol = this.newMolOfThisType();
        newMol.frames = [this.frames[frameIdx].clone()];
        return newMol;
    }

    /**
     * Create a new frame and push it to the frames array
     */
    startNewFrame(): void {
        this.frames.push(new Frame());
    }

    /**
     * Create a new instance of this type
     * @returns A new instance of the same type as the current instance.
     */
    protected newMolOfThisType(): this {
        return new (this.constructor as SetConstructor<this>)(undefined);
    }

    /**
     * Creates a new molecule of the same type as this one, and copies all of
     * the frames from this molecule into the new one
     * @returns A new instance of the same type of Molecule.
     */
    clone(): this {
        let newMol = this.newMolOfThisType();
        newMol.frames = this.frames.map(f => f.clone());
        return newMol;
    }

    /**
     * Add the given atom to the current frame
     * @param {IAtom} atom  The atom to add.
     */
    addAtomToCurrentFrame(atom: IAtom): void {
        this.frames[this.frames.length - 1].addAtom(atom);
    }

    /**
     * Given a selection, split the molecule into two molecules, one with the
     * selected atoms, and one with the non-selected atoms
     * @param {ISelection} sel  The selection.
     * @returns An array of two new molecule with the same type as the original
     *          molecule, but with the frames partitioned.
     */
    partitionBySelection(sel: ISelection): this[] {
        let newMol = this.newMolOfThisType();
        let newMolInvert = this.newMolOfThisType();

        for (let frame of this.frames) {
            let [newFrame, newFrameInvert] = frame.partition(sel);
            newMol.frames.push(newFrame);
            newMolInvert.frames.push(newFrameInvert);
        }

        return [newMol, newMolInvert];
    }

    /**
     * Delete the atoms of a selection.
     * @param {ISelection} sel  The selection.
     * @returns A molecule containing the atoms that are not in the original
     * selection.
     */
    deleteSelection(sel: ISelection): this {
        let [_, invertSel] = this.partitionBySelection(sel);
        return invertSel;
    }

    /**
     * Keep the atoms of a selection.
     * @param {ISelection} sel  The selection.
     * @returns A molecule containing the atoms that are in the original
     * selection.
     */
    keepSelection(sel: ISelection): this {
        let [matchSel, _] = this.partitionBySelection(sel);
        return matchSel;
    }

    /**
     * Get new molecule with the same frames but with only the protein atoms.
     * @returns A new molecule with the frames containing only the protein.
     */
    keepOnlyProtein(): this {
        let newMol = this.clone();
        newMol.frames = newMol.frames.map(f => f.keepOnlyProtein());
        return newMol;
    }

    /**
     * Creates a new molecule of the same type as this molecule, and add all
     * the non-protein atoms from this molecule to the new molecule.
     * @returns  A new molecule with all of the non-protein atoms.
     */
    getNonProteinMol(): this {
        let nonProtMol = this.newMolOfThisType();
        // console.warn("Num frames: " + this.frames.length.toString());
        for (let frame of this.frames) {
            frame.addNonProteinAtomsToMol(nonProtMol);
        }

        nonProtMol.frames = nonProtMol.frames.filter(
            f => f.atoms.length > 0
        );

        return nonProtMol;
    }

    /**
     * Get all the chains in the frames of the molecule.
     * @returns {string[]}  An array of chain ids.
     */
    getChains(): string[] {
        let chains = new Set([]);
        for (let frame of this.frames) {
            for (let chain of frame.getChains()) {
                chains.add(chain);
            }
        }
        let chainArr = Array.from(chains);
        chainArr.sort()
        return chainArr;
    }

    /**
     * Get the coordinates.
     * @returns {number[][][]}  The coordinates of each frame.
     */
    getCoords(): number[][][] {
        return this.frames.map(f => f.getCoords());
    }

    /**
     * Get the elements.
     * @returns {string[][]}  The elements of each frame.
     */
    getElements(): string[][] {
        return this.frames.map(f => f.getElements());
    }

    /**
     * Returns true if the molecule has hydrogens in any frame.
     * @param {boolean} [onlyFirstFrame=true]  If true, only the first frame is
     *                                         checked.
     * @returns True if has hydrogens.
     */
    hasHydrogens(onlyFirstFrame = true): boolean {
        for (let frame of this.frames) {
            if (frame.hasHydrogens()) { return true; }
            if (onlyFirstFrame) { break; }
        }
        return false;
    }

    /**
     * Return the total number of atoms across all frames in this trajectory.
     * @returns {number}  The number of atoms across all frames.
     */
    numAtomsAcrossAllFrames(): number {
        let numAtoms = 0;
        for (let frame of this.frames) {
            numAtoms += frame.numAtoms();
        }
        return numAtoms;
    }

    /**
     * Return the number of atoms in the frame at the given index.
     * @param {number} [frameIdx=0]  The index of the frame.
     * @returns {number}  The number of atoms in the frame.
     */
    numAtoms(frameIdx = 0): number {
        if (!this.frames[frameIdx]) {
            return 0;
        }
        return this.frames[frameIdx].numAtoms();
    }

    /**
     * Reduce the size of the protein. Keep only the first frame, remove
     * hydrogen atoms, keep only protein atoms, and remove sidechains.
     * @param {IPruneParams} params  The pruning parameters (what to remove).
     * @returns A new Molecule object.
     */
    pruneAtoms(params: IPruneParams): this {
        // Not tested yet.
        debugger;
        let newMol = this.clone();
        if (this.numAtomsAcrossAllFrames() < params.targetNumAtoms) { return newMol; }

        // Keep first frame
        if (params.keepOnlyFirstFrame) { newMol.frames = [newMol.frames[0]]; }
        if (this.numAtomsAcrossAllFrames() < params.targetNumAtoms) { return newMol; }

        // Keep only protein atoms.
        if (params.keepOnlyProtein) { newMol = newMol.keepOnlyProtein(); }
        if (this.numAtomsAcrossAllFrames() < params.targetNumAtoms) { return newMol; }

        // Remove hydrogen atoms
        if (params.removeHydrogens) { newMol = newMol.deleteSelection({elems: ["H"]}); }
        if (this.numAtomsAcrossAllFrames() < params.targetNumAtoms) { return newMol; }

        // Keep only backbone atoms.
        if (params.removeSidechains) { newMol = newMol.keepSelection({atomNames: ["C", "N", "CA", "O"]}); }
        if (this.numAtomsAcrossAllFrames() < params.targetNumAtoms) { return newMol; }

        // Stride the atoms to reduce counts.
        let stride = this.numAtomsAcrossAllFrames() / params.targetNumAtoms;
        for (let frame of this.frames) {
            frame.strideAtoms(stride);
        }
        // if (this.numAtomsAcrossAllFrames() < params.targetNumAtoms) { return newMol; }
        
        return newMol;
    }

    /**
     * Pad a string.
     * @param {string} s                The string to pad.
     * @param {number} size             The size of the padded string.
     * @param boolean [justLeft=false]  If true, the string will be left
     *                                  justified. Otherwise, right justified.
     * @returns {string}  The padded string.
     */
    protected padStr(s: string, size: number, justLeft = false): string {
        if (s.length > size) { return s; }
        if (justLeft) {
            while (s.length < size) { s += " "; }
            return s;
        }

        while (s.length < size) { s = " " + s; }
        return s;
    }

    /**
     * Given a number of frames, scale the number of frames in the molecule to
     * that number by duplicating or removing frames.
     * @param {number} targetNumFrames  The desired number of frames.
     * @returns A new Molecule with the same type as the original, but with the
     *          specified number of frames.
     */
    scaleFrames(targetNumFrames: number): this {
        let currentNumFrames = this.frames.length;
    
        if (targetNumFrames !== currentNumFrames) {
            console.log(`WARNING: You have requested ${targetNumFrames} output frame(s), but your PDB file has ${currentNumFrames} frame(s). I will duplicate or stride the PDB frames to produce your requested ${targetNumFrames} output frame(s).\n`)
        }
    
        let newFrames: Frame[] = [];
    
        for (let newFramesIdx = 0; newFramesIdx < targetNumFrames; newFramesIdx++) {
            let framesIdx = Math.round((currentNumFrames - 1) * newFramesIdx / (targetNumFrames - 1));
            if (isNaN(framesIdx)) {
                // Happens if --frames = 1, for example.
                framesIdx = 0;
            }
            newFrames.push(this.frames[framesIdx].clone());
        }

        let newMol = this.newMolOfThisType();
        newMol.frames = newFrames;
    
        return newMol;
    }

    /**
     * Update the coordinates of the given frame.
     * @param {number} frameIdx  The index of the frame to update.
     * @param {any} coors  An array of coordinates.
     */
    updateCoords(frameIdx: number, coors: any): void {
        this.frames[frameIdx].updateCoords(coors);
    }

    /**
     * Remove all alternate locations from the current frame.
     */
    protected removeAltLocsCurrentFrame(): void {
        this.frames[this.frames.length - 1].removeAltLocs();
    }
}

export class Frame {
    atoms: IAtom[] = [];

    /**
     * Adds an atom to the list of atoms
     * @param {IAtom} atom  The atom to add.
     */
    addAtom(atom: IAtom): void {
        this.atoms.push(atom);
    }

    /**
     * Create a new frame and copy the atoms from this frame to the new frame.
     * @returns {Frame}  The new frame.
     */
    clone(): Frame {
        let frame = new Frame();
        frame.atoms = JSON.parse(JSON.stringify(this.atoms));
        return frame;
    }

    /**
     * Given a selection, split the frame into two frames, one with the selected
     * atoms, and one with the non-selected atoms
     * @param {ISelection} sel  The selection.
     * @returns An array of two new frames, with the atoms partitioned.
     */
    partition(sel: ISelection): Frame[] {
        let newFrame = new Frame();
        let newFrameInvert = new Frame();
        for (let atom of this.atoms) {
            if (sel.resnames && (sel.resnames.indexOf(atom.resn) === -1)) {
                newFrameInvert.addAtom(atom);
                continue
            }
            if (sel.resids && (sel.resids.indexOf(atom.resi) === -1)) {
                newFrameInvert.addAtom(atom);
                continue
            }
            if (sel.chains && (sel.chains.indexOf(atom.chain) === -1)) {
                newFrameInvert.addAtom(atom);
                continue
            }
            if (sel.atomNames && (sel.atomNames.indexOf(atom.atom) === -1)) {
                newFrameInvert.addAtom(atom);
                continue
            }
            if (sel.elems && (sel.elems.indexOf(atom.elem) === -1)) {
                newFrameInvert.addAtom(atom);
                continue
            }

            newFrame.addAtom(atom);
        }
        return [newFrame, newFrameInvert];
    }

    /**
     * Get all the chains in this frame.
     * @returns {string[]}  An array of chain ids.
     */
    getChains(): string[] {
        let chains = new Set([]);
        for (let atom of this.atoms) {
            if (["", undefined].indexOf(atom.chain) === -1) {
                chains.add(atom.chain);
            }
        }
        return Array.from(chains);
    }

    /**
     * Whether an atom is a protein atom.
     * @param {IAtom} atom  The atom.
     * @returns True if atom is a protein, false otherwise.
     */
    isProtein(atom: IAtom): boolean {
        return PROTEIN_RESNAMES.has(atom.resn);
    }

    /**
     * Add protein atoms to the provided molecule.
     * @param {ParentMol} mol  The molecule to receive the atoms.
     */
    addNonProteinAtomsToMol(mol: ParentMol): void {
        mol.startNewFrame();
        for (let atom of this.atoms) {
            if (!this.isProtein(atom)) {
                mol.addAtomToCurrentFrame(atom);
            }
        }
    }

    /**
     * Get the coordinates of this frame.
     * @returns {number[][]}  The coordinates of the frame.
     */
    getCoords(): number[][] {
        return this.atoms.filter(a => !a.nonAtomLine).map(a => [a.x, a.y, a.z]);
    }

    /**
     * Get the elements of this frame.
     * @returns {string[]}  The elements of the frame.
     */
     getElements(): string[] {
        return this.atoms.filter(a => !a.nonAtomLine).map(a => a.elem);
    }

    /**
     * Determine if the frame has hydrogen atoms.
     * @returns True if has hydrogens.
     */
     hasHydrogens(): boolean {
        for (let atom of this.atoms) {
            if (atom.elem === "H") { return true; }
        }
        return false;
    }

    /**
     * Check if any of the atoms in this molecule are in fact non-atom lines.
     * @returns {boolean}  True if it has a non-atom line (e.g., BRANCH).
     */
    hasNonAtomLine(): boolean {
        for (let atom of this.atoms) {
            if (atom.nonAtomLine) {
                return true;
            }
        }
        return false;
    }

    /**
     * Return the number of atoms in the frame.
     * @returns {number}  The number of atoms.
     */
    numAtoms(): number {
        return this.atoms.filter(a => !a.nonAtomLine).length;
    }

    /**
     * Create a new array of atoms with some atoms skipped.
     * @param {number} stride  The number of atoms to skip between each atom
     *                         that is kept.
     */
    strideAtoms(stride: number): void {
        // TODO: Should not be in place.
        let curAtomIdx = 0;
        let origNumAtoms = this.atoms.length;
        let newAtoms: IAtom[] = [];
        while (curAtomIdx < origNumAtoms) {
            newAtoms.push(this.atoms[Math.floor(curAtomIdx)]);
            curAtomIdx += stride;
        }
        this.atoms = newAtoms;
    }

    /**
     * Get new frame with only the protein atoms.
     * @returns {Frame}  A new frame containing only the protein.
     */
    keepOnlyProtein(): Frame {
        let frame = new Frame();
        frame.atoms = this.atoms.filter(a => this.isProtein(a));
        return frame;
    }

    /**
     * Update the coordinates of this frame.
     * @param {any} coors  An array of coordinates.
     */
    updateCoords(coors: any) {
        if (this.hasNonAtomLine()) {
            console.log("Can't set coordinates because frame contains non-atom lines!");
        }
        
        for (let idx in coors) {
            let coor = coors[idx];
            let [x, y, z] = coor;
            this.atoms[idx].x = x;
            this.atoms[idx].y = y;
            this.atoms[idx].z = z;
        }
    }

    /**
     * Remove all alternate locations from this frame.
     */
    removeAltLocs(): void {
        let atomIdsSeen = new Set([]);
        this.atoms = this.atoms.filter((atom) => {
            if (atom.altLoc === " ") {
                // Must be marked with altLoc.
                return true;
            }
    
            let id = atom.resn;
            id += ":" + atom.resi;
            id += ":" + atom.chain;
            id += ":" + atom.atom;
            
            if (atomIdsSeen.has(id)) {
                // It's an altLoc! Already seen.
                return false;
            }

            atomIdsSeen.add(id);
            return true;
        });
    }
}