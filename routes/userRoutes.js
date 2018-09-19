const express = require('express');
const router = express.Router();

const UserController = require('../controllers/usersController');
const AuthHelper = require('../Helpers/AuthHelper');

router.get('/users', AuthHelper.VerifyToken, UserController.GetAllUsers);

module.exports = router;