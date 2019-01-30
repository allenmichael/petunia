const aws = require('aws-sdk');
const kms = new aws.KMS();

exports.lambdaHandler = async (event, context) => {
    try {
        if (event.body) {
            const params = {
                KeyId: 'alias/devnull/share',
                Plaintext: Buffer.from(event.body, 'utf-8')
            };
            const encrypted = await kms.encrypt(params).promise()
            return {
                'statusCode': 200,
                'body': JSON.stringify({
                    message: 'Obscured your post',
                    data: encrypted.CiphertextBlob.toString('base64')
                })
            }
        }
        return {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'The safest data to post: nothing'
            })
        }
    } catch (err) {
        console.log(err);
        return {
            'statusCode': 500,
            'body': JSON.stringify({
                message: 'Ouch, your data hurt me',
            })
        };
    }
};
