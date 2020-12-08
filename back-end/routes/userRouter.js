const express = require('express');
const ctrl = require('../controllers/userController');
const router = express.Router();
const password_middleware = require('../middleware/password_middleware')

router.post('/signup', password_middleware, ctrl.signup);
router.post('/login', ctrl.login);
module.exports = router;
