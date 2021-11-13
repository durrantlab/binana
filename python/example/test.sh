# Script for testing binana from the Unix command line. Best to use `python
# run_binana.py -test true` instead.

python3 ../run_binana.py -receptor receptor.pdbqt -ligand ligand.pdbqt -output_file test.pdb
python3 ../run_binana.py -receptor receptor.pdbqt -ligand ligand.pdbqt -output_dir ./cli_example_output/
python3 ../run_binana.py -receptor receptor.pdbqt -ligand ligand.pdbqt -output_json ligand_receptor_output.json

python3 ../run_binana.py -receptor metal_coordination/recep_no_zn.pdb -ligand metal_coordination/Zn_lig.pdb -output_dir ./cli_example_output/
