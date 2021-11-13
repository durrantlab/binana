# This file is part of BINANA, released under the Apache 2.0 License. See
# LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
# details. Copyright 2020 Jacob D. Durrant.

from binana._utils.shim import _set_default
from binana.interactions.default_params import (
    HYDROGEN_HALOGEN_BOND_ANGLE_CUTOFF,
    HYDROGEN_HALOGEN_BOND_DIST_CUTOFF,
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


def _get_potential_donors_acceptors(ligand, receptor, dist_cutoff):
    # Any that are close to each other (not considering orientation yet).

    # Calculate the distances.
    ligand_receptor_dists = _get_ligand_receptor_dists(ligand, receptor, dist_cutoff, ["O", "N"])

    return [
        [ligand_atom, receptor_atom]
        for ligand_atom, receptor_atom, dist in ligand_receptor_dists
    ]


def _update_mol_and_data(
    pdb_hbonds,
    hbonds,
    hbonds_labels,
    lig_donor_or_accept,
    receptor_atom,
    ligand_atom,
    center_atom,
):
    comment = "RECEPTOR" if lig_donor_or_accept == "ACCEPTOR" else "LIGAND"

    hbonds_key = (
        "HDONOR_"
        + comment
        + "_"
        + receptor_atom.side_chain_or_backbone()
        + "_"
        + receptor_atom.structure
    )

    pdb_hbonds.add_new_atom(ligand_atom.copy_of())
    pdb_hbonds.add_new_atom(center_atom.copy_of())
    pdb_hbonds.add_new_atom(receptor_atom.copy_of())
    hashtable_entry_add_one(hbonds, hbonds_key)

    hbonds_labels.append(
        (
            ligand_atom.string_id(),
            center_atom.string_id(),
            receptor_atom.string_id(),
            comment,
        )
    )


def _product(lst1, lst2):
    # Below because I had problems compiling itertools.product using
    # transcrypt.
    combos = []
    for l1 in lst1:
        for l2 in lst2:
            combos.append([l1, l2])
    # combos = product(lig_atm_hbond_infs, recep_atm_hbond_infs)
    return combos


def get_hydrogen_or_halogen_bonds(
    ligand, receptor, dist_cutoff=None, angle_cutoff=None, hydrogen_bond=True
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
            HYDROGEN_HALOGEN_BOND_DIST_CUTOFF.
        angle_cutoff (float, optional): The angle cutoff. Defaults to
            HYDROGEN_HALOGEN_BOND_ANGLE_CUTOFF.
        hydrogen_bond (boolean, optional): If True, calculates hydrogen bonds.
            Otherwise, calculates halogen bonds. Defaults to True.

    Returns:
        dict: Contains the atom tallies ("counts"), a binana._structure.mol.Mol
        object with the participating atoms ("mol"), and the labels to use in
        the log file ("labels").
    """

    hbonds = {}
    pdb_hbonds = Mol()
    hbonds_labels = []

    dist_cutoff = _set_default(dist_cutoff, HYDROGEN_HALOGEN_BOND_DIST_CUTOFF)
    angle_cutoff = _set_default(angle_cutoff, HYDROGEN_HALOGEN_BOND_ANGLE_CUTOFF)

    # Check if hydrogen atoms added.
    lig_and_recep_have_hydrogens = ligand.has_hydrogens and receptor.has_hydrogens
    
    # Get all donor-acceptor pairs that are near each other.
    close_donors_acceptors = _get_potential_donors_acceptors(
        ligand, receptor, dist_cutoff
    )

    # Go through those pairs and find ones with complementary receptor/ligand
    # labels.
    for ligand_atom, receptor_atom in close_donors_acceptors:
        # hbond_detected = False
        lig_atm_hbond_infs = ligand.is_hbond_donor_acceptor(ligand_atom, hydrogen_bond)
        recep_atm_hbond_infs = receptor.is_hbond_donor_acceptor(
            receptor_atom, hydrogen_bond
        )

        combos = _product(lig_atm_hbond_infs, recep_atm_hbond_infs)
        for lig_atm_hbond_inf, recep_atm_hbond_inf in combos:
            lig_donor_or_accept, lig_center_atom = lig_atm_hbond_inf
            recep_donor_or_accept, accept_center_atom = recep_atm_hbond_inf

            if lig_donor_or_accept == recep_donor_or_accept:
                # Both acceptors or both donors. Doesn't work.
                continue

            center_atom = (
                lig_center_atom
                if lig_donor_or_accept == "DONOR"
                else accept_center_atom
            )

            # Now that you've got the atoms, check the angles if appropriate.
            if lig_and_recep_have_hydrogens or not hydrogen_bond:
                # Hydrogens present and you're detecting hydrogen bonds, or
                # you're detecting halogen bonds (so hydrogens don't matter).

                angle = angle_between_three_points(
                    ligand_atom.coordinates,
                    center_atom.coordinates,
                    receptor_atom.coordinates,
                )

                if fabs(180 - angle * 180.0 / math.pi) > angle_cutoff:
                    # Angle is too big.
                    continue

            # Now collect that data.
            _update_mol_and_data(
                pdb_hbonds,
                hbonds,
                hbonds_labels,
                lig_donor_or_accept,
                receptor_atom,
                ligand_atom,
                center_atom,
            )

            # If you get here, it's identified a hydrogen bond. No need to keep
            # checking for a hydrogen bond between these two atoms.
            break

    return {
        "counts": hbonds,
        "mol": pdb_hbonds,
        "labels": hbonds_labels,
    }
