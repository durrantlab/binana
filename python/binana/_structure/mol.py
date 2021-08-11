# This file is part of BINANA, released under the Apache 2.0 License. See
# LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
# details. Copyright 2020 Jacob D. Durrant.

# this file containd the class Mol for binana.py

import binana
import math
from binana._structure.point import Point
from binana._structure.atom import Atom
from binana._utils._math_functions import (
    distance,
    angle_between_three_points,
    vector_subtraction,
    cross_product,
    dihedral,
)
from binana._utils.shim import _set_default

# __pragma__ ('skip')
# Python
import textwrap
from math import fabs

openFile = open
# __pragma__ ('noskip')

"""?
# Transcrypt
import binana._utils
from binana._utils import shim
textwrap = shim
from binana._utils.shim import fabs
from binana._utils.shim import OpenFile as openFile
?"""


"""
Class Mol handles PDB filing
"""


class Mol:

    # Initialize Mol
    def __init__(self):
        self.all_atoms = {}
        self.non_protein_atoms = {}
        self.max_x = -9999.99
        self.min_x = 9999.99
        self.max_y = -9999.99
        self.min_y = 9999.99
        self.max_z = -9999.99
        self.min_z = 9999.99
        self.rotatable_bonds_count = -1  # To indicate not set.
        self.protein_resnames = [
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
            "PHE",
            "PRO",
            "SER",
            "THR",
            "TRP",
            "TYR",
            "VAL",
        ]
        self.aromatic_rings = []
        self.charges = []  # a list of points

    def load_pdb_from_text(
        self,
        text_content,
        filename_to_use=None,
        min_x=None,
        max_x=None,
        min_y=None,
        max_y=None,
        min_z=None,
        max_z=None,
    ):

        filename_to_use = _set_default(filename_to_use, "NO_FILE")
        min_x = _set_default(min_x, -9999.99)
        max_x = _set_default(max_x, 9999.99)
        min_y = _set_default(min_y, -9999.99)
        max_y = _set_default(max_y, 9999.99)
        min_z = _set_default(min_z, -9999.99)
        max_z = _set_default(max_z, 9999.99)

        # __pragma__ ('js', 'let lines = text_content.split("\\n");')

        # __pragma__ ('skip')
        lines = text_content.split("\n")
        # __pragma__ ('noskip')

        autoindex = 1

        self.__init__()

        self.filename = filename_to_use

        # Keep track of atomname_resid_chain pairs, to make sure redundants
        # aren't loaded This basically gets rid of rotamers, I think.
        atom_already_loaded = []

        for t in range(0, len(lines)):
            line = lines[t]

            if line[:3] == "END" and line[:7] != "ENDROOT" and line[:9] != "ENDBRANCH":
                t = textwrap.wrap(
                    "WARNING: END or ENDMDL term found in "
                    + filename_to_use
                    + ". Everything after the first instance of this term will be ignored. \
                    If any of your PDBQT files have multiple frames/poses, please partition them \
                    into separate files using vina_split and feed each of the the single-frame files into Binana separately.",
                    80,
                )
                print(("\n".join(t) + "\n"))
                print(line)
                break

            if "between atoms" in line and " A " in line:
                if self.rotatable_bonds_count == -1:
                    # Rotatable bonds are available, to reset counter.
                    self.rotatable_bonds_count = 0

                self.rotatable_bonds_count = self.rotatable_bonds_count + 1

            if len(line) >= 7 and (line[0:4] == "ATOM" or line[0:6] == "HETATM"):
                # Load atom data (coordinates, etc.)
                temp_atom = Atom()
                temp_atom.read_pdb_line(line)

                if (
                    temp_atom.coordinates.x > min_x
                    and temp_atom.coordinates.x < max_x
                    and temp_atom.coordinates.y > min_y
                    and temp_atom.coordinates.y < max_y
                    and temp_atom.coordinates.z > min_z
                    and temp_atom.coordinates.z < max_z
                ):

                    if self.max_x < temp_atom.coordinates.x:
                        self.max_x = temp_atom.coordinates.x
                    if self.max_y < temp_atom.coordinates.y:
                        self.max_y = temp_atom.coordinates.y
                    if self.max_z < temp_atom.coordinates.z:
                        self.max_z = temp_atom.coordinates.z

                    if self.min_x > temp_atom.coordinates.x:
                        self.min_x = temp_atom.coordinates.x
                    if self.min_y > temp_atom.coordinates.y:
                        self.min_y = temp_atom.coordinates.y
                    if self.min_z > temp_atom.coordinates.z:
                        self.min_z = temp_atom.coordinates.z

                    # this string uniquely identifies each atom
                    key = (
                        temp_atom.atom_name.strip()
                        + "_"
                        + str(temp_atom.resid)
                        + "_"
                        + temp_atom.residue.strip()
                        + "_"
                        + temp_atom.chain.strip()
                    )

                    if (
                        key in atom_already_loaded
                        and temp_atom.residue.strip() in self.protein_resnames
                    ):
                        # so this is a protein atom that has already been
                        # loaded once
                        self.printout(
                            'Warning: Duplicate protein atom detected: "'
                            + temp_atom.line.strip()
                            + '". Not loading this duplicate.'
                        )
                        print("")

                    if (
                        key not in atom_already_loaded
                        or not temp_atom.residue.strip() in self.protein_resnames
                    ):
                        # So either the atom hasn't been loaded, or else
                        # it's a non-protein atom So note that non-protein
                        # atoms can have redundant names, but protein
                        # atoms cannot. This is because protein residues
                        # often contain rotamers
                        atom_already_loaded.append(
                            key
                        )  # So each atom can only be loaded once. No rotamers.
                        self.all_atoms[
                            autoindex
                        ] = temp_atom  # So you're actually reindexing everything here.
                        if temp_atom.residue[-3:] not in self.protein_resnames:
                            self.non_protein_atoms[autoindex] = temp_atom

                        autoindex = autoindex + 1

        self.check_protein_format()

        # Only for the ligand, because bonds can be inferred based on
        # atomnames from PDB
        self.create_bonds_by_distance()

        self.assign_aromatic_rings()
        self.assign_charges()

    # Load PDB file
    # Param file_name (string)
    # Param min_x (float): minimum x coordinate
    # Param max_x (float): maximum x coordinate
    # Param min_y (float): minimum y coordinate
    # Param max_y (float): maximum y coordinate
    # Param min_z (float): minimum z coordinate
    # Param max_z (float): maximum z coordinate
    def load_pdb_file(
        self,
        filename,
        min_x=None,
        max_x=None,
        min_y=None,
        max_y=None,
        min_z=None,
        max_z=None,
    ):

        min_x = _set_default(min_x, -9999.99)
        max_x = _set_default(max_x, 9999.99)
        min_y = _set_default(min_y, -9999.99)
        max_y = _set_default(max_y, 9999.99)
        min_z = _set_default(min_z, -9999.99)
        max_z = _set_default(max_z, 9999.99)

        # Now load the file into a list
        file = openFile(filename, "r")
        text_content = file.read()
        file.close()

        self.load_pdb_from_text(
            text_content,
            filename,
            min_x,
            max_x,
            min_y,
            max_y,
            min_z,
            max_z,
        )

    # Print the PDB line
    # Param self (Mol)
    # Param the_string (string)
    def printout(self, the_string):
        lines = textwrap.wrap(the_string, 80)
        for line in lines:
            print(line)

    # Write and save PDB line to a file
    # Param self (Mol)
    # Param file_name (string)
    def save_pdb(self, file_name):
        f = openFile(file_name, "w")
        towrite = self.save_pdb_string()
        if towrite.strip() == "":
            # So no PDB is empty, VMD will load them all
            towrite = "ATOM      1  X   XXX             0.000   0.000   0.000                       X"
        f.write(towrite)
        f.close()

    # Returns a new PDB line
    # Param self (Mol)
    def save_pdb_string(self):
        to_output = ""

        # Write coordinates of all atoms
        for atom_index in self.all_atoms.keys():
            to_output = (
                to_output
                + self.all_atoms[atom_index].create_pdb_line(atom_index)
                + "\n"
            )

        return to_output

    # Adds a new atom to this Mol
    # Param self (Mol)
    # Param atom (binana._structure.atom.Atom): new atom being added
    def add_new_atom(self, atom):
        # first get available index
        t = 1
        while t in list(self.all_atoms.keys()):
            t = t + 1

        # now add atom
        self.all_atoms[t] = atom

    # Assign residue name to atom
    # Param self (Mol)
    # Param  resname (string): residue name
    def set_resname(self, resname):
        for atom_index in self.all_atoms.keys():
            self.all_atoms[atom_index].residue = resname

    # Returns a list of the indeces of atoms connected to a given element
    # Param self (Mol)
    # Param index (integer): index of atom
    # Param connected_atom_element (string): element in question
    def connected_atoms_of_given_element(self, index, connected_atom_element):
        atom = self.all_atoms[index]
        connected_atoms = []
        for index2 in atom.indecies_of_atoms_connecting:
            atom2 = self.all_atoms[index2]
            if atom2.element == connected_atom_element:
                connected_atoms.append(index2)
        return connected_atoms

    # Returns a list of the indeces of heavy atoms connected at specified index
    # Param self (Mol)
    # Param index (integer): index of atom
    def connected_heavy_atoms(self, index):
        atom = self.all_atoms[index]
        connected_atoms = []
        for index2 in atom.indecies_of_atoms_connecting:
            atom2 = self.all_atoms[index2]
            if atom2.element != "H":
                connected_atoms.append(index2)
        return connected_atoms

    # Correct format of the protein
    # Param self (Mol)
    def check_protein_format(self):
        curr_res = ""
        first = True
        residue = []

        last_key = ""
        for atom_index in self.all_atoms.keys():
            atom = self.all_atoms[atom_index]

            key = atom.residue + "_" + str(atom.resid) + "_" + atom.chain

            if first is True:
                curr_res = key
                first = False

            if key != curr_res:

                self.check_protein_format_process_residue(residue, last_key)

                residue = []
                curr_res = key

            residue.append(atom.atom_name.strip())
            last_key = key

        self.check_protein_format_process_residue(residue, last_key)

    # Correct format of the protein and residues
    # Param self (Mol)
    # Param residue ()
    # Param last_key ()
    def check_protein_format_process_residue(self, residue, last_key):
        temp = last_key.strip().split("_")
        resname = temp[0]
        real_resname = resname[-3:]
        resid = temp[1]
        chain = temp[2]

        if real_resname in self.protein_resnames:  # so it's a protein residue
            if "N" not in residue:
                self.printout(
                    'Warning: There is no atom named "N" in the protein residue '
                    + last_key
                    + ". Please use standard naming conventions for all protein residues. This atom is needed to determine secondary structure. If this residue is far from the active site, this warning may not affect the NNScore."
                )
                print("")
            if "C" not in residue:
                self.printout(
                    'Warning: There is no atom named "C" in the protein residue '
                    + last_key
                    + ". Please use standard naming conventions for all protein residues. This atom is needed to determine secondary structure. If this residue is far from the active site, this warning may not affect the NNScore."
                )
                print("")
            if "CA" not in residue:
                self.printout(
                    'Warning: There is no atom named "CA" in the protein residue '
                    + last_key
                    + ". Please use standard naming conventions for all protein residues. This atom is needed to determine secondary structure. If this residue is far from the active site, this warning may not affect the NNScore."
                )
                print("")

            if real_resname == "GLU" or real_resname == "GLH" or real_resname == "GLX":
                if "OE1" not in residue:
                    self.printout(
                        'Warning: There is no atom named "OE1" in the protein residue '
                        + last_key
                        + ". Please use standard naming conventions for all protein residues. This atom is needed to determine salt-bridge interactions. If this residue is far from the active site, this warning may not affect the NNScore."
                    )
                    print("")
                if "OE2" not in residue:
                    self.printout(
                        'Warning: There is no atom named "OE2" in the protein residue '
                        + last_key
                        + ". Please use standard naming conventions for all protein residues. This atom is needed to determine salt-bridge interactions. If this residue is far from the active site, this warning may not affect the NNScore."
                    )
                    print("")

            if real_resname == "ASP" or real_resname == "ASH" or real_resname == "ASX":
                if "OD1" not in residue:
                    self.printout(
                        'Warning: There is no atom named "OD1" in the protein residue '
                        + last_key
                        + ". Please use standard naming conventions for all protein residues. This atom is needed to determine salt-bridge interactions. If this residue is far from the active site, this warning may not affect the NNScore."
                    )
                    print("")
                if "OD2" not in residue:
                    self.printout(
                        'Warning: There is no atom named "OD2" in the protein residue '
                        + last_key
                        + ". Please use standard naming conventions for all protein residues. This atom is needed to determine salt-bridge interactions. If this residue is far from the active site, this warning may not affect the NNScore."
                    )
                    print("")

            if real_resname == "LYS" or real_resname == "LYN":
                if "NZ" not in residue:
                    self.printout(
                        'Warning: There is no atom named "NZ" in the protein residue '
                        + last_key
                        + ". Please use standard naming conventions for all protein residues. This atom is needed to determine pi-cation and salt-bridge interactions. If this residue is far from the active site, this warning may not affect the NNScore."
                    )
                    print("")

            if real_resname == "ARG":
                if "NH1" not in residue:
                    self.printout(
                        'Warning: There is no atom named "NH1" in the protein residue '
                        + last_key
                        + ". Please use standard naming conventions for all protein residues. This atom is needed to determine pi-cation and salt-bridge interactions. If this residue is far from the active site, this warning may not affect the NNScore."
                    )
                    print("")
                if "NH2" not in residue:
                    self.printout(
                        'Warning: There is no atom named "NH2" in the protein residue '
                        + last_key
                        + ". Please use standard naming conventions for all protein residues. This atom is needed to determine pi-cation and salt-bridge interactions. If this residue is far from the active site, this warning may not affect the NNScore."
                    )
                    print("")

            if (
                real_resname == "HIS"
                or real_resname == "HID"
                or real_resname == "HIE"
                or real_resname == "HIP"
            ):
                if "NE2" not in residue:
                    self.printout(
                        'Warning: There is no atom named "NE2" in the protein residue '
                        + last_key
                        + ". Please use standard naming conventions for all protein residues. This atom is needed to determine pi-cation and salt-bridge interactions. If this residue is far from the active site, this warning may not affect the NNScore."
                    )
                    print("")
                if "ND1" not in residue:
                    self.printout(
                        'Warning: There is no atom named "ND1" in the protein residue '
                        + last_key
                        + ". Please use standard naming conventions for all protein residues. This atom is needed to determine pi-cation and salt-bridge interactions. If this residue is far from the active site, this warning may not affect the NNScore."
                    )
                    print("")

            if real_resname == "PHE":
                if "CG" not in residue:
                    self.printout(
                        'Warning: There is no atom named "CG" in the protein residue '
                        + last_key
                        + ". Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore."
                    )
                    print("")
                if "CD1" not in residue:
                    self.printout(
                        'Warning: There is no atom named "CD1" in the protein residue '
                        + last_key
                        + ". Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore."
                    )
                    print("")
                if "CD2" not in residue:
                    self.printout(
                        'Warning: There is no atom named "CD2" in the protein residue '
                        + last_key
                        + ". Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore."
                    )
                    print("")
                if "CE1" not in residue:
                    self.printout(
                        'Warning: There is no atom named "CE1" in the protein residue '
                        + last_key
                        + ". Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore."
                    )
                    print("")
                if "CE2" not in residue:
                    self.printout(
                        'Warning: There is no atom named "CE2" in the protein residue '
                        + last_key
                        + ". Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore."
                    )
                    print("")
                if "CZ" not in residue:
                    self.printout(
                        'Warning: There is no atom named "CZ" in the protein residue '
                        + last_key
                        + ". Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore."
                    )
                    print("")

            if real_resname == "TYR":
                if "CG" not in residue:
                    self.printout(
                        'Warning: There is no atom named "CG" in the protein residue '
                        + last_key
                        + ". Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore."
                    )
                    print("")
                if "CD1" not in residue:
                    self.printout(
                        'Warning: There is no atom named "CD1" in the protein residue '
                        + last_key
                        + ". Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore."
                    )
                    print("")
                if "CD2" not in residue:
                    self.printout(
                        'Warning: There is no atom named "CD2" in the protein residue '
                        + last_key
                        + ". Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore."
                    )
                    print("")
                if "CE1" not in residue:
                    self.printout(
                        'Warning: There is no atom named "CE1" in the protein residue '
                        + last_key
                        + ". Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore."
                    )
                    print("")
                if "CE2" not in residue:
                    self.printout(
                        'Warning: There is no atom named "CE2" in the protein residue '
                        + last_key
                        + ". Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore."
                    )
                    print("")
                if "CZ" not in residue:
                    self.printout(
                        'Warning: There is no atom named "CZ" in the protein residue '
                        + last_key
                        + ". Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore."
                    )
                    print("")

            if real_resname == "TRP":
                if "CG" not in residue:
                    self.printout(
                        'Warning: There is no atom named "CG" in the protein residue '
                        + last_key
                        + ". Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore."
                    )
                    print("")
                if "CD1" not in residue:
                    self.printout(
                        'Warning: There is no atom named "CD1" in the protein residue '
                        + last_key
                        + ". Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore."
                    )
                    print("")
                if "CD2" not in residue:
                    self.printout(
                        'Warning: There is no atom named "CD2" in the protein residue '
                        + last_key
                        + ". Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore."
                    )
                    print("")
                if "NE1" not in residue:
                    self.printout(
                        'Warning: There is no atom named "NE1" in the protein residue '
                        + last_key
                        + ". Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore."
                    )
                    print("")
                if "CE2" not in residue:
                    self.printout(
                        'Warning: There is no atom named "CE2" in the protein residue '
                        + last_key
                        + ". Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore."
                    )
                    print("")
                if "CE3" not in residue:
                    self.printout(
                        'Warning: There is no atom named "CE3" in the protein residue '
                        + last_key
                        + ". Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore."
                    )
                    print("")
                if "CZ2" not in residue:
                    self.printout(
                        'Warning: There is no atom named "CZ2" in the protein residue '
                        + last_key
                        + ". Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore."
                    )
                    print("")
                if "CZ3" not in residue:
                    self.printout(
                        'Warning: There is no atom named "CZ3" in the protein residue '
                        + last_key
                        + ". Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore."
                    )
                    print("")
                if "CH2" not in residue:
                    self.printout(
                        'Warning: There is no atom named "CH2" in the protein residue '
                        + last_key
                        + ". Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore."
                    )
                    print("")

            if (
                real_resname == "HIS"
                or real_resname == "HID"
                or real_resname == "HIE"
                or real_resname == "HIP"
            ):
                if "CG" not in residue:
                    self.printout(
                        'Warning: There is no atom named "CG" in the protein residue '
                        + last_key
                        + ". Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore."
                    )
                    print("")
                if "ND1" not in residue:
                    self.printout(
                        'Warning: There is no atom named "ND1" in the protein residue '
                        + last_key
                        + ". Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore."
                    )
                    print("")
                if "CD2" not in residue:
                    self.printout(
                        'Warning: There is no atom named "CD2" in the protein residue '
                        + last_key
                        + ". Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore."
                    )
                    print("")
                if "CE1" not in residue:
                    self.printout(
                        'Warning: There is no atom named "CE1" in the protein residue '
                        + last_key
                        + ". Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore."
                    )
                    print("")
                if "NE2" not in residue:
                    self.printout(
                        'Warning: There is no atom named "NE2" in the protein residue '
                        + last_key
                        + ". Please use standard naming conventions for all protein residues. This atom is needed to determine pi-pi and pi-cation interactions. If this residue is far from the active site, this warning may not affect the NNScore."
                    )
                    print("")

    # Functions to determine the bond connectivity based on distance
    # ==============================================================

    # Define bonds between atoms using distance on the grid
    # Param self (Mol)
    def create_bonds_by_distance(self):
        for atom_index1 in self.non_protein_atoms.keys():
            atom1 = self.non_protein_atoms[atom_index1]
            if atom1.residue[-3:] not in self.protein_resnames:
                # so it's not a protein residue
                for atom_index2 in self.non_protein_atoms.keys():
                    if atom_index1 != atom_index2:
                        atom2 = self.non_protein_atoms[atom_index2]
                        if not atom2.residue[-3:] in self.protein_resnames:
                            # so it's not a protein residue
                            dist = distance(atom1.coordinates, atom2.coordinates)

                            if (
                                dist
                                < self.bond_length(atom1.element, atom2.element) * 1.2
                            ):
                                atom1.add_neighbor_atom_index(atom_index2)
                                atom2.add_neighbor_atom_index(atom_index1)

    # Retuns bond length between two elements
    # Param self (Mol)
    # Param element1 (string): symbol of first element
    # Param element2 (string): symbol of second element
    def bond_length(self, element1, element2):

        """Bond lengths taken from Handbook of Chemistry and Physics. The information provided there was very specific,
        so I tried to pick representative examples and used the bond lengths from those. Sitautions could arise where these
        lengths would be incorrect, probably slight errors (<0.06) in the hundreds."""

        distance = 0.0
        if element1 == "C" and element2 == "C":
            distance = 1.53
        if element1 == "N" and element2 == "N":
            distance = 1.425
        if element1 == "O" and element2 == "O":
            distance = 1.469
        if element1 == "S" and element2 == "S":
            distance = 2.048
        if (element1 == "C" and element2 == "H") or (
            element1 == "H" and element2 == "C"
        ):
            distance = 1.059
        if (element1 == "C" and element2 == "N") or (
            element1 == "N" and element2 == "C"
        ):
            distance = 1.469
        if (element1 == "C" and element2 == "O") or (
            element1 == "O" and element2 == "C"
        ):
            distance = 1.413
        if (element1 == "C" and element2 == "S") or (
            element1 == "S" and element2 == "C"
        ):
            distance = 1.819
        if (element1 == "N" and element2 == "H") or (
            element1 == "H" and element2 == "N"
        ):
            distance = 1.009
        if (element1 == "N" and element2 == "O") or (
            element1 == "O" and element2 == "N"
        ):
            distance = 1.463
        if (element1 == "O" and element2 == "S") or (
            element1 == "S" and element2 == "O"
        ):
            distance = 1.577
        if (element1 == "O" and element2 == "H") or (
            element1 == "H" and element2 == "O"
        ):
            distance = 0.967
        if (element1 == "S" and element2 == "H") or (
            element1 == "H" and element2 == "S"
        ):
            # This one not from source sited above. Not sure where it's from,
            # but it wouldn't ever be used in the current context ("AutoGrow")
            distance = 2.025 / 1.5
        if (element1 == "S" and element2 == "N") or (
            element1 == "H" and element2 == "N"
        ):
            distance = 1.633

        if (element1 == "C" and element2 == "F") or (
            element1 == "F" and element2 == "C"
        ):
            distance = 1.399
        if (element1 == "C" and element2 == "CL") or (
            element1 == "CL" and element2 == "C"
        ):
            distance = 1.790
        if (element1 == "C" and element2 == "BR") or (
            element1 == "BR" and element2 == "C"
        ):
            distance = 1.910
        if (element1 == "C" and element2 == "I") or (
            element1 == "I" and element2 == "C"
        ):
            distance = 2.162

        if (element1 == "S" and element2 == "BR") or (
            element1 == "BR" and element2 == "S"
        ):
            distance = 2.321
        if (element1 == "S" and element2 == "CL") or (
            element1 == "CL" and element2 == "S"
        ):
            distance = 2.283
        if (element1 == "S" and element2 == "F") or (
            element1 == "F" and element2 == "S"
        ):
            distance = 1.640
        if (element1 == "S" and element2 == "I") or (
            element1 == "I" and element2 == "S"
        ):
            distance = 2.687

        if (element1 == "P" and element2 == "BR") or (
            element1 == "BR" and element2 == "P"
        ):
            distance = 2.366
        if (element1 == "P" and element2 == "CL") or (
            element1 == "CL" and element2 == "P"
        ):
            distance = 2.008
        if (element1 == "P" and element2 == "F") or (
            element1 == "F" and element2 == "P"
        ):
            distance = 1.495
        if (element1 == "P" and element2 == "I") or (
            element1 == "I" and element2 == "P"
        ):
            distance = 2.490
        if (element1 == "P" and element2 == "O") or (
            element1 == "O" and element2 == "P"
        ):
            # estimate based on eye balling Handbook of Chemistry and Physics
            distance = 1.6

        if (element1 == "N" and element2 == "BR") or (
            element1 == "BR" and element2 == "N"
        ):
            distance = 1.843
        if (element1 == "N" and element2 == "CL") or (
            element1 == "CL" and element2 == "N"
        ):
            distance = 1.743
        if (element1 == "N" and element2 == "F") or (
            element1 == "F" and element2 == "N"
        ):
            distance = 1.406
        if (element1 == "N" and element2 == "I") or (
            element1 == "I" and element2 == "N"
        ):
            distance = 2.2

        if (element1 == "SI" and element2 == "BR") or (
            element1 == "BR" and element2 == "SI"
        ):
            distance = 2.284
        if (element1 == "SI" and element2 == "CL") or (
            element1 == "CL" and element2 == "SI"
        ):
            distance = 2.072
        if (element1 == "SI" and element2 == "F") or (
            element1 == "F" and element2 == "SI"
        ):
            distance = 1.636
        if (element1 == "SI" and element2 == "P") or (
            element1 == "P" and element2 == "SI"
        ):
            distance = 2.264
        if (element1 == "SI" and element2 == "S") or (
            element1 == "S" and element2 == "SI"
        ):
            distance = 2.145
        if (element1 == "SI" and element2 == "SI") or (
            element1 == "SI" and element2 == "SI"
        ):
            distance = 2.359
        if (element1 == "SI" and element2 == "C") or (
            element1 == "C" and element2 == "SI"
        ):
            distance = 1.888
        if (element1 == "SI" and element2 == "N") or (
            element1 == "N" and element2 == "SI"
        ):
            distance = 1.743
        if (element1 == "SI" and element2 == "O") or (
            element1 == "O" and element2 == "SI"
        ):
            distance = 1.631

        return distance

    # Functions to identify positive charges
    # ======================================

    # Assign Charges to atoms in protein
    # Param self (Mol)
    def assign_charges(self):
        # Get all the quartinary amines on non-protein residues (these are the
        # only non-protein groups that will be identified as positively
        # charged)
        all_charged = []
        for atom_index in self.non_protein_atoms.keys():
            atom = self.non_protein_atoms[atom_index]
            if (
                atom.element == "MG"
                or atom.element == "MN"
                or atom.element == "RH"
                or atom.element == "ZN"
                or atom.element == "FE"
                or atom.element == "BI"
                or atom.element == "AS"
                or atom.element == "AG"
            ):
                chrg = self.Charged(atom.coordinates, [atom_index], True)
                self.charges.append(chrg)

            if atom.element == "N":
                if atom.number_of_neighbors() == 4:
                    # a quartinary amine, so it's easy
                    indexes = [atom_index]
                    indexes.extend(atom.indecies_of_atoms_connecting)

                    # so the indicies stored is just the index of the nitrogen
                    # and any attached atoms
                    chrg = self.Charged(atom.coordinates, indexes, True)
                    self.charges.append(chrg)
                elif atom.number_of_neighbors() == 3:
                    # maybe you only have two hydrogen's added, by they're sp3
                    # hybridized. Just count this as a quartinary amine, since
                    # I think the positive charge would be stabalized.
                    nitrogen = atom
                    atom1 = self.all_atoms[atom.indecies_of_atoms_connecting[0]]
                    atom2 = self.all_atoms[atom.indecies_of_atoms_connecting[1]]
                    atom3 = self.all_atoms[atom.indecies_of_atoms_connecting[2]]
                    angle1 = (
                        angle_between_three_points(
                            atom1.coordinates, nitrogen.coordinates, atom2.coordinates
                        )
                        * 180.0
                        / math.pi
                    )
                    angle2 = (
                        angle_between_three_points(
                            atom1.coordinates, nitrogen.coordinates, atom3.coordinates
                        )
                        * 180.0
                        / math.pi
                    )
                    angle3 = (
                        angle_between_three_points(
                            atom2.coordinates, nitrogen.coordinates, atom3.coordinates
                        )
                        * 180.0
                        / math.pi
                    )
                    average_angle = (angle1 + angle2 + angle3) / 3
                    if fabs(average_angle - 109.0) < 5.0:
                        indexes = [atom_index]
                        indexes.extend(atom.indecies_of_atoms_connecting)
                        # so indexes added are the nitrogen and any attached
                        # atoms.
                        chrg = self.Charged(nitrogen.coordinates, indexes, True)
                        self.charges.append(chrg)

            if atom.element == "C":
                # let's check for guanidino-like groups (actually H2N-C-NH2,
                # where not CN3.)
                if atom.number_of_neighbors() == 3:
                    # the carbon has only three atoms connected to it
                    nitrogens = self.connected_atoms_of_given_element(atom_index, "N")
                    if len(nitrogens) >= 2:
                        # so carbon is connected to at least two nitrogens.
                        # now we need to count the number of nitrogens that
                        # are only connected to one heavy atom (the carbon).
                        nitrogens_to_use = []
                        all_connected = atom.indecies_of_atoms_connecting[:]
                        not_isolated = -1

                        for atmindex in nitrogens:
                            if len(self.connected_heavy_atoms(atmindex)) == 1:
                                nitrogens_to_use.append(atmindex)
                                all_connected.remove(atmindex)

                        if len(all_connected) > 0:
                            # get the atom that connects this charged group to
                            # the rest of the molecule, ultimately to make
                            # sure it's sp3 hybridized
                            not_isolated = all_connected[0]

                        if len(nitrogens_to_use) == 2 and not_isolated != -1:
                            # so there are at two nitrogens that are only
                            # connected to the carbon (and probably some
                            # hydrogens)

                            # now you need to make sure not_isolated atom is
                            # sp3 hybridized
                            not_isolated_atom = self.all_atoms[not_isolated]
                            if (
                                (
                                    not_isolated_atom.element == "C"
                                    and not_isolated_atom.number_of_neighbors() == 4
                                )
                                or (
                                    not_isolated_atom.element == "O"
                                    and not_isolated_atom.number_of_neighbors() == 2
                                )
                                or not_isolated_atom.element == "N"
                                or not_isolated_atom.element == "S"
                                or not_isolated_atom.element == "P"
                            ):

                                pt = self.all_atoms[
                                    nitrogens_to_use[0]
                                ].coordinates.copy_of()
                                pt.x = (
                                    pt.x
                                    + self.all_atoms[nitrogens_to_use[1]].coordinates.x
                                )
                                pt.y = (
                                    pt.y
                                    + self.all_atoms[nitrogens_to_use[1]].coordinates.y
                                )
                                pt.z = (
                                    pt.z
                                    + self.all_atoms[nitrogens_to_use[1]].coordinates.z
                                )
                                pt.x = pt.x / 2.0
                                pt.y = pt.y / 2.0
                                pt.z = pt.z / 2.0

                                indexes = [atom_index]
                                indexes.extend(nitrogens_to_use)
                                indexes.extend(
                                    self.connected_atoms_of_given_element(
                                        nitrogens_to_use[0], "H"
                                    )
                                )
                                indexes.extend(
                                    self.connected_atoms_of_given_element(
                                        nitrogens_to_use[1], "H"
                                    )
                                )

                                chrg = self.Charged(
                                    pt, indexes, True  # True because it's positive
                                )
                                self.charges.append(chrg)

            if atom.element == "C":
                # let's check for a carboxylate
                if atom.number_of_neighbors() == 3:
                    # a carboxylate carbon will have three items connected to
                    # it.
                    oxygens = self.connected_atoms_of_given_element(atom_index, "O")
                    if len(oxygens) == 2:
                        # a carboxylate will have two oxygens connected to it.
                        # now, each of the oxygens should be connected to only
                        # one heavy atom (so if it's connected to a hydrogen,
                        # that's okay)
                        if (
                            len(self.connected_heavy_atoms(oxygens[0])) == 1
                            and len(self.connected_heavy_atoms(oxygens[1])) == 1
                        ):
                            # so it's a carboxylate! Add a negative charge.
                            pt = self.all_atoms[oxygens[0]].coordinates.copy_of()
                            pt.x = pt.x + self.all_atoms[oxygens[1]].coordinates.x
                            pt.y = pt.y + self.all_atoms[oxygens[1]].coordinates.y
                            pt.z = pt.z + self.all_atoms[oxygens[1]].coordinates.z
                            pt.x = pt.x / 2.0
                            pt.y = pt.y / 2.0
                            pt.z = pt.z / 2.0
                            chrg = self.Charged(
                                pt, [oxygens[0], atom_index, oxygens[1]], False
                            )
                            self.charges.append(chrg)

            if atom.element == "P":
                # let's check for a phosphate or anything where a phosphorus
                # is bound to two oxygens where both oxygens are bound to only
                # one heavy atom (the phosphorus). I think this will get
                # several phosphorus substances.
                oxygens = self.connected_atoms_of_given_element(atom_index, "O")
                if len(oxygens) >= 2:
                    # the phosphorus is bound to at least two oxygens now
                    # count the number of oxygens that are only bound to the
                    # phosphorus
                    count = 0
                    for oxygen_index in oxygens:
                        if len(self.connected_heavy_atoms(oxygen_index)) == 1:
                            count = count + 1
                    if count >= 2:
                        # so there are at least two oxygens that are only
                        # bound to the phosphorus
                        indexes = [atom_index]
                        indexes.extend(oxygens)
                        chrg = self.Charged(atom.coordinates, indexes, False)
                        self.charges.append(chrg)

            if atom.element == "S":
                # let's check for a sulfonate or anything where a sulfur is
                # bound to at least three oxygens and at least three are bound
                # to only the sulfur (or the sulfur and a hydrogen).
                oxygens = self.connected_atoms_of_given_element(atom_index, "O")
                if len(oxygens) >= 3:
                    # the sulfur is bound to at least three oxygens. now count
                    # the number of oxygens that are only bound to the sulfur
                    count = 0
                    for oxygen_index in oxygens:
                        if len(self.connected_heavy_atoms(oxygen_index)) == 1:
                            count = count + 1
                    if count >= 3:
                        # so there are at least three oxygens that are only
                        # bound to the sulfur
                        indexes = [atom_index]
                        indexes.extend(oxygens)
                        chrg = self.Charged(atom.coordinates, indexes, False)
                        self.charges.append(chrg)

        # Now that you've found all the positive charges in non-protein
        # residues, it's time to look for aromatic rings in protein residues
        curr_res = ""
        first = True
        residue = []

        last_key = ""
        for atom_index in self.all_atoms.keys():
            atom = self.all_atoms[atom_index]

            key = atom.residue + "_" + str(atom.resid) + "_" + atom.chain

            if first == True:
                curr_res = key
                first = False

            if key != curr_res:

                self.assign_charged_from_protein_process_residue(residue, last_key)

                residue = []
                curr_res = key

            residue.append(atom_index)
            last_key = key

        self.assign_charged_from_protein_process_residue(residue, last_key)

    # Assign charges but with protein residue
    # Param self (Mol)
    # Param residue ()
    # Param last_key ()
    def assign_charged_from_protein_process_residue(self, residue, last_key):
        temp = last_key.strip().split("_")
        resname = temp[0]
        real_resname = resname[-3:]
        resid = temp[1]
        chain = temp[2]

        if real_resname == "LYS" or real_resname == "LYN":
            # regardless of protonation state, assume it's charged.
            for index in residue:
                atom = self.all_atoms[index]
                if atom.atom_name.strip() == "NZ":

                    # quickly go through the residue and get the hydrogens
                    # attached to this nitrogen to include in the index list
                    indexes = [index]
                    for index2 in residue:
                        atom2 = self.all_atoms[index2]
                        if atom2.atom_name.strip() == "HZ1":
                            indexes.append(index2)
                        if atom2.atom_name.strip() == "HZ2":
                            indexes.append(index2)
                        if atom2.atom_name.strip() == "HZ3":
                            indexes.append(index2)

                    chrg = self.Charged(atom.coordinates, indexes, True)
                    self.charges.append(chrg)
                    break

        if real_resname == "ARG":
            charge_pt = Point(0.0, 0.0, 0.0)
            count = 0.0
            indices = []
            for index in residue:
                atom = self.all_atoms[index]
                if atom.atom_name.strip() == "NH1":
                    charge_pt.x = charge_pt.x + atom.coordinates.x
                    charge_pt.y = charge_pt.y + atom.coordinates.y
                    charge_pt.z = charge_pt.z + atom.coordinates.z
                    indices.append(index)
                    count = count + 1.0
                if atom.atom_name.strip() == "NH2":
                    charge_pt.x = charge_pt.x + atom.coordinates.x
                    charge_pt.y = charge_pt.y + atom.coordinates.y
                    charge_pt.z = charge_pt.z + atom.coordinates.z
                    indices.append(index)
                    count = count + 1.0
                if atom.atom_name.strip() == "2HH2":
                    indices.append(index)
                if atom.atom_name.strip() == "1HH2":
                    indices.append(index)
                if atom.atom_name.strip() == "CZ":
                    indices.append(index)
                if atom.atom_name.strip() == "2HH1":
                    indices.append(index)
                if atom.atom_name.strip() == "1HH1":
                    indices.append(index)

            if count != 0.0:
                charge_pt.x = charge_pt.x / count
                charge_pt.y = charge_pt.y / count
                charge_pt.z = charge_pt.z / count

                if charge_pt.x != 0.0 or charge_pt.y != 0.0 or charge_pt.z != 0.0:
                    chrg = self.Charged(charge_pt, indices, True)
                    self.charges.append(chrg)

        if real_resname in ["HIS", "HID", "HIE", "HIP"]:
            # regardless of protonation state, assume it's charged. This based
            # on "The Cation-Pi Interaction," which suggests protonated state
            # would be stabalized. But let's not consider HIS when doing salt
            # bridges.
            charge_pt = Point(0.0, 0.0, 0.0)
            count = 0.0
            indices = []
            for index in residue:
                atom = self.all_atoms[index]
                if atom.atom_name.strip() == "NE2":
                    charge_pt.x = charge_pt.x + atom.coordinates.x
                    charge_pt.y = charge_pt.y + atom.coordinates.y
                    charge_pt.z = charge_pt.z + atom.coordinates.z
                    indices.append(index)
                    count = count + 1.0
                if atom.atom_name.strip() == "ND1":
                    charge_pt.x = charge_pt.x + atom.coordinates.x
                    charge_pt.y = charge_pt.y + atom.coordinates.y
                    charge_pt.z = charge_pt.z + atom.coordinates.z
                    indices.append(index)
                    count = count + 1.0
                if atom.atom_name.strip() == "HE2":
                    indices.append(index)
                if atom.atom_name.strip() == "HD1":
                    indices.append(index)
                if atom.atom_name.strip() == "CE1":
                    indices.append(index)
                if atom.atom_name.strip() == "CD2":
                    indices.append(index)
                if atom.atom_name.strip() == "CG":
                    indices.append(index)

            if count != 0.0:
                charge_pt.x = charge_pt.x / count
                charge_pt.y = charge_pt.y / count
                charge_pt.z = charge_pt.z / count
                if charge_pt.x != 0.0 or charge_pt.y != 0.0 or charge_pt.z != 0.0:
                    chrg = self.Charged(charge_pt, indices, True)
                    self.charges.append(chrg)

        if real_resname in ["GLU", "GLH", "GLX"]:
            # regardless of protonation state, assume it's charged. This based
            # on "The Cation-Pi Interaction," which suggests protonated state
            # would be stabalized.
            charge_pt = Point(0.0, 0.0, 0.0)
            count = 0.0
            indices = []
            for index in residue:
                atom = self.all_atoms[index]
                if atom.atom_name.strip() == "OE1":
                    charge_pt.x = charge_pt.x + atom.coordinates.x
                    charge_pt.y = charge_pt.y + atom.coordinates.y
                    charge_pt.z = charge_pt.z + atom.coordinates.z
                    indices.append(index)
                    count = count + 1.0
                if atom.atom_name.strip() == "OE2":
                    charge_pt.x = charge_pt.x + atom.coordinates.x
                    charge_pt.y = charge_pt.y + atom.coordinates.y
                    charge_pt.z = charge_pt.z + atom.coordinates.z
                    indices.append(index)
                    count = count + 1.0
                if atom.atom_name.strip() == "CD":
                    indices.append(index)

            if count != 0.0:
                charge_pt.x = charge_pt.x / count
                charge_pt.y = charge_pt.y / count
                charge_pt.z = charge_pt.z / count
                if charge_pt.x != 0.0 or charge_pt.y != 0.0 or charge_pt.z != 0.0:
                    chrg = self.Charged(
                        charge_pt,
                        indices,
                        False,  # False because it's a negative charge
                    )
                    self.charges.append(chrg)

        if real_resname in ["ASP", "ASH", "ASX"]:
            # regardless of protonation state, assume it's charged. This based
            # on "The Cation-Pi Interaction," which suggests protonated state
            # would be stabalized.
            charge_pt = Point(0.0, 0.0, 0.0)
            count = 0.0
            indices = []
            for index in residue:
                atom = self.all_atoms[index]
                if atom.atom_name.strip() == "OD1":
                    charge_pt.x = charge_pt.x + atom.coordinates.x
                    charge_pt.y = charge_pt.y + atom.coordinates.y
                    charge_pt.z = charge_pt.z + atom.coordinates.z
                    indices.append(index)
                    count = count + 1.0
                if atom.atom_name.strip() == "OD2":
                    charge_pt.x = charge_pt.x + atom.coordinates.x
                    charge_pt.y = charge_pt.y + atom.coordinates.y
                    charge_pt.z = charge_pt.z + atom.coordinates.z
                    indices.append(index)
                    count = count + 1.0
                if atom.atom_name.strip() == "CG":
                    indices.append(index)

            if count != 0.0:
                charge_pt.x = charge_pt.x / count
                charge_pt.y = charge_pt.y / count
                charge_pt.z = charge_pt.z / count
                if charge_pt.x != 0.0 or charge_pt.y != 0.0 or charge_pt.z != 0.0:
                    chrg = self.Charged(
                        charge_pt,
                        indices,
                        False,  # False because it's a negative charge
                    )
                    self.charges.append(chrg)

    """
    Class Charged defines the charge of atom
    """

    class Charged:
        # Initialize charge
        # Param self (Charged)
        # Param coordinates (Point): point on grid
        # Param indecies (list): indecies of atom
        # Param positive (boolean): True if atom is positively charged
        def __init__(self, coordinates, indices, positive):
            self.coordinates = coordinates
            self.indices = indices
            # true or false to specifiy if positive or negative charge
            self.positive = positive

    # Functions to identify aromatic rings
    # ====================================

    # Marks atoms present in an aromatic ring
    # Param indicies_of_ring (list): indecies of atoms in ring
    def add_aromatic_marker(self, indicies_of_ring):
        # first identify the center point
        points_list = []
        total = len(indicies_of_ring)
        x_sum = 0.0
        y_sum = 0.0
        z_sum = 0.0

        for index in indicies_of_ring:
            atom = self.all_atoms[index]
            points_list.append(atom.coordinates)
            x_sum = x_sum + atom.coordinates.x
            y_sum = y_sum + atom.coordinates.y
            z_sum = z_sum + atom.coordinates.z

        if total == 0:
            return  # to prevent errors in some cases

        center = Point(x_sum / total, y_sum / total, z_sum / total)

        # now get the radius of the aromatic ring
        radius = 0.0
        for index in indicies_of_ring:
            atom = self.all_atoms[index]
            dist = center.dist_to(atom.coordinates)
            if dist > radius:
                radius = dist

        # now get the plane that defines this ring
        if len(indicies_of_ring) < 3:
            # to prevent an error in some cases. If there aren't three point,
            # you can't define a plane
            return
        elif len(indicies_of_ring) == 3:
            A = self.all_atoms[indicies_of_ring[0]].coordinates
            B = self.all_atoms[indicies_of_ring[1]].coordinates
            C = self.all_atoms[indicies_of_ring[2]].coordinates
        elif len(indicies_of_ring) == 4:
            A = self.all_atoms[indicies_of_ring[0]].coordinates
            B = self.all_atoms[indicies_of_ring[1]].coordinates
            C = self.all_atoms[indicies_of_ring[3]].coordinates
        else:  # best, for 5 and 6 member rings
            A = self.all_atoms[indicies_of_ring[0]].coordinates
            B = self.all_atoms[indicies_of_ring[2]].coordinates
            C = self.all_atoms[indicies_of_ring[4]].coordinates

        AB = vector_subtraction(B, A)
        AC = vector_subtraction(C, A)
        ABXAC = cross_product(AB, AC)

        # formula for plane will be ax + by + cz = d
        x1 = self.all_atoms[indicies_of_ring[0]].coordinates.x
        y1 = self.all_atoms[indicies_of_ring[0]].coordinates.y
        z1 = self.all_atoms[indicies_of_ring[0]].coordinates.z

        a = ABXAC.x
        b = ABXAC.y
        c = ABXAC.z
        d = a * x1 + b * y1 + c * z1

        ar_ring = self.AromaticRing(center, indicies_of_ring, [a, b, c, d], radius)
        self.aromatic_rings.append(ar_ring)

    """
    Class AromaticRing defines an a ring
    """

    class AromaticRing:
        # Initialize a ring
        # Param center (float): center of ring on grid
        # Param indices (list): indecies of atoms in ring
        # Param plane_coeff ():
        # Param radius (float): ring's radius
        def __init__(self, center, indices, plane_coeff, radius):
            self.center = center
            self.indices = indices
            self.plane_coeff = plane_coeff  # a*x + b*y + c*z = dI think that
            self.radius = radius

    # Denote aromatic rings
    def assign_aromatic_rings(self):

        # Get all the rings containing each of the atoms in the ligand
        all_rings = []
        for atom_index in self.non_protein_atoms.keys():
            all_rings.extend(self.all_rings_containing_atom(atom_index))

        for ring_index_1 in range(len(all_rings)):
            ring1 = all_rings[ring_index_1]
            if len(ring1) != 0:
                for ring_index_2 in range(len(all_rings)):
                    if ring_index_1 != ring_index_2:
                        ring2 = all_rings[ring_index_2]
                        if len(ring2) != 0:
                            if self.set1_is_subset_of_set2(ring1, ring2) == True:
                                all_rings[ring_index_2] = []

        while [] in all_rings:
            all_rings.remove([])

        # Now we need to figure out which of these ligands are aromatic (planar)

        for ring_index in range(len(all_rings)):
            ring = all_rings[ring_index]
            is_flat = True
            for t in range(-3, len(ring) - 3):
                # For transcrypt compatibility, don't use negative index.
                while t < 0:
                    t = t + len(ring)

                # Also need to mod index for transcrypt.
                pt1 = self.non_protein_atoms[ring[t % len(ring)]].coordinates
                pt2 = self.non_protein_atoms[ring[(t + 1) % len(ring)]].coordinates
                pt3 = self.non_protein_atoms[ring[(t + 2) % len(ring)]].coordinates
                pt4 = self.non_protein_atoms[ring[(t + 3) % len(ring)]].coordinates

                # first, let's see if the last atom in this ring is a carbon connected to four atoms. That would be a quick way of telling this is not an aromatic ring
                cur_atom = self.non_protein_atoms[ring[(t + 3) % len(ring)]]
                if cur_atom.element == "C" and cur_atom.number_of_neighbors() == 4:
                    is_flat = False
                    break

                # now check the dihedral between the ring atoms to see if it's
                # flat
                angle = dihedral(pt1, pt2, pt3, pt4) * 180 / math.pi
                if (angle > -165 and angle < -15) or (angle > 15 and angle < 165):
                    # 15 degress is the cutoff #, ring[t], ring[t+1],
                    # ring[t+2], ring[t+3] # range of this function is -pi to
                    # pi
                    is_flat = False
                    break

                # now check the dihedral between the ring atoms and an atom connected to the current atom to see if that's flat too.
                for substituent_atom_index in cur_atom.indecies_of_atoms_connecting:
                    pt_sub = self.non_protein_atoms[substituent_atom_index].coordinates
                    angle = dihedral(pt2, pt3, pt4, pt_sub) * 180 / math.pi
                    if (angle > -165 and angle < -15) or (
                        angle > 15 and angle < 165
                    ):  # 15 degress is the cutoff #, ring[t], ring[t+1], ring[t+2], ring[t+3] # range of this function is -pi to pi
                        is_flat = False
                        break

            if is_flat == False:
                all_rings[ring_index] = []
            if len(ring) < 5:
                all_rings[
                    ring_index
                ] = []  # While I'm at it, three and four member rings are not aromatic
            if len(ring) > 6:
                all_rings[
                    ring_index
                ] = (
                    []
                )  # While I'm at it, if the ring has more than 6, also throw it out. So only 5 and 6 member rings are allowed.

        while [] in all_rings:
            all_rings.remove([])

        for ring in all_rings:
            self.add_aromatic_marker(ring)

        # Now that you've found all the rings in non-protein residues, it's
        # time to look for aromatic rings in protein residues
        curr_res = ""
        first = True
        residue = []

        last_key = ""
        for atom_index in self.all_atoms.keys():
            atom = self.all_atoms[atom_index]

            key = atom.residue + "_" + str(atom.resid) + "_" + atom.chain

            if first == True:
                curr_res = key
                first = False

            if key != curr_res:

                self.assign_aromatic_rings_from_protein_process_residue(
                    residue, last_key
                )

                residue = []
                curr_res = key

            residue.append(atom_index)
            last_key = key

        self.assign_aromatic_rings_from_protein_process_residue(residue, last_key)

    # Denote aromatic ring with residue
    # Param residue ():
    # Param last_key ():
    def assign_aromatic_rings_from_protein_process_residue(self, residue, last_key):
        temp = last_key.strip().split("_")
        resname = temp[0]
        real_resname = resname[-3:]
        resid = temp[1]
        chain = temp[2]

        if real_resname == "PHE":
            indicies_of_ring = []

            for index in residue:  # written this way because order is important
                atom = self.all_atoms[index]
                if atom.atom_name.strip() == "CG":
                    indicies_of_ring.append(index)
            for index in residue:  # written this way because order is important
                atom = self.all_atoms[index]
                if atom.atom_name.strip() == "CD1":
                    indicies_of_ring.append(index)
            for index in residue:  # written this way because order is important
                atom = self.all_atoms[index]
                if atom.atom_name.strip() == "CE1":
                    indicies_of_ring.append(index)
            for index in residue:  # written this way because order is important
                atom = self.all_atoms[index]
                if atom.atom_name.strip() == "CZ":
                    indicies_of_ring.append(index)
            for index in residue:  # written this way because order is important
                atom = self.all_atoms[index]
                if atom.atom_name.strip() == "CE2":
                    indicies_of_ring.append(index)
            for index in residue:  # written this way because order is important
                atom = self.all_atoms[index]
                if atom.atom_name.strip() == "CD2":
                    indicies_of_ring.append(index)

            self.add_aromatic_marker(indicies_of_ring)

        if real_resname == "TYR":
            indicies_of_ring = []

            for index in residue:  # written this way because order is important
                atom = self.all_atoms[index]
                if atom.atom_name.strip() == "CG":
                    indicies_of_ring.append(index)
            for index in residue:  # written this way because order is important
                atom = self.all_atoms[index]
                if atom.atom_name.strip() == "CD1":
                    indicies_of_ring.append(index)
            for index in residue:  # written this way because order is important
                atom = self.all_atoms[index]
                if atom.atom_name.strip() == "CE1":
                    indicies_of_ring.append(index)
            for index in residue:  # written this way because order is important
                atom = self.all_atoms[index]
                if atom.atom_name.strip() == "CZ":
                    indicies_of_ring.append(index)
            for index in residue:  # written this way because order is important
                atom = self.all_atoms[index]
                if atom.atom_name.strip() == "CE2":
                    indicies_of_ring.append(index)
            for index in residue:  # written this way because order is important
                atom = self.all_atoms[index]
                if atom.atom_name.strip() == "CD2":
                    indicies_of_ring.append(index)

            self.add_aromatic_marker(indicies_of_ring)

        if (
            real_resname == "HIS"
            or real_resname == "HID"
            or real_resname == "HIE"
            or real_resname == "HIP"
        ):
            indicies_of_ring = []

            for index in residue:  # written this way because order is important
                atom = self.all_atoms[index]
                if atom.atom_name.strip() == "CG":
                    indicies_of_ring.append(index)
            for index in residue:  # written this way because order is important
                atom = self.all_atoms[index]
                if atom.atom_name.strip() == "ND1":
                    indicies_of_ring.append(index)
            for index in residue:  # written this way because order is important
                atom = self.all_atoms[index]
                if atom.atom_name.strip() == "CE1":
                    indicies_of_ring.append(index)
            for index in residue:  # written this way because order is important
                atom = self.all_atoms[index]
                if atom.atom_name.strip() == "NE2":
                    indicies_of_ring.append(index)
            for index in residue:  # written this way because order is important
                atom = self.all_atoms[index]
                if atom.atom_name.strip() == "CD2":
                    indicies_of_ring.append(index)

            self.add_aromatic_marker(indicies_of_ring)

        if real_resname == "TRP":
            indicies_of_ring = []

            for index in residue:  # written this way because order is important
                atom = self.all_atoms[index]
                if atom.atom_name.strip() == "CG":
                    indicies_of_ring.append(index)
            for index in residue:  # written this way because order is important
                atom = self.all_atoms[index]
                if atom.atom_name.strip() == "CD1":
                    indicies_of_ring.append(index)
            for index in residue:  # written this way because order is important
                atom = self.all_atoms[index]
                if atom.atom_name.strip() == "NE1":
                    indicies_of_ring.append(index)
            for index in residue:  # written this way because order is important
                atom = self.all_atoms[index]
                if atom.atom_name.strip() == "CE2":
                    indicies_of_ring.append(index)
            for index in residue:  # written this way because order is important
                atom = self.all_atoms[index]
                if atom.atom_name.strip() == "CD2":
                    indicies_of_ring.append(index)

            self.add_aromatic_marker(indicies_of_ring)

            indicies_of_ring = []

            for index in residue:  # written this way because order is important
                atom = self.all_atoms[index]
                if atom.atom_name.strip() == "CE2":
                    indicies_of_ring.append(index)
            for index in residue:  # written this way because order is important
                atom = self.all_atoms[index]
                if atom.atom_name.strip() == "CD2":
                    indicies_of_ring.append(index)
            for index in residue:  # written this way because order is important
                atom = self.all_atoms[index]
                if atom.atom_name.strip() == "CE3":
                    indicies_of_ring.append(index)
            for index in residue:  # written this way because order is important
                atom = self.all_atoms[index]
                if atom.atom_name.strip() == "CZ3":
                    indicies_of_ring.append(index)
            for index in residue:  # written this way because order is important
                atom = self.all_atoms[index]
                if atom.atom_name.strip() == "CH2":
                    indicies_of_ring.append(index)
            for index in residue:  # written this way because order is important
                atom = self.all_atoms[index]
                if atom.atom_name.strip() == "CZ2":
                    indicies_of_ring.append(index)

            self.add_aromatic_marker(indicies_of_ring)

    # Return true if set one is a subset of set 2
    # Param set1 (set)
    # Param set2 (set)
    def set1_is_subset_of_set2(self, set1, set2):
        is_subset = True
        for item in set1:
            if item not in set2:
                is_subset = False
                break
        return is_subset

    # Return indecies of atoms in ring
    def all_rings_containing_atom(self, index):
        all_rings = []

        atom = self.all_atoms[index]
        for connected_atom in atom.indecies_of_atoms_connecting:
            self.ring_recursive(connected_atom, [index], index, all_rings)

        return all_rings

    def ring_recursive(self, index, already_crossed, orig_atom, all_rings):

        if len(already_crossed) > 6:
            return  # since you're only considering aromatic rings containing 5 or 6 members anyway, save yourself some time.

        atom = self.all_atoms[index]

        temp = already_crossed[:]
        temp.append(index)

        for connected_atom in atom.indecies_of_atoms_connecting:
            if not connected_atom in already_crossed:
                self.ring_recursive(connected_atom, temp, orig_atom, all_rings)

            # if connected_atom == orig_atom and orig_atom != already_crossed[-1]:
            # Cannot have negative indexes in transcrypts
            if (
                connected_atom == orig_atom
                and orig_atom != already_crossed[len(already_crossed) - 1]
            ):
                all_rings.append(temp)

    # Functions to assign secondary structure to protein residues
    # ===========================================================

    def assign_secondary_structure(self):
        # first, we need to know what resid's are available
        resids = []
        last_key = "-99999_Z"
        for atom_index in self.all_atoms.keys():
            atom = self.all_atoms[atom_index]
            key = str(atom.resid) + "_" + atom.chain
            if key != last_key:
                last_key = key
                resids.append(last_key)

        structure = {}
        for resid in resids:
            structure[resid] = "OTHER"

        atoms = []

        for atom_index in self.all_atoms.keys():
            atom = self.all_atoms[atom_index]
            if atom.side_chain_or_backbone() == "BACKBONE":
                if len(atoms) < 8:
                    atoms.append(atom)
                else:
                    atoms.pop(0)
                    atoms.append(atom)

                    # now make sure the first four all have the same resid and
                    # the last four all have the same resid
                    if (
                        atoms[0].resid == atoms[1].resid
                        and atoms[0].resid == atoms[2].resid
                        and atoms[0].resid == atoms[3].resid
                        and atoms[0].resid != atoms[4].resid
                        and atoms[4].resid == atoms[5].resid
                        and atoms[4].resid == atoms[6].resid
                        and atoms[4].resid == atoms[7].resid
                        and atoms[0].resid + 1 == atoms[7].resid
                        and atoms[0].chain == atoms[7].chain
                    ):
                        resid1 = atoms[0].resid
                        resid2 = atoms[7].resid

                        # Now give easier to use names to the atoms
                        for atom in atoms:
                            if atom.resid == resid1 and atom.atom_name.strip() == "N":
                                first_N = atom
                            if atom.resid == resid1 and atom.atom_name.strip() == "C":
                                first_C = atom
                            if atom.resid == resid1 and atom.atom_name.strip() == "CA":
                                first_CA = atom

                            if atom.resid == resid2 and atom.atom_name.strip() == "N":
                                second_N = atom
                            if atom.resid == resid2 and atom.atom_name.strip() == "C":
                                second_C = atom
                            if atom.resid == resid2 and atom.atom_name.strip() == "CA":
                                second_CA = atom

                        # Now compute the phi and psi dihedral angles
                        phi = (
                            dihedral(
                                first_C.coordinates,
                                second_N.coordinates,
                                second_CA.coordinates,
                                second_C.coordinates,
                            )
                            * 180.0
                            / math.pi
                        )
                        psi = (
                            dihedral(
                                first_N.coordinates,
                                first_CA.coordinates,
                                first_C.coordinates,
                                second_N.coordinates,
                            )
                            * 180.0
                            / math.pi
                        )

                        # Now use those angles to determine if it's alpha or
                        # beta
                        if phi > -145 and phi < -35 and psi > -70 and psi < 50:
                            key1 = str(first_C.resid) + "_" + first_C.chain
                            key2 = str(second_C.resid) + "_" + second_C.chain
                            structure[key1] = "ALPHA"
                            structure[key2] = "ALPHA"
                        if (phi >= -180 and phi < -40 and psi <= 180 and psi > 90) or (
                            phi >= -180 and phi < -70 and psi <= -165
                        ):
                            # beta. This gets some loops (by my eye), but it's
                            # the best I could do.
                            key1 = str(first_C.resid) + "_" + first_C.chain
                            key2 = str(second_C.resid) + "_" + second_C.chain
                            structure[key1] = "BETA"
                            structure[key2] = "BETA"

        # Now update each of the atoms with this structural information
        for atom_index in self.all_atoms.keys():
            atom = self.all_atoms[atom_index]
            key = str(atom.resid) + "_" + atom.chain
            atom.structure = structure[key]

        # Some more post processing.
        CA_list = []  # first build a list of the indices of all the alpha carbons
        for atom_index in self.all_atoms.keys():
            atom = self.all_atoms[atom_index]
            if (
                atom.residue.strip() in self.protein_resnames
                and atom.atom_name.strip() == "CA"
            ):
                CA_list.append(atom_index)

        # some more post processing.
        change = True
        while change == True:
            change = False

            # A residue of index i is only going to be in an alpha helix its
            # CA is within 6 A of the CA of the residue i + 3
            for CA_atom_index in CA_list:
                CA_atom = self.all_atoms[CA_atom_index]
                if CA_atom.structure == "ALPHA":  # so it's in an alpha helix
                    another_alpha_is_close = False
                    for (
                        other_CA_atom_index
                    ) in CA_list:  # so now compare that CA to all the other CA's
                        other_CA_atom = self.all_atoms[other_CA_atom_index]
                        if other_CA_atom.structure == "ALPHA":
                            # so it's also in an alpha helix
                            if (
                                other_CA_atom.resid - 3 == CA_atom.resid
                                or other_CA_atom.resid + 3 == CA_atom.resid
                            ):  # so this CA atom is one of the ones the first atom might hydrogen bond with
                                if (
                                    other_CA_atom.coordinates.dist_to(
                                        CA_atom.coordinates
                                    )
                                    < 6.0
                                ):  # so these two CA atoms are close enough together that their residues are probably hydrogen bonded
                                    another_alpha_is_close = True
                                    break
                    if another_alpha_is_close == False:
                        self.set_structure_of_residue(
                            CA_atom.chain, CA_atom.resid, "OTHER"
                        )
                        change = True

            # Alpha helices are only alpha helices if they span at least 4
            # residues (to wrap around and hydrogen bond). I'm going to
            # require them to span at least 5 residues, based on examination
            # of many structures.
            for index_in_list in range(len(CA_list) - 5):

                index_in_pdb1 = CA_list[index_in_list]
                index_in_pdb2 = CA_list[index_in_list + 1]
                index_in_pdb3 = CA_list[index_in_list + 2]
                index_in_pdb4 = CA_list[index_in_list + 3]
                index_in_pdb5 = CA_list[index_in_list + 4]
                index_in_pdb6 = CA_list[index_in_list + 5]

                atom1 = self.all_atoms[index_in_pdb1]
                atom2 = self.all_atoms[index_in_pdb2]
                atom3 = self.all_atoms[index_in_pdb3]
                atom4 = self.all_atoms[index_in_pdb4]
                atom5 = self.all_atoms[index_in_pdb5]
                atom6 = self.all_atoms[index_in_pdb6]

                if (
                    atom1.resid + 1 == atom2.resid
                    and atom2.resid + 1 == atom3.resid
                    and atom3.resid + 1 == atom4.resid
                    and atom4.resid + 1 == atom5.resid
                    and atom5.resid + 1 == atom6.resid
                ):  # so they are sequential

                    if (
                        atom1.structure != "ALPHA"
                        and atom2.structure == "ALPHA"
                        and atom3.structure != "ALPHA"
                    ):
                        self.set_structure_of_residue(atom2.chain, atom2.resid, "OTHER")
                        change = True

                    if (
                        atom2.structure != "ALPHA"
                        and atom3.structure == "ALPHA"
                        and atom4.structure != "ALPHA"
                    ):
                        self.set_structure_of_residue(atom3.chain, atom3.resid, "OTHER")
                        change = True

                    if (
                        atom3.structure != "ALPHA"
                        and atom4.structure == "ALPHA"
                        and atom5.structure != "ALPHA"
                    ):
                        self.set_structure_of_residue(atom4.chain, atom4.resid, "OTHER")
                        change = True

                    if (
                        atom4.structure != "ALPHA"
                        and atom5.structure == "ALPHA"
                        and atom6.structure != "ALPHA"
                    ):
                        self.set_structure_of_residue(atom5.chain, atom5.resid, "OTHER")
                        change = True

                    if (
                        atom1.structure != "ALPHA"
                        and atom2.structure == "ALPHA"
                        and atom3.structure == "ALPHA"
                        and atom4.structure != "ALPHA"
                    ):
                        self.set_structure_of_residue(atom2.chain, atom2.resid, "OTHER")
                        self.set_structure_of_residue(atom3.chain, atom3.resid, "OTHER")
                        change = True

                    if (
                        atom2.structure != "ALPHA"
                        and atom3.structure == "ALPHA"
                        and atom4.structure == "ALPHA"
                        and atom5.structure != "ALPHA"
                    ):
                        self.set_structure_of_residue(atom3.chain, atom3.resid, "OTHER")
                        self.set_structure_of_residue(atom4.chain, atom4.resid, "OTHER")
                        change = True

                    if (
                        atom3.structure != "ALPHA"
                        and atom4.structure == "ALPHA"
                        and atom5.structure == "ALPHA"
                        and atom6.structure != "ALPHA"
                    ):
                        self.set_structure_of_residue(atom4.chain, atom4.resid, "OTHER")
                        self.set_structure_of_residue(atom5.chain, atom5.resid, "OTHER")
                        change = True

                    if (
                        atom1.structure != "ALPHA"
                        and atom2.structure == "ALPHA"
                        and atom3.structure == "ALPHA"
                        and atom4.structure == "ALPHA"
                        and atom5.structure != "ALPHA"
                    ):
                        self.set_structure_of_residue(atom2.chain, atom2.resid, "OTHER")
                        self.set_structure_of_residue(atom3.chain, atom3.resid, "OTHER")
                        self.set_structure_of_residue(atom4.chain, atom4.resid, "OTHER")
                        change = True

                    if (
                        atom2.structure != "ALPHA"
                        and atom3.structure == "ALPHA"
                        and atom4.structure == "ALPHA"
                        and atom5.structure == "ALPHA"
                        and atom6.structure != "ALPHA"
                    ):
                        self.set_structure_of_residue(atom3.chain, atom3.resid, "OTHER")
                        self.set_structure_of_residue(atom4.chain, atom4.resid, "OTHER")
                        self.set_structure_of_residue(atom5.chain, atom5.resid, "OTHER")
                        change = True

                    if (
                        atom1.structure != "ALPHA"
                        and atom2.structure == "ALPHA"
                        and atom3.structure == "ALPHA"
                        and atom4.structure == "ALPHA"
                        and atom5.structure == "ALPHA"
                        and atom6.structure != "ALPHA"
                    ):
                        self.set_structure_of_residue(atom2.chain, atom2.resid, "OTHER")
                        self.set_structure_of_residue(atom3.chain, atom3.resid, "OTHER")
                        self.set_structure_of_residue(atom4.chain, atom4.resid, "OTHER")
                        self.set_structure_of_residue(atom5.chain, atom5.resid, "OTHER")
                        change = True

            # now go through each of the BETA CA atoms. A residue is only
            # going to be called a beta sheet if CA atom is within 6.0 A of
            # another CA beta, same chain, but index difference > 2.
            for CA_atom_index in CA_list:
                CA_atom = self.all_atoms[CA_atom_index]
                if CA_atom.structure == "BETA":  # so it's in a beta sheet
                    another_beta_is_close = False
                    for other_CA_atom_index in CA_list:
                        if other_CA_atom_index != CA_atom_index:
                            # so not comparing an atom to itself
                            other_CA_atom = self.all_atoms[other_CA_atom_index]
                            if other_CA_atom.structure == "BETA":
                                # so you're comparing it only to other
                                # BETA-sheet atoms
                                if other_CA_atom.chain == CA_atom.chain:
                                    # so require them to be on the same chain.
                                    # needed to indecies can be fairly
                                    # compared
                                    if fabs(other_CA_atom.resid - CA_atom.resid) > 2:
                                        # so the two residues are not simply
                                        # adjacent to each other on the chain
                                        if (
                                            CA_atom.coordinates.dist_to(
                                                other_CA_atom.coordinates
                                            )
                                            < 6.0
                                        ):
                                            # so these to atoms are close to
                                            # each other
                                            another_beta_is_close = True
                                            break

                    if another_beta_is_close == False:
                        self.set_structure_of_residue(
                            CA_atom.chain, CA_atom.resid, "OTHER"
                        )
                        change = True

            # Now some more post-processing needs to be done. Do this again to
            # clear up mess that may have just been created (single residue
            # beta strand, for example) Beta sheets are usually at least 3
            # residues long

            for index_in_list in range(len(CA_list) - 3):

                index_in_pdb1 = CA_list[index_in_list]
                index_in_pdb2 = CA_list[index_in_list + 1]
                index_in_pdb3 = CA_list[index_in_list + 2]
                index_in_pdb4 = CA_list[index_in_list + 3]

                atom1 = self.all_atoms[index_in_pdb1]
                atom2 = self.all_atoms[index_in_pdb2]
                atom3 = self.all_atoms[index_in_pdb3]
                atom4 = self.all_atoms[index_in_pdb4]

                if (
                    atom1.resid + 1 == atom2.resid
                    and atom2.resid + 1 == atom3.resid
                    and atom3.resid + 1 == atom4.resid
                ):  # so they are sequential

                    if (
                        atom1.structure != "BETA"
                        and atom2.structure == "BETA"
                        and atom3.structure != "BETA"
                    ):
                        self.set_structure_of_residue(atom2.chain, atom2.resid, "OTHER")
                        change = True

                    if (
                        atom2.structure != "BETA"
                        and atom3.structure == "BETA"
                        and atom4.structure != "BETA"
                    ):
                        self.set_structure_of_residue(atom3.chain, atom3.resid, "OTHER")
                        change = True

                    if (
                        atom1.structure != "BETA"
                        and atom2.structure == "BETA"
                        and atom3.structure == "BETA"
                        and atom4.structure != "BETA"
                    ):
                        self.set_structure_of_residue(atom2.chain, atom2.resid, "OTHER")
                        self.set_structure_of_residue(atom3.chain, atom3.resid, "OTHER")
                        change = True

    def set_structure_of_residue(self, chain, resid, structure):
        for atom_index in self.all_atoms.keys():
            atom = self.all_atoms[atom_index]
            if atom.chain == chain and atom.resid == resid:
                atom.structure = structure
