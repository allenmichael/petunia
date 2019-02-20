const aws = require('aws-sdk');
aws.config.region = process.env.AWS_REGION;
const ddb = new aws.DynamoDB();
const ddbTbl = process.env.SIGNUP_TABLE;

module.exports.saveEmail = async (email, ip) => {
    console.log(ddbTbl);
    const item = {
        'email': { 'S': email },
        'ip': { 'S': ip },
        'requestedPreviewAcess': { 'BOOL': true }
    };
    try {
        const saved = await ddb.putItem({
            'TableName': ddbTbl,
            'Item': item,
            'Expected': { email: { Exists: false } }
        }).promise();
        console.log(saved);
        return {
            status: 201,
            message: "Thanks for signing up! We'll keep you in the loop."
        }
    } catch (err) {
        if (err.code === 'ConditionalCheckFailedException') {
            return {
                status: 409,
                message: "Looks like you've already signed up!"
            }
        } else {
            throw err;
        }
    }
}