const crypto = require('crypto');

exports.lambdaHandler = async (event, context) => {
    try {
        if (event.body) {
            const length = (process.env.SALT_AND_PW_LENGTH / 1) || 256;

            const secret = crypto.randomBytes(length).toString('hex');
            const saltSecret = crypto.randomBytes(length).toString('hex');
            const ivh = crypto.randomBytes(16);
            const hashSecret = crypto.pbkdf2Sync(secret, saltSecret, 100000, 32, 'sha512');

            delete secret;
            delete saltSecret;
            delete ivh;

            const cipherKey = crypto.randomBytes(32);
            const hashCipher = crypto.createCipheriv('aes-256-gcm', cipherKey, ivh);
            const hashlock = Buffer.concat([hashCipher.update(hashSecret, 'utf8'), hashCipher.final()]);

            delete hashSecret;

            const iv = crypto.randomBytes(16);
            const cipher = crypto.createCipheriv('aes-256-gcm', hashlock, iv);
            const encrypted = Buffer.concat([cipher.update(event.body, 'utf8'), cipher.final()]);

            delete hashlock;
            delete iv;

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
