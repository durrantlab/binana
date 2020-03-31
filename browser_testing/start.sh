# First delete any old version of the output directory.
rm -rf output
mkdir output
mkdir output/python_src
mkdir output/html

# Copy the existing python code
echo "Don't worry about these 'is a directory (not copied)' errors..."
cp ../* output/python_src/
cp -r ../binana_package output/python_src/

# Use shiv instead of json.
find output/python_src/ -name "*.py" -exec grep -l "import json" '{}' \; | awk '{print "cat " $1 " | sed \"s/import json/import shiv as json/g\" > t; mv t " $1}' | bash

# Use shiv instead of os.
find output/python_src/ -name "*.py" -exec grep -l "import os" '{}' \; | awk '{print "cat " $1 " | sed \"s/import os/import shiv as os/g\" > t; mv t " $1}' | bash

# Also use shiv instead of textwrap
find output/python_src/ -name "*.py" -exec grep -l "import textwrap" '{}' \; | awk '{print "cat " $1 " | sed \"s/import textwrap/import shiv as textwrap/g\" > t; mv t " $1}' | bash

# Also use shiv instead of sys
find output/python_src/ -name "*.py" -exec grep -l "import sys" '{}' \; | awk '{print "cat " $1 " | sed \"s/import sys/import shiv as sys/g\" > t; mv t " $1}' | bash

# Use shiv instead of open(
find output/python_src/ -name "*.py" -exec grep -l " open(" '{}' \; | awk '{print "cat " $1 " | sed \"s/ open\(/ shiv.OpenFile(/g\" > t; mv t " $1}' | bash

# Use shive instead of math.fabs
find output/python_src/ -name "*.py" -exec grep -l "math.fabs(" '{}' \; | awk '{print "cat " $1 " | sed \"s/math.fabs\(/shiv.fabs(/g\" > t; mv t " $1}' | bash

# Make sure main doesn't get called automatically.
cat output/python_src/binana_package/binana.py | sed "s/if __name__ == .__main__../if False:/g" > t
mv t output/python_src/binana_package/binana.py

# Now compile the python file. Assumes transcrypt installed. If not `python -m
# pip install transcrypt`
cd output/python_src/binana_package/
transcrypt binana.py

# Setup a directory with files you can run in a browser.
cp __target__/* ../../html/
cp ../../../index.html ../../html/

# Below starts a server on jdd laptop
cd ../../html/
/Users/jdurrant/anaconda/bin/python -m SimpleHTTPServer 8000
