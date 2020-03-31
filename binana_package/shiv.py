# A number of python libraries aren't compatible with transcript. This file
# provides alternate functions.

import sys

fake_fs = {}

# sys.argv dosn't make sense in this context.
argv = []

# os.sep not available
sep = "/"

# os.mkdir not needed.
def mkdir(d):
    # No need to make directories when using transcrypt.
    return

# os.path.exists
class Path():
    def exists(d):
        # No need to implement.
        return True
path = Path()

# sys.exit doesn't work
def exit(n):
    return

# textwrap.wrap
def wrap(s, _):
    # So no wrapping...
    return [s]

# strange that many math functions are defined but not math.fabs
def fabs(n):
    if n < 0:
        return -n

    return n

# json.dump doesn't work
def dump(data, open_file):
    txt = str(data).replace('"', '\\"').replace("'", '"')
    open_file.write(txt)

# rjust not implemented in transcrypt, so use pure python substitute.
def r_just(s, c):
    while len(s) < c:
        s = " " + s
    return s

# opening, reading, and writing to files doesn't make sense in browser.
class OpenFile:
    def __init__(self, flnm, mode="r"):
        self.flnm = flnm
        self.mode = mode

        if mode == "w":
            fake_fs[flnm] = ""

    def write(self, s):
        fake_fs[self.flnm] += s

    def read(self):
        return fake_fs[self.flnm]

    def readlines(self):
        return [l + "\n" for l in fake_fs[self.flnm].split("\n")]

    def close(self):
        return
