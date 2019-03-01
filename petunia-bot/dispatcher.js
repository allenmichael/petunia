const dialog = require('./dialogActions');
const petuniaUser = require('./petuniaUserFulfillment');

const process = async (event) => {
    if (event && event.currentIntent && event.currentIntent.name) {
        return dispatch(event);
    } else {
        return dialog.close(
            getSessionAttributes(event),
            'Failed',
            {
                "contentType": "PlainText",
                "content": "Something went wrong while finding an answer."
            }
        )
    }
}

const dispatch = async event => {
    let response = {};
    switch (event.currentIntent.name) {
        case 'PetuniaUser':
            response = await petuniaUser.PetuniaUser.fulfill(getSessionAttributes(event), getSlots(event), event.currentIntent.name)
            break;
        default:
            console.log('Intent not found.');

            response = dialog.close(
                getSessionAttributes(event),
                'Failed',
                {
                    "contentType": "PlainText",
                    "content": "I can't process that question."
                }
            )
            break;
    }
    return response;
}

const getSlots = (event) => {
    let slots = {};
    if (event.currentIntent && event.currentIntent.slots) {
        slots = event.currentIntent.slots;
    }
    return slots;
}

const getSessionAttributes = (event) => {
    let sessionAttributes = {};
    if (event.currentIntent && event.currentIntent.sessionAttributes) {
        sessionAttributes = event.currentIntent.sessionAttributes;
    }
    return sessionAttributes;
}

const getRequestAttributes = (event) => {
    let requestAttributes = {};
    if (event.currentIntent && event.currentIntent.requestAttributes) {
        requestAttributes = event.currentIntent.requestAttributes;
    }
    return requestAttributes;
}

module.exports = {
    getSessionAttributes,
    getRequestAttributes,
    getSlots,
    process
}