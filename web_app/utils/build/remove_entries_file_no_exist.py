import re
import glob
import os

def repl(m):
    if not os.path.exists(m.group(1)):
        print("Removing nonexistant file from precache-manifest: " + m.group(1))
        return ""
    return m.group(0)

for fl in glob.glob("precache-manifest.*.js"):
    with open(fl, "r") as f:
        txt = f.read()
        txt = txt.replace("\n", " ")
        txt = re.sub(r'{.*?url:"(.+?)"},?', repl, txt)
        txt = txt.replace("}, ]);", "}]);")

    with open(fl, "w") as f:
        f.write(txt)
