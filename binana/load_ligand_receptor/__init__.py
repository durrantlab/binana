# This file is part of BINANA, released under the Apache 2.0 License. See
# LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
# details. Copyright 2020 Jacob D. Durrant.

"""This module contains functions for loading ligands and receptors. Note that
while BINANA can process PDB files, the PDB format lacks some information
required for a full BINANA analysis. PDBQT recommended."""

import binana
import math
from binana._structure.point import Point as _Point
from binana._structure.mol import Mol as _Mol
from binana._utils import _math_functions

_ligand_receptor_dists = None
_ligand_receptor_aromatic_dists = None

# Contains all pi-pi interactions (of all types).
# pi_interactions = None


def from_texts(ligand_text, receptor_text):
    """Loads a ligand and receptor from a PDBQT- or PDB-formatted string
    (text). PDBQT recommended.

    Args:
        ligand_text (str): The ligand text to load. Preferably PDBQT formatted,
            though BINANA and perform most analyses on PDB files as well.
        receptor_text (str): The receptor text to load. Preferably PDBQT
            formatted, though BINANA and perform most analyses on PDB files as
            well.

    Returns:
        list: A list of binana._structure.mol.Mol objects, for the ligand and
        receptor, respectively.
    """

    ligand = _Mol()
    ligand.load_pdb_from_text(ligand_text)

    receptor = _Mol()
    receptor.load_pdb_from_text(receptor_text)
    receptor.assign_secondary_structure()

    # Clears the cache
    _clear_cache()

    return ligand, receptor


def from_files(ligand_filename, receptor_filename):
    """Loads a ligand and receptor from PDBQT or PDB files. PDBQT recommended.

    Args:
        ligand_pdbqt_filename (str): The ligand filename to load. Preferably
            PDBQT formatted, though BINANA and perform most analyses on PDB
            files as well.
        receptor_pdbqt_filename (str): The receptor filename to load.
            Preferably PDBQT formatted, though BINANA and perform most analyses
            on PDB files as well.

    Returns:
        list: A list of binana._structure.mol.Mol objects, for the ligand and
        receptor, respectively.
    """

    ligand = _Mol()
    ligand.load_pdb_file(ligand_filename)

    receptor = _Mol()
    receptor.load_pdb_file(receptor_filename)
    receptor.assign_secondary_structure()

    # Clears the cache
    _clear_cache()

    return ligand, receptor


def _clear_cache():
    global _ligand_receptor_dists
    global _ligand_receptor_aromatic_dists
    # global pi_interactions

    _ligand_receptor_dists = None
    _ligand_receptor_aromatic_dists = None
    # pi_interactions = None


def _get_ligand_receptor_dists(ligand, receptor):
    global _ligand_receptor_dists

    # Get it from the cache
    if _ligand_receptor_dists is not None:
        return _ligand_receptor_dists

    # Calculate the distances.
    _ligand_receptor_dists = []
    for ligand_atom_index in ligand.all_atoms.keys():
        for receptor_atom_index in receptor.all_atoms.keys():
            ligand_atom = ligand.all_atoms[ligand_atom_index]
            receptor_atom = receptor.all_atoms[receptor_atom_index]
            dist = ligand_atom.coordinates.dist_to(receptor_atom.coordinates)
            _ligand_receptor_dists.append((ligand_atom, receptor_atom, dist))

    return _ligand_receptor_dists


def _get_ligand_receptor_aromatic_dists(ligand, receptor, pi_pi_general_dist_cutoff):
    global _ligand_receptor_aromatic_dists

    # Get it from the cache
    if _ligand_receptor_aromatic_dists is not None:
        return _ligand_receptor_aromatic_dists

    _ligand_receptor_aromatic_dists = []

    for ligand_aromatic in ligand.aromatic_rings:
        for receptor_aromatic in receptor.aromatic_rings:
            dist = ligand_aromatic.center.dist_to(receptor_aromatic.center)
            if dist < pi_pi_general_dist_cutoff:
                # so there could be some pi-pi interactions. first, let's
                # check for stacking interactions. Are the two pi's
                # roughly parallel?
                ligand_aromatic_norm_vector = _Point(
                    ligand_aromatic.plane_coeff[0],
                    ligand_aromatic.plane_coeff[1],
                    ligand_aromatic.plane_coeff[2],
                )

                receptor_aromatic_norm_vector = _Point(
                    receptor_aromatic.plane_coeff[0],
                    receptor_aromatic.plane_coeff[1],
                    receptor_aromatic.plane_coeff[2],
                )

                angle_between_planes = (
                    _math_functions.angle_between_points(
                        ligand_aromatic_norm_vector, receptor_aromatic_norm_vector
                    )
                    * 180.0
                    / math.pi
                )

                _ligand_receptor_aromatic_dists.append(
                    (
                        ligand_aromatic,
                        receptor_aromatic,
                        dist,
                        angle_between_planes,
                    )
                )

    return _ligand_receptor_aromatic_dists
