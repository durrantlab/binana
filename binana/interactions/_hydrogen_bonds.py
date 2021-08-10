# This file is part of BINANA, released under the Apache 2.0 License. See
# LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
# details. Copyright 2020 Jacob D. Durrant.

from binana._utils.shim import _set_default
from binana.interactions.default_params import (
    HYDROGEN_BOND_ANGLE_CUTOFF,
    HYDROGEN_BOND_DIST_CUTOFF,
)
import binana
from binana.load_ligand_receptor import _get_ligand_receptor_dists
from binana._utils.utils import hashtable_entry_add_one, list_alphebetize_and_combine
from binana._structure.mol import Mol
from binana._utils._math_functions import angle_between_three_points

import __future__

import math

# __pragma__ ('skip')
# Python
from math import fabs

# __pragma__ ('noskip')

"""?
# Transcrypt
from binana._utils.shim import fabs
?"""

# Be sure to update the corresponding function in
# binana.interactions.__init__.py as well!


def get_hydrogen_bonds(
    ligand,
    receptor,
    dist_cutoff=None,
    angle_cutoff=None,
):
    """Identifies and counts the number of hydrogen bonds between the protein
    and ligand. Output is formatted like this::

        {
            'counts': {
                'HDONOR_RECEPTOR_SIDECHAIN_OTHER': 1,
                'HDONOR_LIGAND_SIDECHAIN_OTHER': 2
            },
            'labels': [
                ('A:CHT(1):N1(14)', 'A:CHT(1):H1(16)', 'A:ASP(157):OD2(285)', 'LIGAND'),
                ('A:CHT(1):O6(22)', 'A:ASN(156):2HD2(276)', 'A:ASN(156):ND2(274)', 'RECEPTOR'),
                ('A:CHT(1):O6(22)', 'A:CHT(1):HO6(23)', 'A:ASP(157):OD1(284)', 'LIGAND')
            ],
            'mol': <binana._structure.mol.Mol instance at 0x7feb20478518>
        }

    Args:
        ligand (binana._structure.mol.Mol): The ligand molecule to analyze.
        receptor (binana._structure.mol.Mol): The receptor molecule to analyze.
        dist_cutoff (float, optional): The distance cutoff. Defaults to
            HYDROGEN_BOND_DIST_CUTOFF.
        angle_cutoff (float, optional): The angle cutoff. Defaults to
            HYDROGEN_BOND_ANGLE_CUTOFF.

    Returns:
        dict: Contains the atom tallies ("counts"), a binana._structure.mol.Mol
        object with the participating atoms ("mol"), and the labels to use in
        the log file ("labels").
    """

    dist_cutoff = _set_default(dist_cutoff, HYDROGEN_BOND_DIST_CUTOFF)
    angle_cutoff = _set_default(angle_cutoff, HYDROGEN_BOND_ANGLE_CUTOFF)

    hbonds = {}
    pdb_hbonds = Mol()
    hbonds_labels = []

    # Calculate the distances.
    ligand_receptor_dists = _get_ligand_receptor_dists(ligand, receptor)

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
                        - angle_between_three_points(
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
