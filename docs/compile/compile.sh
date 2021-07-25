# Must use Python3
source activate Python36

# Clean up previous builds
rm -rf _rst

# First, convert python source code to rst
mkdir _rst
sphinx-apidoc --module-first -f -o _rst/ ../../binana/

# Copy README.md here.
cp ../../README.md ./tmp.md

make html

rm -rf ../docs
mv _build/html ../docs

# Tweak the styles a bit
echo >> ../docs/_static/bizstyle.css
echo ".field-name {min-width:90px;}" >> ../docs/_static/bizstyle.css
echo ".field-body {padding-left:10px !important;}" >> ../docs/_static/bizstyle.css

# Delete README.md file
rm tmp.md
