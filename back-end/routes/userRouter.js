const express = require('express');
const ctrl = require('../controllers/userController');
const router = express.Router();

router.post('/signup', ctrl.signup);
router.get('/login', ctrl.login);
module.exports = router;
