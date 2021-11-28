Changes
=======

2.1 WIP
-------

1. Can select multiple interactions at once.
2. PNG file included in download from "Save" button. Also, log.txt file, for
   those not comfortable with JSON.
3. Bonds now color coded.
4. Certain interactions turned on by default.
5. Clear button changed to "Reset" because resets to default value.
6. No more coloring by molecule, interaction, etc. Too confusing.
7. JSZip now dynamic import.
8. zip download now includes vmd state directory.
9. Vmd state file centers on ligand automatically.
10. changed hydrogen_bond_angle_cutoff parameter name to
    hydrogen_halogen_bond_angle_cutoff. Added OTHER HALOGEN DIST HERE PARAM
    HERE.
11. Removed ability to toggle on and off cylinder interactions, to simplify UI.
    Always on for those interaction where appropriate.
12. Some interactions are shown as spheres, others as bonds. Keeps it simplier.
13. Improved ability to detect salt bridges and hydrogen bonds even if protein
    and ligand models do not have hydrogen atoms.
14. Speed and memory improvements
15. Revised file input system. Can now also specify PDB ID, extract delete
    non-protein residues, etc.
16. Sulfur can now be a hydrogen bond donor and acceptor.
17. If input structure has mmultiple frames, keepsfirst one.
18. JSON file now includes distances and angles.
19. output_csv option now also prints csv file containing same information as json.
20. Possible to toggle ribbon on and off.
21. Updated documentation.
22. chain and resid now included in output PDB files.
23. Throws a warning when using Python 2. Only Python 3 now offically supported.

TODO:

Make sure INTERACTIONS.md mentioned in documentation (throughout). Incorporate
it into the web app too.

Tests on all operating systems (including mobile).

*** Makesure can loadin multipleligands. Probably need to rewritecodethat
triggersbinana run. Also, can run if restart.

And you need a message explaining the difference between delete/extract. 

Push updated documentation somewhere.

Add defaults to documentation.

2.0
---

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

1.3
---

1. BINANA now requires Python3. Python2 support has been discontinued.
2. Added documentation files in MarkDown format.
3. Updated code formatting some (using black formatter).
4. Added README.md.
5. Added roadmap.
6. Updated example files, now located at `examples/`.

1.2.0
-----

1. The version previously hosted on
   [SourceForge](https://sourceforge.net/projects/binana/).
