# A program for finding typescript functions with missing docstrings.
# Run from ./utils/ directory using Python2.

import subprocess

ts_files = (
    subprocess.check_output("find ../src -type f -name '*.ts'", shell=True)
    .strip()
    .split("\n")
)
ts_files = [t for t in ts_files if not t.endswith(".d.ts")]

for ts_file in ts_files:
    prohibited = ["/old/", "/tmp/", "/tmp2/"]
    prohibited_pass = [(p in ts_file) for p in prohibited]
    if True in prohibited_pass:
        continue

    print("\n***** " + ts_file + " *****")
    with open(ts_file) as f:
        lines = f.readlines()
        found_copyright = False
        for i, line in enumerate(lines):
            if "Copyright 20" in line:
                found_copyright = True
            line = line.strip()
            line = line.replace("{};", "{")

            if line.startswith("//"):
                continue
            if line.startswith("/*"):
                continue
            if "setInterval" in line:
                continue
            if "=>" in line:
                continue

            match = line.startswith("function ")

            # if not match:
                # match = "=>" in line and not "= () =>" in line and not "() => {" in line

            if not match:
                match = (
                    line.endswith("{")
                    and not "if " in line
                    and not "case " in line
                    and not "for " in line
                    and not "switch " in line
                    and not "else " in line
                    and not "return " in line
                    and not "= {" in line
                    and not "." in line
                    and not ":{" in line
                    and not ": {" in line
                    and not "catch" in line
                    and not "try " in line
                    and not "interface " in line
                    and not line.endswith("({")
                    and not "while " in line
                    and not "class " in line
                    and not "for(" in line
                    and line != "{"
                    and not "constructor" in line
                    and not "const " in line
                )

            if match:
                if not "*/" in lines[i - 1]:
                    print(line)
    if not found_copyright and not "template.htm.ts" in ts_file:
        print("No copyright in " + ts_file)
