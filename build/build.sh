#!/bin/bash
set -e

source build/vars.sh

if [[ -f "${ZIP_FILE}" ]]; then
  echo "File exists: removing"
  rm "${ZIP_FILE}"
fi

echo Uninstalling chrome dependencies
npm uninstall --save puppeteer
npm uninstall --save chrome-aws-lambda
echo Building zip
zip -r "${ZIP_FILE}" .
echo Reinstalling dependencies
npm install --save puppeteer
npm install --save chrome-aws-lambda
