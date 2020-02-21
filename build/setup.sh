#!/bin/bash
set -e

source build/vars.sh

echo Updating lambda layer
/c/Users/marcos/AppData/Local/Programs/Python/Python36-32/Scripts/aws lambda update-function-configuration \
--function-name ing-report \
--layers arn:aws:lambda:us-west-2:764866452798:layer:chrome-aws-lambda:10 \
--profile personal-admin
