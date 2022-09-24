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
    res.render('pages/register');
});

router.get('/register', (req, res) => {
    res.render('pages/register');
});

router.get('/login', (req, res) => {
    res.render('pages/register');
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

        res.render('pages/register', {
            errors: errors,
            form: {
                ...req.body
            }
        });
    } else {
        const { fullname, type, emailId, password } = req.body
        userService.create(fullname, type, emailId, password)
            .then((user) => res.render('pages/register', { showSwal: true, message: 'User has been registered.' }))
            .catch((errors) => {
                var mappedErrors = {};
                errors.forEach(err => {
                    if (err['param'] in errors) {
                        mappedErrors[err['path']].push(err['msg']);
                    } else {
                        mappedErrors[err['path']] = [err.msg];
                    }
                });

                res.render('pages/register', {
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

        res.render('pages/register', {
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
                req.session.userId = user.id;

                res.redirect('/api/dashboard');
            })
            .catch((error) => {
                res.render('pages/register', {
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

const changeProfileValidation = [
    check('fullname')
        .trim()
        .notEmpty()
        .withMessage('Fullname is required.')
        .isLength({ min: 4 })
        .withMessage('Fullname must be atleast 4+ characters long.'),
    check('emailId')
        .notEmpty()
        .withMessage('Email is required.')
        .isEmail()
        .withMessage('Must be a valid email.')
        .custom(async (email, { req }) => {
            const existingUser = await userService.findByEmailId(email);

            if (existingUser && existingUser.id !== req.session.userId) {
                throw new Error('Email already in use.')
            } else {
                return true;
            }
        })
]


router.put('/changeProfile', changeProfileValidation, (req, res) => {
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

        res.render('pages/editProfile', {
            errors: errors,
            user: {
                fullname: req.session.fullname,
            },
            form: {
                ...req.body
            }
        });
    } else {
        const { fullname, emailId } = req.body;
        userService.updateProfile(req.session.userId, fullname, emailId)
            .then((user) => {
                req.session.fullname = user.fullname;
                req.session.emailId = user.emailId;
                res.render('pages/editProfile', {
                    showSwal: true,
                    message: 'User profile has been updated.',
                    user: {
                        fullname: req.session.fullname,
                    },
                    form: {
                        fullname: req.session.fullname,
                        emailId: req.session.emailId
                    }
                })
            })
            .catch((errors) => {
                var mappedErrors = {};

                if (Array.isArray(errors)) {
                    errors.forEach(err => {
                        if (err['param'] in errors) {
                            mappedErrors[err['path']].push(err['msg']);
                        } else {
                            mappedErrors[err['path']] = [err.msg];
                        }
                    });
                } else {
                    throw errors;
                }

                res.render('pages/editProfile', {
                    errors: mappedErrors,
                    user: {
                        fullname: req.session.fullname,
                    },
                    form: {
                        ...req.body
                    }
                })
            });
    }
});

const updatePasswordValidation = [
    check('newPassword')
        .trim()
        .notEmpty()
        .withMessage('Password is required.'),
    check('confirmPassword')
        .trim()
        .notEmpty()
        .withMessage('Password is required.')
        .custom((confirmPassword, { req }) => {
            if (confirmPassword !== req.body.newPassword) {
                throw new Error('Password must match.')
            } else {
                return true;
            }
        })
]

router.put('/changePassword', updatePasswordValidation, (req, res) => {
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

        res.render('pages/editProfile', {
            errors: errors,
            user: {
                fullname: req.session.fullname,
            },
            form: {
                ...req.body
            }
        });
    } else {
        const { newPassword, confirmPassword } = req.body;
        userService.updatePassword(req.session.userId, newPassword)
            .then((user) => {
                req.session.fullname = user.fullname;
                req.session.emailId = user.emailId;
                res.render('pages/editProfile', {
                    showSwal: true,
                    message: 'Password has been updated.',
                    user: {
                        fullname: req.session.fullname,
                    },
                    form: {
                        ...req.body
                    }
                })
            })
            .catch((errors) => {
                var mappedErrors = {};
                if (Array.isArray(errors)) {
                    errors.forEach(err => {
                        if (err['param'] in errors) {
                            mappedErrors[err['path']].push(err['msg']);
                        } else {
                            mappedErrors[err['path']] = [err.msg];
                        }
                    });
                } else {
                    throw errors;
                }

                res.render('pages/editProfile', {
                    errors: mappedErrors,
                    user: {
                        fullname: req.session.fullname,
                    },
                    form: {
                        ...req.body
                    }
                })
            });
    }
});



module.exports = router;