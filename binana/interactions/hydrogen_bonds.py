from binana.cli_params.defaults import (
    HYDROGEN_BOND_ANGLE_CUTOFF,
    HYDROGEN_BOND_DIST_CUTOFF,
)
import binana
from binana.load import get_ligand_receptor_dists
from binana.utils import hashtable_entry_add_one, list_alphebetize_and_combine

import __future__

import math

# __pragma__ ('skip')
# Python
import os
import textwrap
import sys
from math import fabs

# __pragma__ ('noskip')

"""?
# Transcrypt
os = binana.os
textwrap = binana.shim
sys = binana.sys
from binana.shim import fabs
?"""


def calculate_hydrogen_bonds(
    ligand,
    receptor,
    dist_cutoff=HYDROGEN_BOND_DIST_CUTOFF,
    angle_cutoff=HYDROGEN_BOND_ANGLE_CUTOFF,
):
    hbonds = {}
    pdb_hbonds = binana.Mol()
    hbonds_labels = []

    # Calculate the distances.
    ligand_receptor_dists = get_ligand_receptor_dists(ligand, receptor)

    # Now see if there's some sort of hydrogen bond between
    # these two atoms. distance cutoff = 4, angle cutoff = 40.
    # Note that this is liberal.
    for ligand_atom, receptor_atom, dist in ligand_receptor_dists:
        if (
            dist < dist_cutoff
            and (ligand_atom.element == "O" or ligand_atom.element == "N")
            and (receptor_atom.element == "O" or receptor_atom.element == "N")
        ):
            # now build a list of all the hydrogens close to these
            # atoms
            hydrogens = []

            for atm_index in ligand.all_atoms.keys():
                if ligand.all_atoms[atm_index].element == "H" and (
                    ligand.all_atoms[atm_index].coordinates.dist_to(
                        ligand_atom.coordinates
                    )
                    < 1.3
                ):
                    # so it's a hydrogen
                    # O-H distance is 0.96 A, N-H is 1.01 A.
                    # See
                    # http://www.science.uwaterloo.ca/~cchieh/cact/c120/bondel.html
                    ligand.all_atoms[atm_index].comment = "LIGAND"
                    hydrogens.append(ligand.all_atoms[atm_index])

            for atm_index in receptor.all_atoms.keys():
                if receptor.all_atoms[atm_index].element == "H" and (
                    receptor.all_atoms[atm_index].coordinates.dist_to(
                        receptor_atom.coordinates
                    )
                    < 1.3
                ):
                    # so it's a hydrogen
                    # O-H distance is 0.96 A, N-H is 1.01 A.
                    # See
                    # http://www.science.uwaterloo.ca/~cchieh/cact/c120/bondel.html
                    receptor.all_atoms[atm_index].comment = "RECEPTOR"
                    hydrogens.append(receptor.all_atoms[atm_index])

            # now we need to check the angles
            for hydrogen in hydrogens:
                if (
                    fabs(
                        180
                        - binana.mathfuncs.angle_between_three_points(
                            ligand_atom.coordinates,
                            hydrogen.coordinates,
                            receptor_atom.coordinates,
                        )
                        * 180.0
                        / math.pi
                    )
                    <= angle_cutoff
                ):
                    hbonds_key = (
                        "HDONOR_"
                        + hydrogen.comment
                        + "_"
                        + receptor_atom.side_chain_or_backbone()
                        + "_"
                        + receptor_atom.structure
                    )
                    pdb_hbonds.add_new_atom(ligand_atom.copy_of())
                    pdb_hbonds.add_new_atom(hydrogen.copy_of())
                    pdb_hbonds.add_new_atom(receptor_atom.copy_of())
                    hashtable_entry_add_one(hbonds, hbonds_key)

                    hbonds_labels.append(
                        (
                            ligand_atom.string_id(),
                            hydrogen.string_id(),
                            receptor_atom.string_id(),
                            hydrogen.comment,
                        )
                    )
    return {
        "counts": hbonds,
        "mol": pdb_hbonds,
        "labels": hbonds_labels,
    }
