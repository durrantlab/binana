# This script only works if transcrypt is installed.
# pip install transcrypt

# Clean previous version.
rm -rf ../__target__/ ./lib/

# Compile the python file.
cd ../
# --nomin
transcrypt --build --ecom --verbose binana.py
cd -

# Move the javascript library to the lib directory.
mv ../__target__/ ./lib

# Copy the example html file for testing.
cp ./src_aux/example.html ./lib/

cp src_aux/Example.ipynb* ./lib/
