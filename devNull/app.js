exports.lambdaHandler = async (event, context) => {
    try {
        Object.keys(event).forEach(key => { delete event[key]; });
        console.log(event);
        return {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'Deleted your data successfully',
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
