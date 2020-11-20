# Must be run from the main directory.

# When using closure compiler, it creates empty files that aren't needed.
cd dist/
ls -l | grep " 0 "  | awk '{print "rm " $9}' | bash
cd -

# Prevent 3Dmol.js from reporting back to the mother ship. I thought I could
# set this programmatically, but couldn't get it to work. Best just to modify
# the code to prevent it.
cd dist/
grep -l "$3Dmol.notrack" *.js | awk '{print "cat " $1 " | sed \"s|\\$3Dmol.notrack|true|g\" > t; mv t " $1}'  | bash
cd -

# You need to closure compile vendor..js too. Let's use js version for maximal
# compatibility.
echo "Check for errors above. Enter to start compiling vendor js and other js files..."
cd dist
ls vendors*js runtime*js styles*js | awk '{print "echo Compiling " $1 ";node ../node_modules/google-closure-compiler/cli.js " $1 " > t; mv t " $1}' | bash
cd -

# If there is a .min.js file, delete any associated .js file.
find dist/ -name "*.min.js" | sed "s/\.min\././g" | awk '{print "rm -rf " $0}' | bash

# Add the license to the top of the app..js file. Tries using @license, but
# closure compiler didn't put it right at the top.
cd dist
echo "/**
 * BINANA Copyright 2019 Jacob Durrant
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */" > t
ls app.*js | awk '{print "cat t > " $1 ".tmp; cat " $1 " >> " $1 ".tmp; mv " $1 ".tmp " $1}' | bash
rm t
cd -

# Also create a ZIP file of the dist directory, for convenient distribution.
mv dist binana
zip -r binana.zip binana
mv binana dist

# Build the docs while you're at it.
. utils/build/make_docs.sh

# Let the user know that compilation is finished. Works only on macOS.
say "Beep"
