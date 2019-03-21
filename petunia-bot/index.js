'use strict';
const dispatch = require('./dispatcher');
const dialog = require('./dialogActions');

exports.handler = async (event, context) => {
    try {
        return await dispatch.process(event);
    } catch (e) {
        console.log(`Failed to dispatch:`);
        console.log(e);
        return dialog.close(
            dispatch.getSessionAttributes(event),
            'Failed',
            {
                contentType: 'PlainText',
                content: "I couldn't answer your question. I'm too busy deleting things."
            }
        );
    }
};