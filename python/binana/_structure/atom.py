# This file is part of BINANA, released under the Apache 2.0 License. See
# LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
# details. Copyright 2020 Jacob D. Durrant.

# this file contains the Atom class for binana.py

import binana
from binana._structure.point import Point
from binana._utils.shim import r_just, round_to_thousandths_to_str

"""
Class Atom defines an atom
"""


class Atom:
    # Initilaize an atom
    def __init__(self):
        self.atom_name = ""
        self.residue = ""
        self.coordinates = Point(99999, 99999, 99999)
        self.element = ""
        self.pdb_index = ""
        self.line = ""
        self.atom_type = ""
        self.indecies_of_atoms_connecting = []
        self.charge = 0
        self.resid = 0
        self.chain = ""
        self.structure = ""
        self.comment = ""

    # Returns a copy of an atom
    # Param self (Atom): atom to be copied
    def copy_of(self):
        theatom = Atom()
        theatom.atom_name = self.atom_name
        theatom.residue = self.residue
        theatom.coordinates = self.coordinates.copy_of()
        theatom.element = self.element
        theatom.pdb_index = self.pdb_index
        theatom.line = self.line
        theatom.atom_type = self.atom_type
        theatom.indecies_of_atoms_connecting = self.indecies_of_atoms_connecting[:]
        theatom.charge = self.charge
        theatom.resid = self.resid
        theatom.chain = self.chain
        theatom.structure = self.structure
        theatom.comment = self.comment

        return theatom

    # Returns a string identifying/describing the atom
    # Param self (Atom)
    def string_id(self):
        to_return = ""
        if self.chain.strip() != "":
            to_return = to_return + self.chain.strip() + ":"
        to_return = (
            to_return
            + self.residue.strip()
            + "("
            + str(self.resid)
            + "):"
            + self.atom_name.strip()
            + "("
            + str(self.pdb_index)
            + ")"
        )
        return to_return

    # Returns a PDB line for the atom
    # Param self (Atom)
    # Param index (integer): index of the point
    def create_pdb_line(self, index):
        output = "ATOM "
        output = (
            output
            + r_just(str(index), 6)
            + r_just(self.atom_name, 5)
            + r_just(self.residue, 4)
        )

        output = output + r_just(round_to_thousandths_to_str(self.coordinates.x), 18)
        output = output + r_just(round_to_thousandths_to_str(self.coordinates.y), 8)
        output = output + r_just(round_to_thousandths_to_str(self.coordinates.z), 8)
        output = output + r_just(self.element, 24)
        return output

    # Returns the number of an atom's nearest neighbors
    # Param self (Atom)
    def number_of_neighbors(self):
        return len(self.indecies_of_atoms_connecting)

    # Adds the index of an atom's neibor to the list of connecting atoms
    # Param self (Atom)
    # Param index (float): index of atom to be added
    def add_neighbor_atom_index(self, index):
        if not (index in self.indecies_of_atoms_connecting):
            self.indecies_of_atoms_connecting.append(index)

    # Returns whether the atom is part of the backbone or a sidechain
    # Only really applies to proteins, assuming standard atom names
    # Param self (Atom)
    def side_chain_or_backbone(self):
        if (
            self.atom_name.strip() == "CA"
            or self.atom_name.strip() == "C"
            or self.atom_name.strip() == "O"
            or self.atom_name.strip() == "N"
        ):
            return "BACKBONE"
        else:
            return "SIDECHAIN"

    # Reads name of atom in from a PDB line
    # Param self (Atom)
    # Param line (string): PDB line
    def read_pdb_line(self, line):
        self.line = line
        self.atom_name = line[11:16].strip()
        # Read atom name
        if len(self.atom_name) == 1:
            self.atom_name = self.atom_name + "  "
        elif len(self.atom_name) == 2:
            self.atom_name = self.atom_name + " "
        elif len(self.atom_name) == 3:
            # This line is necessary for babel to work, though many PDBs in
            # the PDB would have this line commented out
            self.atom_name = self.atom_name + " "

        self.coordinates = Point(
            float(line[30:38]), float(line[38:46]), float(line[46:54])
        )

        # Now read in atom type (for pdbqt)
        self.atom_type = line[77:79].strip().upper()

        # Read the atom's charge
        if line[69:76].strip() != "":
            self.charge = float(line[69:76])
        else:
            self.charge = 0.0

        # Try to guess at element from name
        if self.element == "":
            two_letters = self.atom_name[0:2].strip().upper()
            if two_letters == "BR":
                self.element = "BR"
            elif two_letters == "CL":
                self.element = "CL"
            elif two_letters == "BI":
                self.element = "BI"
            elif two_letters == "AS":
                self.element = "AS"
            elif two_letters == "AG":
                self.element = "AG"
            elif two_letters == "LI":
                self.element = "LI"
            # elif two_letters=='HG':
            #    self.element='HG'
            elif two_letters == "MG":
                self.element = "MG"
            elif two_letters == "MN":
                self.element = "MN"
            elif two_letters == "RH":
                self.element = "RH"
            elif two_letters == "ZN":
                self.element = "ZN"
            elif two_letters == "FE":
                self.element = "FE"
            else:
                # So, just assume it's the first letter. Any number needs to
                # be removed from the element name
                self.element = self.atom_name
                self.element = self.element.replace("0", "")
                self.element = self.element.replace("1", "")
                self.element = self.element.replace("2", "")
                self.element = self.element.replace("3", "")
                self.element = self.element.replace("4", "")
                self.element = self.element.replace("5", "")
                self.element = self.element.replace("6", "")
                self.element = self.element.replace("7", "")
                self.element = self.element.replace("8", "")
                self.element = self.element.replace("9", "")
                self.element = self.element.replace("@", "")

                self.element = self.element[0:1].strip().upper()

        self.pdb_index = line[6:12].strip()
        self.residue = line[16:20]
        # This only uses the rightmost three characters, essentially removing
        # unique rotamer identification
        self.residue = " " + self.residue[-3:]

        # It's possible the pdbqt might not have any resid entries.
        try:
            self.resid = int(line[23:26])
        except:
            pass

        self.chain = line[21:22]
        if self.chain == " ":
            self.chain = "X"

        if self.residue.strip() == "":
            self.residue = " MOL"
