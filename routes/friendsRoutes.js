const express = require('express');
const router = express.Router();

const FriendsController = require('../controllers/friendsController');
const AuthHelper = require('../Helpers/AuthHelper');

router.post('/follow-user', AuthHelper.VerifyToken, FriendsController.FollowUser);
router.post('/unfollow-user', AuthHelper.VerifyToken, FriendsController.UnFollowUser);

module.exports = router;