const cryptoLib = require('./crypto/index');
const _ = require('lodash');
class Petunia {
    hi() {
        console.log('hi');
        console.log(_.random(40));
    }
    encrypt(hashlock, body) {
        return cryptoLib.encrypt(hashlock, body);
    }
}
module.exports = new Petunia();