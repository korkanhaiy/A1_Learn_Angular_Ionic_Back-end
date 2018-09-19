const express = require('express');
const router = express.Router();

const UserController = require('../controllers/usersController');
const AuthHelper = require('../Helpers/AuthHelper');

router.get('/users', AuthHelper.VerifyToken, UserController.GetAllUsers);
router.get('/user/:id', AuthHelper.VerifyToken, UserController.GetUser);
router.get('/user/:username', AuthHelper.VerifyToken, UserController.GetUserByName);

module.exports = router;