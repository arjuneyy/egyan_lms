var express = require('express');
var router = express.Router();
var UserModel = require('../models/user').UserModel;


// User Login
router.post('/login', (req, res) => {
    res.send('User Login');
});

router.get('/users', (req, res) => {
    UserModel.find().exec((err, result) => {
        res.send(result);
    });
});

// User Registration
// Must implement GET? and POST
router.post('/register', (req, res) => {
    const user = new UserModel({
        fullname: req.body.fullname,
        type: req.body.type,
        email: req.body.email,
        password: req.body.password
    });

    user.save()
        .then(() => {
            res.send({ 'message': 'User has been successfully registered.' });
        })
        .catch(err => {
            if (err.name === 'ValidationError') {
                error = Object.values(err.errors).map(val => val.message);
                res.status(400).send({ 'message': error })
                return;
            } else if (err.name === 'MongoServerError' && err.code === 11000) {
                res.status(400).send({ 'message': 'Email must be unique.' });
                return;
            }
            res.status(500).send(err);
        });
});

// --- User Profile ---
// Update Profile
router.get('/editProfile/:id', (req, res) => {
    res.send("Profile info retrieved.");
});

router.put('/changeProfile/:id', (req, res) => {
    res.send('Profile has been updated.');
});

router.put('/changePassword', (req, res) => {
    res.send('Password has been updated.');
});


module.exports = router;