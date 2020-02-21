#!/bin/bash
set -e
source build/vars.sh

echo Uploading to lambda
"${AWS_PATH}"aws lambda update-function-code \
--function-name ing-report \
--zip-file fileb://"${ZIP_FILE}" \
--profile personal-admin
echo Done
