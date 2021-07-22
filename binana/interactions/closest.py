from binana.cli_params.defaults import CLOSE_CONTACTS_DIST1_CUTOFF
import binana
from binana.load import get_ligand_receptor_dists
from binana.utils import hashtable_entry_add_one, list_alphebetize_and_combine


def calculate_closest(ligand, receptor, cutoff=CLOSE_CONTACTS_DIST1_CUTOFF):
    ligand_receptor_atom_type_pairs_closest = {}
    pdb_closest_contacts = binana.Mol()
    closest_contacts_labels = []

    # Calculate the distances.
    ligand_receptor_dists = get_ligand_receptor_dists(ligand, receptor)

    # Identify closest contacts
    for ligand_atom, receptor_atom, dist in ligand_receptor_dists:
        if dist < cutoff:
            # less than 2.5 A
            list_ligand_atom = [ligand_atom.atom_type, receptor_atom.atom_type]
            hashtable_entry_add_one(
                ligand_receptor_atom_type_pairs_closest,
                list_alphebetize_and_combine(list_ligand_atom),
            )
            pdb_closest_contacts.add_new_atom(ligand_atom.copy_of())
            pdb_closest_contacts.add_new_atom(receptor_atom.copy_of())

            closest_contacts_labels.append(
                (ligand_atom.string_id(), receptor_atom.string_id())
            )

    return {
        "counts": ligand_receptor_atom_type_pairs_closest,
        "mol": pdb_closest_contacts,
        "labels": closest_contacts_labels,
    }
