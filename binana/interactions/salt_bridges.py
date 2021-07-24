from binana._cli_params.defaults import SALT_BRIDGE_DIST_CUTOFF
import binana
from binana.load_ligand_receptor import _get_ligand_receptor_dists
from binana._utils.utils import hashtable_entry_add_one, list_alphebetize_and_combine


def get_salt_bridges(ligand, receptor, cutoff=SALT_BRIDGE_DIST_CUTOFF):
    """Identifies and counts the number of salt-bridge interactions between the
    protein and ligand. Output is formatted like this::

        {
            'counts': {
                'SALT-BRIDGE_OTHER': 1, 
                'SALT-BRIDGE_ALPHA': 2
            },
            'labels': [
                ('[A:CHT(1):N1(2) / A:CHT(1):C5(1) / A:CHT(1):C6(3) / A:CHT(1):C6(4) / A:CHT(1):C7(9)]', '[A:ASP(45):CG(53) / A:ASP(45):OD1(54) / A:ASP(45):OD2(55)]'),
                ('[A:CHT(1):N1(14) / A:CHT(1):C4(13) / A:CHT(1):H2(15) / A:CHT(1):H1(16) / A:CHT(1):C2(17)]', '[A:ASP(157):CG(283) / A:ASP(157):OD1(284) / A:ASP(157):OD2(285)]')
            ],
            'mol': <binana._structure.mol.Mol instance at 0x7feb20494098>
        }

    Args:
        ligand (binana.Mol): The ligand molecule to analyze.
        receptor (binana.Mol): The receptor molecule to analyze.
        cutoff (float, optional): The distance cutoff. Defaults to
            SALT_BRIDGE_DIST_CUTOFF.

    Returns:
        dict: Contains the atom tallies ("counts"), the binana.Mol object with
        the participating atoms ("mol"), and the labels to use in the log file
        ("labels").
    """

    salt_bridges = {}
    pdb_salt_bridges = binana.Mol()
    salt_bridge_labels = []

    for receptor_charge in receptor.charges:
        for ligand_charge in ligand.charges:
            if ligand_charge.positive != receptor_charge.positive and (
                ligand_charge.coordinates.dist_to(receptor_charge.coordinates) < cutoff
            ):
                # so they have oppositve charges 4 is good cutoff for salt
                # bridges according to "Close-Range Electrostatic Interactions
                # in Proteins", but looking at complexes, I decided to go with
                # 5.5 A
                structure = receptor.all_atoms[receptor_charge.indices[0]].structure
                if structure == "":
                    # since it could be interacting with a cofactor or something
                    structure = "OTHER"

                key = "SALT-BRIDGE_" + structure

                for index in receptor_charge.indices:
                    pdb_salt_bridges.add_new_atom(receptor.all_atoms[index].copy_of())
                for index in ligand_charge.indices:
                    pdb_salt_bridges.add_new_atom(ligand.all_atoms[index].copy_of())

                hashtable_entry_add_one(salt_bridges, key)

                salt_bridge_labels.append(
                    (
                        "["
                        + " / ".join(
                            [
                                ligand.all_atoms[index].string_id()
                                for index in ligand_charge.indices
                            ]
                        )
                        + "]",
                        "["
                        + " / ".join(
                            [
                                receptor.all_atoms[index].string_id()
                                for index in receptor_charge.indices
                            ]
                        )
                        + "]",
                    )
                )

    return {
        "counts": salt_bridges,
        "mol": pdb_salt_bridges,
        "labels": salt_bridge_labels,
    }
