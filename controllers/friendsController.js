const HttpStatus = require('http-status-codes');
const User = require('../models/userModels');

module.exports = {
    FollowUser(req, res) {
        const followUser = async () => {
            await User.update({
                _id: req.user._id,
                "following.userFollowed": {
                    $ne: req.body.userFollowed
                }
            }, {
                $push: {
                    following: {
                        userFollowed: req.body.userFollowed
                    },
                    notifications: {
                        senderId: req.user._id,
                        message: `${req.user.username} is now following you`,
                        created: new Date(),
                        viewProfile: false
                    }
                }
            });


            await User.update({
                _id: req.body.userFollowed,
                "following.follower": {
                    $ne: req.user._id
                }
            }, {
                $push: {
                    followers: {
                        follower: req.user._id
                    }
                }
            });
        };
        followUser()
            .then(() => {
                res.status(HttpStatus.OK).json({
                    message: 'Following user now'
                });
            })
            .catch(err => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    message: 'Error occured'
                });
            });
    },

    UnFollowUser(req, res) {
        const unFollowUser = async () => {
            await User.update({
                _id: req.user._id
            }, {
                $pull: {
                    following: {
                        userFollowed: req.body.userFollowed
                    }
                }
            });


            await User.update({
                _id: req.body.userFollowed
            }, {
                $pull: {
                    followers: {
                        follower: req.user._id
                    }
                }
            });
        };
        unFollowUser()
            .then(() => {
                res.status(HttpStatus.OK).json({
                    message: 'UnFollowing user now'
                });
            })
            .catch(err => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    message: 'Error occured'
                });
            });
    }
};