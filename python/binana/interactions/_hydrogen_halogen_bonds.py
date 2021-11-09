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

# # O-H distance is 0.96 A, N-H is 1.01 A. See
# # http://www.science.uwaterloo.ca/~cchieh/cact/c120/bondel.html
# _max_donor_X_dist = {
#     "H": 1.3,
#     "I": 2.04 * 1.4,  # O-I: 2.04 per avogadro
#     "BR": 1.86 * 1.4,  # O-Br: 1.86
#     "Br": 1.86 * 1.4,
#     "CL": 1.71 * 1.4,  # O-Cl: 1.71
#     "Cl": 1.71 * 1.4,
#     "F": 1.33 * 1.4,  # O-F: 1.33
# }


# # def _mimic_set_minus(set1, set2):
# #     for s1 in set1:
# #         while s1 in set2:
# #             set2.remove(s1)
# #     return set2


# def _detect_hydrogen_bonds_without_hydrogens(close_donors_acceptors, ligand, receptor):
#     # In case the user has not added hydrogen bonds to their structures. Not as
#     # accurate.

#     hbonds = {}
#     pdb_hbonds = Mol()
#     hbonds_labels = []

#     for lig_atm, recep_atm in close_donors_acceptors:
#         lig_categories = ligand._categorize_donor_acceptor_without_hydrogens(lig_atm)
#         recep_categories = receptor._categorize_donor_acceptor_without_hydrogens(
#             recep_atm
#         )

#         if len(lig_categories) < len(recep_categories):
#             recep_categories = _mimic_set_minus(lig_categories, recep_categories)
#             # Note that transcrypt doesn't support set subtraction.
#             # recep_categories = recep_categories - lig_categories

#         if len(recep_categories) < len(lig_categories):
#             lig_categories = _mimic_set_minus(recep_categories, lig_categories)
#             # lig_categories = lig_categories - recep_categories

#         # If below occurs, there can't be donor-acceptor pair
#         if len(lig_categories) == 0:
#             continue
#         if len(recep_categories) == 0:
#             continue

#         if len(lig_categories) > 0 and len(recep_categories) > 0:
#             # They could be complementary (donor-acceptor), but they could also
#             # both be donor or both be acceptor.

#             # Pick first lig one (in case there are many)
#             lig_category = list(lig_categories)[0]

#             # Remove that one from recep options.
#             recep_categories = _mimic_set_minus([lig_category], recep_categories)

#             if len(recep_categories) == 0:
#                 # There are no complementary donor-acceptor pairs.
#                 continue

#             # Pick first of remaining receptor ones
#             recep_category = list(recep_categories)[0]

#             # *****

#             comment = "RECEPTOR" if lig_category == "ACCEPTOR" else "LIGAND"

#             hbonds_key = (
#                 "HDONOR_"
#                 + comment
#                 + "_"
#                 + recep_atm.side_chain_or_backbone()
#                 + "_"
#                 + recep_atm.structure
#             )

#             pdb_hbonds.add_new_atom(lig_atm.copy_of())
#             pdb_hbonds.add_new_atom(recep_atm.copy_of())
#             hashtable_entry_add_one(hbonds, hbonds_key)

#             hbonds_labels.append(
#                 (
#                     lig_atm.string_id(),
#                     # There is no middle hydrogen in this case, so just repeat
#                     # one of the heteroatoms.
#                     lig_atm.string_id()
#                     if comment == "LIGAND"
#                     else recep_atm.string_id(),
#                     recep_atm.string_id(),
#                     comment,
#                 )
#             )

#     return hbonds, pdb_hbonds, hbonds_labels


# def _detect_hbonds_by_angle(
#     close_donors_acceptors, ligand, receptor, angle_cutoff, hydrogen_bond
# ):
#     # Use this function if detecting halogen bonds or hydrogen bonds when the
#     # models both include hydrogen atoms.

#     hbonds = {}
#     pdb_hbonds = Mol()
#     hbonds_labels = []

#     central_atom_names = ["H"] if hydrogen_bond else ["I", "BR", "Br", "CL", "Cl", "F"]

