# Changes

## 2.1

1. Web-browser app: changes to how interactions are displayed.
   - Now possible to visualize multiple interactions at once. Select
     interactions are turned on by default.
   - Bonds are now color coded.
   - Now possible to toggle the receptor ribbon representation.
   - Changed text of "Clear" button to "Reset" because it resets the
     visualization to the default.
   - To simplify the visualization:
     - Some interactions are now shown as spheres, and others as bonds.
     - Removed the ability to toggle cylinder-representation interactions. These
       are always on for those interactions where cylinder representations are
       appropriate.
     - Removed ability to color by molecule, interaction, etc.

2. Web-browser app: changes to output download (via "Save" button).
   - JSZip library is now a dynamic import (loaded only when needed).
   - Added PNG file.
   - Added `log.txt` file for those not comfortable with JSON.
   - Added VMD state file.

3. Web-browser app: Miscellaneous
   - If an input structure includes multiple frames, the web app retains only
     the first frame.
   - Revised the file-input system. Aside from loading files from their local
     computers, users can now also specify PDB IDs. They can also delete
     non-protein residues or use a non-protein residue as the ligand.
   - Added a link that allows users to learn more about how interactions are
     detected, advanced BINANA parameters, etc.

4. Changes to how interactions are detected.
   - Sulfur atoms can now serve as hydrogen bond donors and acceptors.
   - BINANA can now better detect salt bridges and hydrogen bonds even if
     protein and ligand models do not include hydrogen atoms, though using
     protonated models does improve accuracy.
   - Added the ability to detect halogen bonds. The `hydrogen_bond_angle_cutoff`
     parameter has been renamed `hydrogen_halogen_bond_angle_cutoff`, and a new
     parameter `halogen_bond_dist_cutoff` has been added.
   - Added the ability to detect metal coordination bonds. Added
     `metal_coordination_dist_cutoff` parameter.

5. Changes to the output files
   - The VMD state file is now centered on the ligand when opened in VMD.
   - The output JSON file now includes bond distances and angles.
   - BINANA can now output a CSV file with the same information in the JSON
     file.  Added the `output_csv` parameter.
   - Output PDB files now include the chain and residue ids.

6. Other changes of note
   - Speed and memory-use improvements.
   - BINANA throws a warning when using Python 2. Only Python 3 is now
     officially supported.
   - Substantial updates to the documentation.

## 2.0

1. We have refactored the code to make it more modular. BINANA still works as a
   command-line program, but it now also functions as a Python library, allowing
   others to import BINANA's various functions into their scripts.
2. BINANA now works with Python3. Python2 is no longer officially supported.
3. BINANA can now output analyses to the JSON format, improving compatibility
   with other analysis programs.
4. We have ported the Python codebase to JavaScript using the [Transcrypt
   transpiler](https://www.transcrypt.org/). Others can now access the BINANA.js
   library from their web apps.
5. To demonstrate JavaScript use, we created a [web
   app](http://durrantlab.com/binana/) that leverages the BINANA.js library. The
   Git repository includes the web-app source code.
6. The BINANA 2.0 interaction criteria are identical to the original version,
   except for close and closest contacts. Previously, these two interactions
   were mutually exclusive (i.e., those protein/ligand atom pairs that were
   close enough to be categorized as "closest" were not also considered to be
   "close"). In BINANA 2.0, all closest contacts are also close.
7. We created a [documentation website](http://durrantlab.com/apps/binana/docs/)
   to further improve BINANA usability.
8. We changed the name of the development branch from `master` to `main`.
9. We release BINANA 2.0 under a more permissive license than previous versions
   (Apache License, Version 2.0). 

## 1.3

1. BINANA now requires Python3. Python2 support has been discontinued.
2. Added documentation files in MarkDown format.
3. Updated code formatting some (using black formatter).
4. Added README.md.
5. Added roadmap.
6. Updated example files, now located at `examples/`.

## 1.2.0

1. The version previously hosted on
   [SourceForge](https://sourceforge.net/projects/binana/).
