# /dev/null as a Service
This is a technological breakthrough to be used in an upcoming anti-social media app.

# Requirements for all Projects
[Node v. 8.10 or greater](https://nodejs.org/en/)

[Docker](https://www.docker.com/)

[AWS SAM CLI](https://github.com/awslabs/aws-sam-cli)

[AWS CLI](https://aws.amazon.com/cli/)

# Usage
## Start the /dev/null API with SAM:

`sam build -t devNull/template.yaml -b .aws-sam/builds/devNull`

`sam local start-api -t .aws-sam/builds/devNull/template.yaml`

## Send data to /dev/null

`curl -X POST -H "Content-Type: application/json" -d '{"data":"really secure"}' localhost:3000/null`

`curl -F "file=@LICENSE" localhost:3000/null`

# Deploy /dev/null
Deploy your own /dev/null as a Service!

## Steps

`sam build -t devNull/template.yaml -b .aws-sam/builds/devNull`

`aws s3 mb YOUR_NAME-dev-null`

`sam package --s3-bucket amsxbg-dev-null --template-file .aws-sam/builds/devNull/template.yaml --output-template-file .aws-sam/builds/devNull/packaged-template.yaml`

`sam deploy --template-file .aws-sam/builds/devNull/packaged-template.yaml --stack-name DevNull --capabilities CAPABILITY_IAM`

This command will return your deployed /dev/null API endpoint:

`aws cloudformation describe-stacks --stack-name DevNull --query Stacks[0].Outputs[].[OutputKey,OutputValue]`

# KMS Share
A service proposed as an alternative to /dev/null-aaS, or potentially, as an enhancement.

KMS Share will create an AWS KMS customer master key (CMK), and you may be charged for usage. Review the [pricing page](https://aws.amazon.com/kms/pricing/) before deploying for more information.

KMS Share uses [AWS KMS](https://aws.amazon.com/kms/) to encrypt cryptographically strong pseudo-random data that is then used as a key to encrypt your data with AES-256. Finally, the pseudo-random data and the encrypted data used as a key for AES-256 is destoryed.

# Usage
## Start the KMS Share API with SAM:

**Note:** This API will fail if the KMS key and alias don't exist in your AWS account. 

`sam build -t kmsShare/template.yaml -b .aws-sam/builds/kmsShare`

`sam local start-api -t .aws-sam/builds/kmsShare/template.yaml`

## Send data to KMS Share

`curl -X POST -H "Content-Type: application/json" -d '{"data":"really secure"}' localhost:3000/kms-share`

`curl -F "file=@LICENSE" localhost:3000/kms-share`

# Deploy KMS Share

## Steps

`sam build -t kmsShare/template.yaml -b .aws-sam/builds/kmsShare`

`aws s3 mb YOUR_NAME-kms-share`

`sam package --s3-bucket YOUR_NAME-kms-share --template-file .aws-sam/builds/kmsShare/template.yaml --output-template-file .aws-sam/builds/kmsShare/packaged-template.yaml`

`sam deploy --template-file .aws-sam/builds/kmsShare/packaged-template.yaml --stack-name KMSShare --capabilities CAPABILITY_NAMED_IAM`

This command will return your deployed KMS Share API endpoint:

`aws cloudformation describe-stacks --stack-name KMSShare --query Stacks[0].Outputs[].[OutputKey,OutputValue]`

# AES Share
An alternative to the KMS Share service.

AES Share generates cryptographically strong pseudo-random data for a password and salt and then uses 100,000 iterations of `pbkdf2` with SHA-512 as the digest. 

This hash is then encrypted with AES-256 using a different cryptographically strong pseudo-random data as the key. 

Using this encrypted hash as the key, AES Share then encrypts your data with AES-256. 

All keys, passwords, salts, and hashes are destroyed.

# Usage
## Start the AES Share API with SAM:

`sam build -t aesShare/template.yaml -b .aws-sam/builds/aesShare`

`sam local start-api -t .aws-sam/builds/aesShare/template.yaml`

## Send data to AES Share

`curl -X POST -H "Content-Type: application/json" -d '{"data":"like, really secure, you know?"}' localhost:3000/aes-share`

`curl -F "file=@LICENSE" localhost:3000/aes-share`

# Deploy AES Share

## Steps

`sam build -t aesShare/template.yaml -b .aws-sam/builds/aesShare`

`aws s3 mb YOUR_NAME-aes-share`

`sam package --s3-bucket YOUR_NAME-aes-share --template-file .aws-sam/builds/aesShare/template.yaml --output-template-file .aws-sam/builds/aesShare/packaged-template.yaml`

`sam deploy --template-file .aws-sam/builds/aesShare/packaged-template.yaml --stack-name AESShare --capabilities CAPABILITY_IAM`

This command will return your deployed AES Share API endpoint:

`aws cloudformation describe-stacks --stack-name AESShare --query Stacks[0].Outputs[].[OutputKey,OutputValue]`