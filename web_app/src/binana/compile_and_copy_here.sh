source activate Python36

# Clean up old files.
ls | grep -v "compile_and_copy_here.sh" | awk '{print "rm " $1}' | bash

# Compile the python to javascript. Assumes transcrypt installed.
cd ../../../javascript/
./compile.sh
cd -

# Copy over compiled files.
cp ../../../javascript/lib/* ./
