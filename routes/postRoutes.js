const express = require('express');
const router = express.Router();

const PostContrller = require('../controllers/postController');
const AuthHelper = require('../Helpers/AuthHelper');

router.get('/posts', AuthHelper.VerifyToken, PostContrller.GetAllPosts);
router.post('/post/add-post', AuthHelper.VerifyToken, PostContrller.AddPost);
router.post('/post/add-like', AuthHelper.VerifyToken, PostContrller.AddLike);
router.post('/post/add-comment', AuthHelper.VerifyToken, PostContrller.AddComment);

module.exports = router;