# This script only works if transcrypt is installed.
# pip install transcrypt

# Clean previous version.
rm -rf ../__target__/ ./dist/

# Compile the python file.
cd ../
# --nomin
transcrypt --nomin --build --ecom --verbose binana.py
cd -

# Move the javascript library to the dist directory.
mv ../__target__/ ./dist

# Copy the example html file for testing.
cp ./src_aux/test.html.src ./dist/test.html

cp $(realpath src_aux/Example.ipynb*) ./dist/
