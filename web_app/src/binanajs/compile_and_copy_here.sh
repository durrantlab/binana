source activate Python36

# Compile the python to javascript. Assumes transcrypt installed.
cd ../../../javascript/
./compile.sh
cd -

# Clean up old files.
ls | grep -v "compile_and_copy_here.sh" | awk '{print "rm " $1}' | bash

# Copy over compiled files.
cp ../../../javascript/lib/* ./
