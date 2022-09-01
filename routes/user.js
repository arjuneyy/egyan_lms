var express = require('express');
var router = express.Router();

var userService = require('../services/userService');


// User Login
router.post('/login', (req, res) => {
    res.send('User Login');
});

router.get('/users', (req, res) => {
    userService.findAll()
        .then(
            (data) => res.send(data),
            (err) => res.status(400).send(err)
        );
});

// User Registration
// Must implement GET? and POST
router.post('/register', (req, res) => {
    const { fullname, type, email, password } = req.body
    userService.create(fullname, type, email, password)
        .then(
            (success) => res.send({ 'message': success }),
            (fail) => res.status(400).send({ 'message': fail })
        );
});

// --- User Profile ---
// Update Profile
router.get('/editProfile/:id', (req, res) => {
    const id = req.params.id;
    userService.findById(id)
        .then(
            (data) => res.send(data),
            (error) => res.status(400).send({ 'message': error })
        )
});

router.put('/changeProfile/:id', (req, res) => {
    res.send('Profile has been updated.');
});

router.put('/changePassword', (req, res) => {
    res.send('Password has been updated.');
});


module.exports = router;