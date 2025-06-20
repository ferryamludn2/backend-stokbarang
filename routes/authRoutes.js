const router = require('express').Router();
const { login } = require('../controllers/authController');
const authController = require('../controllers/authController');
router.post('/login', login);
router.post('/register', authController.register);
module.exports = router;