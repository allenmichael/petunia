const aws = require('aws-sdk');
const docClient = new aws.DynamoDB.DocumentClient();
const table = process.env.PETUNIA_USERS_TABLE;

const dialog = require('./dialogActions');
const validators = require('./validators');

const PETUNIA_USER_SLOTS = {
    USERNAME_SLOT: 'userName'
};

exports.PetuniaUser = {
    fulfill: async (sessionAttributes, slots, intentName) => {
        let userName = Object.keys(slots).includes(PETUNIA_USER_SLOTS.USERNAME_SLOT) ? slots[PETUNIA_USER_SLOTS.USERNAME_SLOT] : "";
        
        if (userName.indexOf('|')) {
            const parts = userName.split('|');
            if (parts.length > 1) {
                userName = parts[1];
            }
        }
        
        const validation = validators.validatePetuniaUser(userName, PETUNIA_USER_SLOTS.USERNAME_SLOT);

        console.log(`searching for user: ${userName}`);
        if (!validation.isValid) {
            return dialog.elicit(
                sessionAttributes,
                slots,
                validation.slot,
                intentName,
                validation.message
            );
        } else {
            const params = {
                Key: {
                    'userName': userName
                },
                TableName: table
            };
            try {
                const result = await docClient.get(params).promise();

                if (!result.Item) {
                    return dialog.close(
                        sessionAttributes,
                        'Fulfilled',
                        {
                            contentType: 'PlainText',
                            content: `I couldn't find any info about ${userName}. I would apologize, but I think it's probably your fault.`
                        }
                    );
                }

                let totalPosts = 0;
                let devNullPosts = 0;
                let aesPosts = 0;
                let kmsPosts = 0;
                if (result.Item) {
                    totalPosts = result.Item.totalPosts || totalPosts;
                    devNullPosts = result.Item.devNullPosts || devNullPosts;
                    kmsPosts = result.Item.kmsPosts || kmsPosts;
                    aesPosts = result.Item.aesPosts || aesPosts;
                }
                return dialog.close(
                    sessionAttributes,
                    'Fulfilled',
                    {
                        contentType: 'PlainText',
                        content: `Information on ${userName}: ${totalPosts} total posts, ${devNullPosts} posts sent to /dev/null, ${aesPosts} posts encrypted with AES, ${kmsPosts} posts encrypted with KMS.`
                    }
                )
            } catch (e) {
                console.log(`Error retrieving ${userName}:`);
                console.log(e);
                return dialog.close(
                    sessionAttributes,
                    'Failed',
                    {
                        contentType: 'PlainText',
                        content: `There was an error getting information about the user: ${userName}`
                    }
                );
            }
        }
    }
}