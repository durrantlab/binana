from binana.cli_params.defaults import PI_PADDING_DIST, PI_PI_INTERACTING_DIST_CUTOFF, PI_STACKING_ANGLE_TOLERANCE, T_STACKING_ANGLE_TOLERANCE, T_STACKING_CLOSEST_DIST_CUTOFF
import binana
from binana.load import get_ligand_receptor_aromatic_dists, get_ligand_receptor_dists
from binana.utils import hashtable_entry_add_one, list_alphebetize_and_combine

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


def t_stacking(
    ligand,
    receptor,
    ligand_aromatic,
    receptor_aromatic,
    angle_between_planes,
    t_stacking_angle_tol,
    t_stacking_closest_dist_cutoff,
    pi_padding,
    pi_pi_interactions,
    pdb_pi_t,
    t_stacking_labels,
):
    if (
        fabs(angle_between_planes - 90) < t_stacking_angle_tol
        or fabs(angle_between_planes - 270) < t_stacking_angle_tol
    ):
        # so they're more or less perpendicular, it's probably a pi-edge
        # interaction

        # having looked at many structures, I noticed the algorithm was
        # identifying T-pi reactions when the two rings were in fact quite
        # distant, often with other atoms in between. Eye-balling it, requiring
        # that at their closest they be at least 5 A apart seems to separate the
        # good T's from the bad
        min_dist = 100.0
        for ligand_ind in ligand_aromatic.indices:
            ligand_at = ligand.all_atoms[ligand_ind]
            for receptor_ind in receptor_aromatic.indices:
                receptor_at = receptor.all_atoms[receptor_ind]
                dist = ligand_at.coordinates.dist_to(receptor_at.coordinates)
                if dist < min_dist:
                    min_dist = dist

        if min_dist <= t_stacking_closest_dist_cutoff:
            # so at their closest points, the two rings come within 5 A of each
            # other.

            # okay, is the ligand pi pointing into the receptor pi, or the other
            # way around? first, project the center of the ligand pi onto the
            # plane of the receptor pi, and vs. versa

            # This could be directional somehow, like a hydrogen bond.

            pt_on_receptor_plane = binana.mathfuncs.project_point_onto_plane(
                ligand_aromatic.center, receptor_aromatic.plane_coeff
            )
            pt_on_lignad_plane = binana.mathfuncs.project_point_onto_plane(
                receptor_aromatic.center, ligand_aromatic.plane_coeff
            )

            # now, if it's a true pi-T interaction, this projected point should
            # fall within the ring whose plane it's been projected into.
            if (
                pt_on_receptor_plane.dist_to(receptor_aromatic.center)
                <= receptor_aromatic.radius + pi_padding
            ) or (
                pt_on_lignad_plane.dist_to(ligand_aromatic.center)
                <= ligand_aromatic.radius + pi_padding
            ):
                # so it is in the ring on the projected plane.
                structure = receptor.all_atoms[receptor_aromatic.indices[0]].structure
                if structure == "":
                    # since it could be interacting with a cofactor or something
                    structure = "OTHER"

                key = "T-SHAPED_" + structure

                for index in ligand_aromatic.indices:
                    pdb_pi_t.add_new_atom(ligand.all_atoms[index].copy_of())
                for index in receptor_aromatic.indices:
                    pdb_pi_t.add_new_atom(receptor.all_atoms[index].copy_of())

                hashtable_entry_add_one(pi_pi_interactions, key)

                t_stacking_labels.append(
                    make_pi_pi_interaction_label(ligand, ligand_aromatic, receptor, receptor_aromatic)
                )


    return pi_pi_interactions, pdb_pi_t, t_stacking_labels


def make_pi_pi_interaction_label(ligand, ligand_aromatic, receptor, receptor_aromatic):
    return (
        "["
        + " / ".join(
            [ligand.all_atoms[index].string_id() for index in ligand_aromatic.indices]
        )
        + "]",
        "["
        + " / ".join(
            [
                receptor.all_atoms[index].string_id()
                for index in receptor_aromatic.indices
            ]
        )
        + "]",
    )


def pi_pi_detect_by_projecting_all_ring_atoms(
    mol1, mol1_aromatic, mol2_aromatic, pi_padding
):
    for mol1_ring_index in mol1_aromatic.indices:
        # project the mol1 atom onto the plane of the mol2 ring
        pt_on_mol2_plane = binana.mathfuncs.project_point_onto_plane(
            mol1.all_atoms[mol1_ring_index].coordinates,
            mol2_aromatic.plane_coeff,
        )
        if (
            pt_on_mol2_plane.dist_to(mol2_aromatic.center)
            <= mol2_aromatic.radius + pi_padding
        ):
            # Detected
            return True
            # pi_pi = True
            # break
    return False


