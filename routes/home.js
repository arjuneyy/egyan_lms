var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
var userService = require('../services/userService');


const registrationValidation = [
    check('fullname')
        .trim()
        .notEmpty()
        .withMessage('Fullname is required.')
        .isLength({ min: 4 })
        .withMessage('Fullname must be atleast 4+ characters long.'),
    check('type')
        .notEmpty()
        .withMessage('Type is required.'),
    check('emailId')
        .notEmpty()
        .withMessage('Email is required.')
        .isEmail()
        .withMessage('Must be a valid email.')
        .custom(async (email) => {
            const existingUser = await userService.findByEmailId(email);
            if (existingUser) {
                throw new Error('Email already in use.')
            } else {
                return true;
            }
        }),
    check('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required.'),
    check('passwordConfirmation')
        .trim()
        .notEmpty()
        .withMessage('Password is required.')
        .custom((passwordConfirmation, { req }) => {
            if (passwordConfirmation !== req.body.password) {
                throw new Error('Password must match.')
            } else {
                return true;
            }
        })
];

const loginValidation = [
    check('loginEmailId')
        .notEmpty()
        .withMessage('Email is required.')
        .isEmail()
        .withMessage('Invalid email address.'),
    check('loginPassword')
        .notEmpty()
        .withMessage('Password is required.')
];

router.get('/', (req, res) => {
    res.render('pages/home');
});

router.get('/register', (req, res) => {
    res.render('pages/home');
});

router.get('/login', (req, res) => {
    res.render('pages/home');
});


router.post('/register', registrationValidation, (req, res) => {
    var errors = {};
    if (!validationResult(req).isEmpty()) {
        validationResult(req).array().forEach(err => {
            if (err['param'] in errors) {
                errors[err['param']].push(err['msg']);
            } else {
                errors[err['param']] = [err.msg];
            }
        });

        res.render('pages/home', {
            errors: errors,
            form: {
                ...req.body
            }
        });
    } else {
        const { fullname, type, emailId, password } = req.body
        userService.create(fullname, type, emailId, password)
            .then((user) => res.render('pages/home', { showSwal: true, message: 'User has been registered.' }))
            .catch((errors) => {
                var mappedErrors = {};
                errors.forEach(err => {
                    if (err['param'] in errors) {
                        mappedErrors[err['path']].push(err['msg']);
                    } else {
                        mappedErrors[err['path']] = [err.msg];
                    }
                });

                res.render('pages/home', {
                    errors: mappedErrors,
                    form: {
                        ...req.body
                    }
                })
            });
    }
});

router.post('/login', loginValidation, (req, res) => {
    const loginValidationRes = validationResult(req);

    if (!loginValidationRes.isEmpty()) {
        var errors = {};
        loginValidationRes.array().forEach(err => {
            if (err['param'] in errors) {
                errors[err['param']].push(err['msg']);
            } else {
                errors[err['param']] = [err.msg];
            }
        });

        res.render('pages/home', {
            errors: errors,
            form: {
                ...req.body
            }
        });
    } else {
        userService.login(req.body.loginEmailId, req.body.loginPassword)
            .then((user) => {
                req.session.fullname = user.fullname;
                req.session.emailId = user.emailId;
                req.session.isAuthenticated = true;

                res.redirect('/api/dashboard');
            })
            .catch((error) => {
                res.render('pages/home', {
                    errors: {
                        message: error,
                        form: {
                            ...req.body
                        }
                    }
                })
            })
    }
});


module.exports = router;