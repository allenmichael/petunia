const aws = require('aws-sdk');
const crypto = require('crypto');
const kms = new aws.KMS();

exports.lambdaHandler = async (event, context) => {
    try {
        if (event.body) {
            const secret = crypto.randomBytes(256).toString('hex');
            
            const keyAlias = process.env.KMS_ALIAS || 'alias/devnull/share';
            const params = {
                KeyId: keyAlias,
                Plaintext: Buffer.from(secret, 'utf-8')
            };
            const encryptedKey = await kms.encrypt(params).promise();
            const key = encryptedKey.CiphertextBlob.slice(0, 32);

            delete secret;

            const iv = crypto.randomBytes(16);
            const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
            const encrypted = Buffer.concat([cipher.update(event.body, 'utf8'), cipher.final()]);

            delete key;

            return {
                'statusCode': 200,
                'body': JSON.stringify({
                    message: 'Obscured your post',
                    data: encrypted.toString('base64')
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
