// กวดสอบฟอม
const Joi = require('joi');
// กวดสอบ http status modules
const HttpStatus = require('http-status-codes');

// Encrtypt password before save data to DB
const bcrypt = require('bcryptjs');
// add JWT = Jason web token
const jwt = require('jsonwebtoken');



// นำ schema เข้ามาเพื่อรับค่า
const UserModels = require('../models/userModels');
// function จัดกานให้แต่ละคำตัวอักสอนทางหน้าจะเป็นโตใหย่
const Helpers = require('../Helpers/helpers');
//
const dbConfig = require('../config/secret');

module.exports = {
    async CreateUser(req, res) {
        const schema = Joi.object().keys({
            username: Joi.string()
                .min(5)
                .max(16)
                .required(),
            email: Joi.string()
                .email()
                .required(),
            password: Joi.string()
                .min(5)
                .required()
        });

        const {
            error,
            value
        } = Joi.validate(req.body, schema);
        console.log(value);
        if (error && error.details) {
            return res
                .status(HttpStatus.BAD_REQUEST)
                .json({
                    // what is msg ?
                    msg: error.details
                });
        }

        // กวดสอบว่ามีอีเมวนี้หลืยัง
        const userEmail = await UserModels.findOne({
            email: Helpers.lowerCase(req.body.email)
        });
        if (userEmail) {
            return res.status(HttpStatus.CONFLICT).json({
                message: 'Email alreay exist'
            });
        }

        // กวดสอบว่ามีชื่อนี้หลืยัง
        const userName = await UserModels.findOne({
            username: Helpers.firstLetterUppercase(req.body.username)
        });
        if (userName) {
            return res.status(HttpStatus.CONFLICT).json({
                message: 'Username has already exist'
            });
        }

        // เข้าละหัดก่อนบันทืกข้อมูล
        return bcrypt.hash(value.password, 10, (err, hash) => {
            if (err) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: 'Error hasing password'
                });
            }
            const body = {
                username: Helpers.firstLetterUppercase(value.username),
                email: Helpers.lowerCase(value.email), // value = req.body.email = รับข้อมูนจากผู้ใช้
                password: hash
            };
            UserModels.create(body).then((user) => {
                // to generate token
                const token = jwt.sign({
                    data: user
                }, dbConfig.secret, {
                    expiresIn: '120'
                });
                // to save JWT in cookie
                res.cookie('auth', token);
                res.status(HttpStatus.CREATED).json({
                    message: 'User created successfully',
                    user,
                    token
                });
            }).catch(err => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    message: 'Error occured '
                });
            });
        });
    },

    async LoginUser(req, res) {
        if (!req.body.username || !req.body.password) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'No empty fields allowed'
            });
        }

        await UserModels.findOne({
                username: Helpers.firstLetterUppercase(req.body.username)
            }).then(user => {
                if (!user) {
                    return res.status(HttpStatus.NOT_FOUND).json({
                        message: 'Username not found'
                    });
                }

                return bcrypt.compare(req.body.password, user.password).then((result) => {
                    if (!result) {
                        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                            message: 'Password is incorrect'
                        });
                    }
                    const token = jwt.sign({
                        data: user
                    }, dbConfig.secret, {
                        expiresIn: '5h'
                    });
                    res.cookie('auth', token);
                    return res.status(HttpStatus.OK).json({
                        message: 'Login Successful',
                        user,
                        token
                    });
                })
            })
            .catch(err => {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    message: 'Error occured'
                });
            })
    }
};