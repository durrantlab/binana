# Clean up old files.
ls | grep -v "copy.sh" | awk '{print "rm " $1}' | bash

# Compile the python to javascript. Assumes transcrypt installed.
cd ../../../javascript/
./compile.sh
cd -

# Copy over compiled files.
cp ../../../javascript/js_output/* ./
