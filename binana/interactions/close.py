from binana.cli_params.defaults import CLOSE_CONTACTS_DIST2_CUTOFF
import binana
from binana.load import get_ligand_receptor_dists
from binana.utils import hashtable_entry_add_one, list_alphebetize_and_combine


def calculate_close(ligand, receptor, cutoff=CLOSE_CONTACTS_DIST2_CUTOFF):
    ligand_receptor_atom_type_pairs_close = {}
    pdb_close_contacts = binana.Mol()
    close_contacts_labels = []

    # Calculate the distances.
    ligand_receptor_dists = get_ligand_receptor_dists(ligand, receptor)

    # Identify close contacts
    for ligand_atom, receptor_atom, dist in ligand_receptor_dists:
        if dist < cutoff:
            # less than 4 A
            list_ligand_atom = [ligand_atom.atom_type, receptor_atom.atom_type]
            hashtable_entry_add_one(
                ligand_receptor_atom_type_pairs_close,
                list_alphebetize_and_combine(list_ligand_atom),
            )
            pdb_close_contacts.add_new_atom(ligand_atom.copy_of())
            pdb_close_contacts.add_new_atom(receptor_atom.copy_of())

            close_contacts_labels.append(
                (ligand_atom.string_id(), receptor_atom.string_id())
            )

    return {
        "counts": ligand_receptor_atom_type_pairs_close,
        "mol": pdb_close_contacts,
        "labels": close_contacts_labels,
    }
