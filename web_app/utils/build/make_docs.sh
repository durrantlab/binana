rm -rf technical_docs
typedoc --out technical_docs --exclude "**/*.js" --ignoreCompilerErrors --mode modules --hideGenerator src
