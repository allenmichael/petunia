exports.validatePetuniaUser = (userName, slot) => {
    const isValid = (userName && userName !== '') ? true : false;
    const content = (isValid) ? '' : 'I had trouble getting information on that user. Please try another user.';
    const message = {
        contentType: 'PlainText',
        content
    }
    return {
        slot,
        message,
        isValid
    }
}