
                                                             |[]{};
                                                            .|[]{}
                                                            .|  {}
                                                             |   }
                                                             |   }
                                                             |   }
                                                            .|   };
                                                            .|     :'"
                                                           +.        "
                                                          =+         "/
                                                         _=          "/
                                                        -_           "/
                                                       ,-            "/
                                                     <>              "/
                                                   |\                "
                                               :'"/                 '"
                                        .|[]{};                    :'
               ,-_=+.|[]{};:'"/|\<>,-_=+                           :'
           |\<>                                                   ;:
          /|                                                    {};
          /|                                                   ]{}
          /|                                                  []
           |\                                               .|[
            \<                                            =+.
              >,                                        -_=
               ,-_=                                  <>,-
                  =+.|[]                         "/|\<
                       ]{};:'"/|\         []{};:'"
                                \<>,-_=+.|

# Suggested commmand-line use

We recommend using BINANA with the `-output_dir` parameter, which will save all
output files to a specified directory:

```bash
python3 run_binana.py -receptor /path/to/receptor.pdbqt -ligand /path/to/ligand.pdbqt -output_dir /path/to/output/directory/ > errors.txt
```

If a directory is specified, BINANA creates the following files:

1. Separate PDB files containing the atoms involved in each interaction
   analyzed.
2. A description of the interactions written to a file called `log.txt`.
3. Detailed information about the identified interaction saved to `output.json`
   and `output.csv`.
4. A VMD state file (`state.vmd`) so the results can be easily visualized in
   [VMD, a free program available for
   download](http://www.ks.uiuc.edu/Development/Download/download.cgi?PackageName=VMD).

To save warnings and errors, append something like `> errors.txt` to the end of
your command.

# Alternative methods of use

To output limited information about the detected interactions to the standard
output:

```bash
python3 run_binana.py -receptor /path/to/receptor.pdbqt -ligand /path/to/ligand.pdbqt
```

To create a single PDB file that includes the atoms involved in the identified
interactions, with interaction characteristics described in the PDB header:

```bash
python3 run_binana.py -receptor /path/to/receptor.pdbqt -ligand /path/to/ligand.pdbqt -output_file /path/to/output.pdb
```

Note that in the above example, errors and warnings are not written to the
output file. To save these to a file, try:

```bash
python3 run_binana.py -receptor /path/to/receptor.pdbqt -ligand /path/to/ligand.pdbqt -output_file /path/to/output.pdb > errors.txt
```

To output a JSON file with all the characterized interactions between the
protein and ligand:

```bash
python3 run_binana.py -receptor /path/to/receptor.pdbqt -ligand /path/to/ligand.pdbqt -output_json /path/to/output.json
```

To output a CSV file with the same information:

```bash
python3 run_binana.py -receptor /path/to/receptor.pdbqt -ligand /path/to/ligand.pdbqt -output_csv /path/to/output.csv
```

# Specifying custom parameters

Though we recommend using program defaults, the following command-line tags can
also be specified: `-close_contacts_dist1_cutoff` `-close_contacts_dist2_cutoff`
`-electrostatic_dist_cutoff` `-active_site_flexibility_dist_cutoff`
`-hydrophobic_dist_cutoff` `-hydrogen_bond_dist_cutoff`
`-hydrogen_halogen_bond_angle_cutoff` `-halogen_bond_dist_cutoff`
`-pi_padding_dist` `-pi_pi_interacting_dist_cutoff`
`-pi_stacking_angle_tolerance` `-T_stacking_angle_tolerance`
`-T_stacking_closest_dist_cutoff` `-cation_pi_dist_cutoff`
`-salt_bridge_dist_cutoff` `-metal_coordination_dist_cutoff`

For example, if you want to tell BINANA to detect only hydrogen bonds where the
donor and acceptor are less than 3.0 angstroms distant, run:

```bash
python3 run_binana.py -receptor /path/to/receptor.pdbqt -ligand /path/to/ligand.pdbqt -hydrogen_bond_dist_cutoff 3.0
```

What follows is a detailed description of the BINANA algorithm and a further
explanation of the optional parameters described above. Parameter names are
enclosed in braces.
