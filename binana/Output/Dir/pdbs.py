def output_dir_pdbs(
    pdb_close_contacts,
    parameters,
    pdb_contacts,
    pdb_contacts_alpha_helix,
    pdb_contacts_beta_sheet,
    pdb_contacts_other_2nd_structure,
    pdb_back_bone,
    pdb_side_chain,
    pdb_hydrophobic,
    pdb_hbonds,
    pdb_pistack,
    pdb_pi_T,
    pdb_pi_cat,
    pdb_salt_bridges,
    ligand,
    receptor,
):
    # so an output directory has been specified. Write the pdb files
    # out separately

    pdb_close_contacts.save_PDB(parameters.params["output_dir"] + "/close_contacts.pdb")
    pdb_contacts.save_PDB(parameters.params["output_dir"] + "/contacts.pdb")
    pdb_contacts_alpha_helix.save_PDB(
        parameters.params["output_dir"] + "/contacts_alpha_helix.pdb"
    )
    pdb_contacts_beta_sheet.save_PDB(
        parameters.params["output_dir"] + "/contacts_beta_sheet.pdb"
    )
    pdb_contacts_other_2nd_structure.save_PDB(
        parameters.params["output_dir"] + "/contacts_other_secondary_structure.pdb"
    )
    pdb_back_bone.save_PDB(parameters.params["output_dir"] + "/back_bone.pdb")
    pdb_side_chain.save_PDB(parameters.params["output_dir"] + "/side_chain.pdb")
    pdb_hydrophobic.save_PDB(parameters.params["output_dir"] + "/hydrophobic.pdb")
    pdb_hbonds.save_PDB(parameters.params["output_dir"] + "/hydrogen_bonds.pdb")
    pdb_pistack.save_PDB(parameters.params["output_dir"] + "/pi_pi_stacking.pdb")
    pdb_pi_T.save_PDB(parameters.params["output_dir"] + "/T_stacking.pdb")
    pdb_pi_cat.save_PDB(parameters.params["output_dir"] + "/cat_pi.pdb")
    pdb_salt_bridges.save_PDB(parameters.params["output_dir"] + "/salt_bridges.pdb")
    ligand.save_PDB(parameters.params["output_dir"] + "/ligand.pdb")
    receptor.save_PDB(parameters.params["output_dir"] + "/receptor.pdb")
