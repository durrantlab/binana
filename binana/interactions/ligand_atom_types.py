import binana
from binana.load import get_ligand_receptor_dists
from binana.utils import hashtable_entry_add_one, list_alphebetize_and_combine


def calculate_ligand_atom_types(ligand):
    ligand_atom_types = {}

    # Get the total number of each atom type in the ligand
    for ligand_atom_index in ligand.all_atoms.keys():
        ligand_atom = ligand.all_atoms[ligand_atom_index]
        hashtable_entry_add_one(ligand_atom_types, ligand_atom.atom_type)

    return {
        "counts": ligand_atom_types,
        # "mol": "",
        # "labels": close_contacts_labels,
    }
