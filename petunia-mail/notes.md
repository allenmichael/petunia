# Steps
* Install EB CLI
    * pip install awsebcli --upgrade --user
* eb init
* eb create
* git checkout master
    * eb use prod
* git checkout develop
    * eb use develop
* eb open
* eb deploy 
    * eb deploy --staged

# Code Pipeline
Create webhook to Github repo
Create CodeBuild -- buildspec.yml makes zip file
Create CodeDeploy -- Elastic Beanstalk target

