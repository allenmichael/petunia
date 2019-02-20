const express = require('express');
const { check } = require('express-validator/check');
const router = express.Router();

const indexCtrl = require('../controllers/indexController');

router.get('/', indexCtrl.main);
router.post('/sign-up',
    [check('email').isEmail().normalizeEmail()],
    indexCtrl.signUp);

module.exports = router;