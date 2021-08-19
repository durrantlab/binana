Changes
=======

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
