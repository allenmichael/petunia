#!/usr/bin/env bash

zip -r out.zip nodejs/
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output=text)
aws s3 mb s3://$ACCOUNT_ID-petunia-lib
sam package --template-file template.yaml --s3-bucket $ACCOUNT_ID-petunia-lib --output-template out.yaml
sam deploy --template-file out.yaml --stack-name PetuniaLib --capabilities CAPABILITY_IAM