#     # Now see if there's some sort of hydrogen (or halogen) bond between these
#     # two atoms. default distance cutoff = 4, angle cutoff = 40. Note that these
#     # cutoffs are generous.
#     for lig_atm, recep_atm in close_donors_acceptors:
#         # now build a list of all the hydrogens (or halogens) close to these
#         # atoms
#         h_or_hal = []

#         for mol, hetero_atom, lbl in [
#             [ligand, lig_atm, "LIGAND"],
#             [receptor, recep_atm, "RECEPTOR"],
#         ]:
#             for atm_index in mol.all_atoms.keys():
#                 central_atom = mol.all_atoms[atm_index]
#                 element = central_atom.element
#                 if element in central_atom_names:
#                     # so it's a hydrogen (or halogen)
#                     dist = central_atom.coordinates.dist_to(hetero_atom.coordinates)
#                     if dist < _max_donor_X_dist[element]:  # 1.3 for H
#                         central_atom.comment = lbl
#                         h_or_hal.append(central_atom)

#         # now we need to check the angles
#         for center_atm in h_or_hal:
#             angle = angle_between_three_points(
#                 lig_atm.coordinates,
#                 center_atm.coordinates,
#                 recep_atm.coordinates,
#             )

#             if fabs(180 - angle * 180.0 / math.pi) > angle_cutoff:
#                 # Angle is too big.
#                 continue

#             # If you get here, angle is ok.
#             hbonds_key = (
#                 "HDONOR_"
#                 + center_atm.comment
#                 + "_"
#                 + recep_atm.side_chain_or_backbone()
#                 + "_"
#                 + recep_atm.structure
#             )
#             pdb_hbonds.add_new_atom(lig_atm.copy_of())
#             pdb_hbonds.add_new_atom(center_atm.copy_of())
#             pdb_hbonds.add_new_atom(recep_atm.copy_of())
#             hashtable_entry_add_one(hbonds, hbonds_key)

#             hbonds_labels.append(
#                 (
#                     lig_atm.string_id(),
#                     center_atm.string_id(),
#                     recep_atm.string_id(),
#                     center_atm.comment,
#                 )
#             )

#     return hbonds, pdb_hbonds, hbonds_labels


