exports.close = (sessionAttributes, fulfillmentState, message) => {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Close',
            fulfillmentState,
            message,
        },
    };
}

exports.confirm = (sessionAttributes, intentName, slots, message) => {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'ConfirmIntent',
            slots,
            intentName,
            message,
        }
    }
}

exports.elicit = (sessionAttributes, slots, slotToElicit, intentName, message) => {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'ElicitSlot',
            slots,
            slotToElicit,
            intentName,
            message,
        },
    };
}