# /dev/null as a Service
This is a technological breakthrough to be used in an upcoming anti-social media app.

# Requirements
[Node v. 8.10 or greater](https://nodejs.org/en/)

[Docker](https://www.docker.com/)

[AWS SAM CLI](https://github.com/awslabs/aws-sam-cli)

[AWS CLI](https://aws.amazon.com/cli/)

# Usage
## Start the API with SAM:
`sam build`

`sam local start-api`
## Send data to /dev/null
`curl -X POST -H "Content-Type: application/json" localhost:3000/null -d '{"data":"really secure"}'`

`curl -F "image=@./template.yaml" localhost:3000/null`

# Deploy
Deploy your own /dev/null as a Service!
## Steps
`sam build`

`aws s3 mb YOUR_NAME-dev-null`

`sam package --s3-bucket YOUR_NAME-dev-null --output-template-file packaged-template.yaml`

`sam deploy --template-file packaged-template.yaml --stack-name DevNull --capabilities CAPABILITY_IAM`

This command will return your deployed /dev/null API endpoint:

`aws cloudformation describe-stacks --stack-name DevNull --query Stacks[0].Outputs[].[OutputKey,OutputValue]`
