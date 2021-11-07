# This script only works if transcrypt is installed.
# pip install transcrypt

# Clean previous version.
rm -rf ../python/__target__/ ./lib/

# Compile the python file.
cd ../python/
# --nomin
transcrypt --build --nomin --ecom --verbose binana.py
cd -

# Move the javascript library to the lib directory.
mv ../python/__target__/ ./lib

# Copy aux files.
cp ./src_aux/* ./lib/

# Modify all js files to include license notice.
ls lib/binana*.js | awk '{print "cat src_aux/license_info.txt > t; cat " $1 " >> t; mv t " $1}' | bash

# For debugging
# rm ./lib/*.ipynb
# ln -s $(realpath ./src_aux/*.ipynb) ./lib/
