const express = require('express');
const router = express.Router();

const MessageController = require('../controllers/messageController');
const AuthHelper = require('../Helpers/AuthHelper');

router.post('/chat-messages/:sender_Id/:receiver_Id',
    AuthHelper.VerifyToken,
    MessageController.SendMessage
);

module.exports = router;