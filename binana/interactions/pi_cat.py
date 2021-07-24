from binana._cli_params.defaults import CATION_PI_DIST_CUTOFF, PI_PADDING_DIST
import binana
from binana._utils.utils import hashtable_entry_add_one


def _detect_pi_cat(
    mol_with_aromatic,
    mol_with_pos_charge,
    cutoff,
    pi_padding,
    pi_cat,
    pdb_pi_cat,
    pi_cat_labels,
    name_of_charged="RECEPTOR",
):
    for aromatic in mol_with_aromatic.aromatic_rings:
        for charged in mol_with_pos_charge.charges:
            # so only consider positive charges, because no pi-anion interaction
            if (
                charged.positive == True
                and charged.coordinates.dist_to(aromatic.center) < cutoff
            ):
                # distance cutoff based on "Cation-pi interactions in
                # structural biology." project the charged onto the
                # plane of the aromatic
                charge_projected = binana.mathfuncs.project_point_onto_plane(
                    charged.coordinates, aromatic.plane_coeff
                )

                if (
                    charge_projected.dist_to(aromatic.center)
                    < aromatic.radius + pi_padding
                ):
                    structure = mol_with_aromatic.all_atoms[
                        aromatic.indices[0]
                    ].structure
                    if structure == "":
                        # since it could be interacting with a
                        # cofactor or something
                        structure = "OTHER"

                    key = "PI-CATION_" + name_of_charged + "-CHARGED_" + structure

                    for index in aromatic.indices:
                        pdb_pi_cat.add_new_atom(
                            mol_with_aromatic.all_atoms[index].copy_of()
                        )
                    for index in charged.indices:
                        pdb_pi_cat.add_new_atom(
                            mol_with_pos_charge.all_atoms[index].copy_of()
                        )

                    hashtable_entry_add_one(pi_cat, key)

                    charged_mol_lbls = (
                        "["
                        + " / ".join(
                            [
                                mol_with_pos_charge.all_atoms[index].string_id()
                                for index in charged.indices
                            ]
                        )
                        + "]"
                    )

                    aromatic_mol_lbls = (
                        "["
                        + " / ".join(
                            [
                                mol_with_aromatic.all_atoms[index].string_id()
                                for index in aromatic.indices
                            ]
                        )
                        + "]"
                    )

                    if name_of_charged == "LIGAND":
                        pi_cat_labels.append(
                            (
                                charged_mol_lbls,
                                aromatic_mol_lbls,
                            )
                        )
                    else:
                        pi_cat_labels.append(
                            (
                                aromatic_mol_lbls,
                                charged_mol_lbls,
                            )
                        )

    return pi_cat, pdb_pi_cat, pi_cat_labels


def get_pi_cation(
    ligand, receptor, cutoff=CATION_PI_DIST_CUTOFF, pi_padding=PI_PADDING_DIST
):
    """Identifies and counts the number of pi-cation interactions between the
    protein and ligand. Output is formatted like this::

        {
            'counts': {
                'PI-CATION_LIGAND-CHARGED_BETA': 2, 
                'PI-CATION_LIGAND-CHARGED_OTHER': 2, 
                'PI-CATION_RECEPTOR-CHARGED_OTHER': 1
            }, 
            'labels': [
                ('[A:CHT(1):N1(2) / A:CHT(1):C5(1) / A:CHT(1):C6(3) / A:CHT(1):C6(4) / A:CHT(1):C7(9)]', '[A:TRP(43):CG(28) / A:TRP(43):CD1(29) / A:TRP(43):NE1(31) / A:TRP(43):CE2(32) / A:TRP(43):CD2(30)]'),
                ('[A:CHT(1):N1(2) / A:CHT(1):C5(1) / A:CHT(1):C6(3) / A:CHT(1):C6(4) / A:CHT(1):C7(9)]', '[A:TRP(43):CE2(32) / A:TRP(43):CD2(30) / A:TRP(43):CE3(33) / A:TRP(43):CZ3(35) / A:TRP(43):CH2(36) / A:TRP(43):CZ2(34)]')
            ], 
            'mol': <binana._structure.mol.Mol instance at 0x7feb20488128>
        }

    Args:
        ligand (binana.Mol): The ligand molecule to analyze.
        receptor (binana.Mol): The receptor molecule to analyze.
        cutoff (float, optional): The distance cutoff. Defaults to
            CATION_PI_DIST_CUTOFF.
        pi_padding (float, optional): The amount by which the radius of each pi
            ring should be artificially expanded, to be sure to catch the 
            interactions. Defaults to PI_PADDING_DIST.

    Returns:
        dict: Contains the atom tallies ("counts"), the binana.Mol object with
        the participating atoms ("mol"), and the labels to use in the log file
        ("labels").
    """

    pi_cat = {}
    pdb_pi_cat = binana.Mol()
    pi_cat_labels = []

    pi_cat, pdb_pi_cat, pi_cat_labels = _detect_pi_cat(
        receptor,
        ligand,
        cutoff,
        pi_padding,
        pi_cat,
        pdb_pi_cat,
        pi_cat_labels,
        "LIGAND",
    )
    pi_cat, pdb_pi_cat, pi_cat_labels = _detect_pi_cat(
        ligand,
        receptor,
        cutoff,
        pi_padding,
        pi_cat,
        pdb_pi_cat,
        pi_cat_labels,
        "RECEPTOR",
    )

    return {
        "counts": pi_cat,
        "mol": pdb_pi_cat,
        "labels": pi_cat_labels,
    }