def pi_stacking(
    ligand,
    receptor,
    ligand_aromatic,
    receptor_aromatic,
    angle_between_planes,
    pi_stacking_angle_tol,
    pi_padding,
    pi_pi_interactions,
    pdb_pistack,
    pi_stacking_labels,
):
    if (
        fabs(angle_between_planes - 0) < pi_stacking_angle_tol
        or fabs(angle_between_planes - 180) < pi_stacking_angle_tol
    ):
        # so they're more or less parallel, it's probably pi-pi
        # stackingoutput_dir now, pi-pi are not usually right on top of each
        # other. They're often staggared. So I don't want to just look at the
        # centers of the rings and compare. Let's look at each of the atoms. do
        # atom of the atoms of one ring, when projected onto the plane of the
        # other, fall within that other ring?

        # Check the ligand atoms projected onto the receptor ring.
        pi_pi = pi_pi_detect_by_projecting_all_ring_atoms(
            ligand, ligand_aromatic, receptor_aromatic, pi_padding
        )

        # if you've already determined it's a pi-pi stacking interaction, no
        # need to keep trying.
        if not pi_pi:
            # Check the receptor atoms projected onto the ligand ring.
            pi_pi = pi_pi_detect_by_projecting_all_ring_atoms(
                receptor, receptor_aromatic, ligand_aromatic, pi_padding
            )

        if pi_pi:
            # It's a pi-pi stacking interaction.
            structure = receptor.all_atoms[receptor_aromatic.indices[0]].structure

            # since it could be interacting with a cofactor or something
            structure = "OTHER" if structure == "" else structure
            key = "STACKING_" + structure

            for index in ligand_aromatic.indices:
                pdb_pistack.add_new_atom(ligand.all_atoms[index].copy_of())
            for index in receptor_aromatic.indices:
                pdb_pistack.add_new_atom(receptor.all_atoms[index].copy_of())

            hashtable_entry_add_one(pi_pi_interactions, key)

            pi_stacking_labels.append(
                make_pi_pi_interaction_label(
                    ligand, ligand_aromatic, receptor, receptor_aromatic
                )
            )
        pi_stacking_detected = True
    else:
        pi_stacking_detected = False
    return pi_pi_interactions, pdb_pistack, pi_stacking_labels, pi_stacking_detected


def calculate_pi_pi(
    ligand,
    receptor,
    pi_pi_general_dist_cutoff=PI_PI_INTERACTING_DIST_CUTOFF,
    pi_stacking_angle_tol=PI_STACKING_ANGLE_TOLERANCE,
    t_stacking_angle_tol=T_STACKING_ANGLE_TOLERANCE,
    t_stacking_closest_dist_cutoff=T_STACKING_CLOSEST_DIST_CUTOFF,
    pi_padding=PI_PADDING_DIST,
):
    # Calculate the distances.
    ligand_receptor_aromatic_dists = get_ligand_receptor_aromatic_dists(
        ligand, receptor, pi_pi_general_dist_cutoff
    )

    pi_interactions = {}
    print("pi_interactions also used in other functions. Need to find way to unify. I think you should keep them seprate in each of these functions, but then merge them all in start.py.")
    # import time; time.sleep(5)

    pdb_pistack = binana.Mol()
    pdb_pi_t = binana.Mol()
    pi_stacking_labels = []
    t_stacking_labels = []


    # "PI-Stacking Interactions ALIVE AND WELL IN PROTEINS" says distance of 7.5
    # A is good cutoff. This seems really big to me, except that pi-pi
    # interactions (parallel) are actuall usually off centered. Interesting
    # paper. Note that adenine and tryptophan count as two aromatic rings. So,
    # for example, an interaction between these two, if positioned correctly,
    # could count for 4 pi-pi interactions.
    for (
        ligand_aromatic,
        receptor_aromatic,
        dist,
        angle_between_planes,
    ) in ligand_receptor_aromatic_dists:
        (
            pi_interactions,
            pdb_pistack,
            pi_stacking_labels,
            pi_stacking_detected,
        ) = pi_stacking(
            ligand,
            receptor,
            ligand_aromatic,
            receptor_aromatic,
            angle_between_planes,
            pi_stacking_angle_tol,
            pi_padding,
            pi_interactions,
            pdb_pistack,
            pi_stacking_labels,
        )

        if not pi_stacking_detected:
            pi_interactions, pdb_pi_t, t_stacking_labels = t_stacking(
                ligand,
                receptor,
                ligand_aromatic,
                receptor_aromatic,
                angle_between_planes,
                t_stacking_angle_tol,
                t_stacking_closest_dist_cutoff,
                pi_padding,
                pi_interactions,
                pdb_pi_t,
                t_stacking_labels,
            )

    return {
        "counts": pi_interactions,
        "mols": {"pi_stacking": pdb_pistack, "T_stacking": pdb_pi_t},
        "labels": {"pi_stacking": pi_stacking_labels, "T_stacking": t_stacking_labels},
    }