def _mimic_set_minus(set1, set2):
    for s2 in set2:
        set1 = [s for s in set1 if s[0] != s2[0]]
    return set1


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

    # Calculate the distances.
    ligand_receptor_dists = _get_ligand_receptor_dists(ligand, receptor)

    # Get all donor-acceptor pairs that are near each other.
    close_donors_acceptors = [
        [ligand_atom, receptor_atom]
        for ligand_atom, receptor_atom, dist in ligand_receptor_dists
        if (
            dist < dist_cutoff
            and ligand_atom.element in ["O", "N"]
            and receptor_atom.element in ["O", "N"]
        )
    ]

    # Go through those pairs and find ones with complementary receptor/ligand
    # labels.
    for ligand_atom, receptor_atom in close_donors_acceptors:
        hbond_detected = False
        lig_atm_hbond_infs = ligand.is_hbond_donor_acceptor(ligand_atom, hydrogen_bond)
        recep_atm_hbond_infs = receptor.is_hbond_donor_acceptor(
            receptor_atom, hydrogen_bond
        )

        # print(
        #     "Note that above codewasworking before refactoring. Can always try restoring if you can't fix below."
        # )

        # print(
        #     "This whole process of winnowing down acceptable donor-acceptor pairs is falwed. You need to combinatorial check them all, especially since angles can be used to eliminate them in some cases."
        # )

        for lig_atm_hbond_inf in lig_atm_hbond_infs:
            if hbond_detected:
                break

            lig_donor_or_accept, lig_center_atom = lig_atm_hbond_inf
            for recep_atm_hbond_inf in recep_atm_hbond_infs:
                accept_donor_or_accept, accept_center_atom = recep_atm_hbond_inf

                if lig_donor_or_accept == accept_donor_or_accept:
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
                    # you're detecting halogen bonds (so hydrogens don't
                    # matter).

                    angle = angle_between_three_points(
                        ligand_atom.coordinates,
                        center_atom.coordinates,
                        receptor_atom.coordinates,
                    )

                    if fabs(180 - angle * 180.0 / math.pi) > angle_cutoff:
                        # Angle is too big.
                        continue

                # Now collect that data.
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

                # If you get here, it's identified a hydrogen bond. No need to
                # keep checking for a hydrogen bond between these two atoms.
                hbond_detected = True
                break

        # if len(lig_atm_hbond_infs) < len(recep_atm_hbond_infs):
        #     recep_atm_hbond_infs = _mimic_set_minus(
        #         recep_atm_hbond_infs, lig_atm_hbond_infs
        #     )
        #     # Note that transcrypt doesn't support set subtraction.
        #     # recep_atm_hbond_inf = recep_atm_hbond_inf - lig_atm_hbond_inf

        # if len(recep_atm_hbond_infs) < len(lig_atm_hbond_infs):
        #     lig_atm_hbond_infs = _mimic_set_minus(
        #         lig_atm_hbond_infs, recep_atm_hbond_infs
        #     )
        #     # lig_atm_hbond_inf = lig_atm_hbond_inf - recep_atm_hbond_inf

        # # If below occurs, there can't be donor-acceptor pair
        # if len(lig_atm_hbond_infs) == 0:
        #     continue
        # if len(recep_atm_hbond_infs) == 0:
        #     continue

        # if len(lig_atm_hbond_infs) > 0 and len(recep_atm_hbond_infs) > 0:
        #     # They could be complementary (donor-acceptor), but they could also
        #     # both be donor or both be acceptor.

        #     # Pick first lig one (in case there are many)
        #     lig_category = lig_atm_hbond_infs[0]

        #     # Remove that one from recep options.
        #     recep_atm_hbond_infs = _mimic_set_minus(
        #         recep_atm_hbond_infs, [lig_category]
        #     )

        #     if len(recep_atm_hbond_infs) == 0:
        #         # There are no complementary donor-acceptor pairs.
        #         continue

        #     # Pick first of remaining receptor ones
        #     recep_category = recep_atm_hbond_infs[0]

        #     # print(
        #     #     "Should therebe mutliple center atoms, and you need to pick between them?"
        #     # )

        #     center_atom = (
        #         recep_category[1] if lig_category[0] == "ACCEPTOR" else lig_category[1]
        #     )

        #     # Now that you've got the atoms, check the angles if appropriate.
        #     # TODO: Conditional
        #     angle = angle_between_three_points(
        #         ligand_atom.coordinates,
        #         center_atom.coordinates,
        #         receptor_atom.coordinates,
        #     )

        #     if fabs(180 - angle * 180.0 / math.pi) > angle_cutoff:
        #         # Angle is too big.
        #         continue

        #     # Now collect that data.
        #     comment = "RECEPTOR" if lig_category[0] == "ACCEPTOR" else "LIGAND"

        #     hbonds_key = (
        #         "HDONOR_"
        #         + comment
        #         + "_"
        #         + receptor_atom.side_chain_or_backbone()
        #         + "_"
        #         + receptor_atom.structure
        #     )

        #     pdb_hbonds.add_new_atom(ligand_atom.copy_of())
        #     pdb_hbonds.add_new_atom(center_atom.copy_of())
        #     pdb_hbonds.add_new_atom(receptor_atom.copy_of())
        #     hashtable_entry_add_one(hbonds, hbonds_key)

        #     # import pdb; pdb.set_trace()

        #     hbonds_labels.append(
        #         (
        #             ligand_atom.string_id(),
        #             center_atom.string_id(),
        #             receptor_atom.string_id(),
        #             comment,
        #         )
        #     )

    # if not hydrogen_bond or (ligand.has_hydrogens and receptor.has_hydrogens):
    #     hbonds, pdb_hbonds, hbonds_labels = _detect_hbonds_by_angle(
    #         close_donors_acceptors, ligand, receptor, angle_cutoff, hydrogen_bond
    #     )
    # else:
    #     hbonds, pdb_hbonds, hbonds_labels = _detect_hydrogen_bonds_without_hydrogens(
    #         close_donors_acceptors, ligand, receptor
    #     )

    return {
        "counts": hbonds,
        "mol": pdb_hbonds,
        "labels": hbonds_labels,
    }
