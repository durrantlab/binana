# This script only works if transcrypt is installed.
# pip install transcrypt

# Clean previous version.
rm -rf ../__target__/ ./js_output/

# Compile the python file.
cd ../
# --nomin
transcrypt --build --ecom --verbose binana.py
cd -

# Move the javascript library to the js_output directory.
mv ../__target__/ ./js_output

# Copy the example html file for testing.
cp test.html.src ./js_output/test.html
