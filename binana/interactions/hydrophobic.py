from binana.cli_params.defaults import HYDROPHOBIC_DIST_CUTOFF
import binana
from binana.load import get_ligand_receptor_dists
from binana.utils import hashtable_entry_add_one


def calculate_hydrophobics(ligand, receptor, cutoff=HYDROPHOBIC_DIST_CUTOFF):
    hydrophobics = {}
    pdb_hydrophobic = binana.Mol()
    hydrophobic_labels = []

    # Calculate the distances.
    ligand_receptor_dists = get_ligand_receptor_dists(ligand, receptor)

    # Now see if there's hydrophobic contacts (C-C contacts)
    for ligand_atom, receptor_atom, dist in ligand_receptor_dists:
        if (
            dist < cutoff
            and ligand_atom.element == "C"
            and receptor_atom.element == "C"
        ):
            hydrophobic_key = (
                receptor_atom.side_chain_or_backbone() + "_" + receptor_atom.structure
            )
            pdb_hydrophobic.add_new_atom(ligand_atom.copy_of())
            pdb_hydrophobic.add_new_atom(receptor_atom.copy_of())

            hashtable_entry_add_one(hydrophobics, hydrophobic_key)

            hydrophobic_labels.append(
                (ligand_atom.string_id(), receptor_atom.string_id())
            )

    return {
        "counts": hydrophobics,
        "mol": pdb_hydrophobic,
        "labels": hydrophobic_labels,
    }
