const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/authController');

router.post('/register', AuthController.CreateUser);
router.post('/login', AuthController.LoginUser);

module.exports = router;