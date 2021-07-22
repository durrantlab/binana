import binana
import math

ligand_receptor_dists = None
ligand_receptor_aromatic_dists = None

# Contains all pi-pi interactions (of all types).
# pi_interactions = None

def load_ligand_and_receptor(ligand_pdbqt_filename, receptor_pdbqt_filename):
    global ligand_receptor_dists
    global ligand_receptor_aromatic_dists
    # global pi_interactions

    # JY
    ligand = binana.Mol()
    ligand.load_pdb(ligand_pdbqt_filename)

    receptor = binana.Mol()
    receptor.load_pdb(receptor_pdbqt_filename)
    receptor.assign_secondary_structure()

    # Clears the cache
    ligand_receptor_dists = None
    ligand_receptor_aromatic_dists = None
    # pi_interactions = None

    return ligand, receptor


def get_ligand_receptor_dists(ligand, receptor):
    global ligand_receptor_dists

    # Get it from the cache
    if ligand_receptor_dists is not None:
        return ligand_receptor_dists

    # Calculate the distances.
    ligand_receptor_dists = []
    for ligand_atom_index in ligand.all_atoms.keys():
        for receptor_atom_index in receptor.all_atoms.keys():
            ligand_atom = ligand.all_atoms[ligand_atom_index]
            receptor_atom = receptor.all_atoms[receptor_atom_index]
            dist = ligand_atom.coordinates.dist_to(receptor_atom.coordinates)
            ligand_receptor_dists.append((ligand_atom, receptor_atom, dist))

    return ligand_receptor_dists


def get_ligand_receptor_aromatic_dists(ligand, receptor, pi_pi_general_dist_cutoff):
    global ligand_receptor_aromatic_dists

    # Get it from the cache
    if ligand_receptor_aromatic_dists is not None:
        return ligand_receptor_aromatic_dists

    ligand_receptor_aromatic_dists = []

    for ligand_aromatic in ligand.aromatic_rings:
        for receptor_aromatic in receptor.aromatic_rings:
            dist = ligand_aromatic.center.dist_to(receptor_aromatic.center)
            if dist < pi_pi_general_dist_cutoff:
                # so there could be some pi-pi interactions. first, let's
                # check for stacking interactions. Are the two pi's
                # roughly parallel?
                ligand_aromatic_norm_vector = binana.Point(
                    ligand_aromatic.plane_coeff[0],
                    ligand_aromatic.plane_coeff[1],
                    ligand_aromatic.plane_coeff[2],
                )

                receptor_aromatic_norm_vector = binana.Point(
                    receptor_aromatic.plane_coeff[0],
                    receptor_aromatic.plane_coeff[1],
                    receptor_aromatic.plane_coeff[2],
                )

                angle_between_planes = (
                    binana.mathfuncs.angle_between_points(
                        ligand_aromatic_norm_vector, receptor_aromatic_norm_vector
                    )
                    * 180.0
                    / math.pi
                )

                ligand_receptor_aromatic_dists.append(
                    (
                        ligand_aromatic,
                        receptor_aromatic,
                        dist,
                        angle_between_planes,
                    )
                )

    return ligand_receptor_aromatic_dists


