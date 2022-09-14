var express = require('express');
var router = express.Router();

var userService = require('../services/userService');


// User Login
router.post('/login', (req, res) => {
    userService.login(req.body.email, req.body.password)
        .then((user) => {
            res.send({
                'result': user,
                'message': 'Successfully logged in.'
            });
        })
        .catch((err) => res.status(400).send({ 'message': err }))
});

router.get('/users', (req, res) => {
    userService.findAll()
        .then((data) => res.send({ 'result': data }))
        .catch((err) => res.status(400).send({ 'message': err }));
});

// User Registration
// Must implement GET? and POST
router.post('/register', (req, res) => {
    const { fullname, type, email, password } = req.body
    userService.create(fullname, type, email, password)
        .then((user) => res.send({
            'result': user,
            'message': 'User has been successfuly registered.'
        }))
        .catch((error) => res.status(400).send({ 'message': error }));
});

// --- User Profile ---
// Update Profile
router.get('/editProfile/:id', (req, res) => {
    userService.findById(req.params.id)
        .then(
            (data) => res.send({ 'result': data }),
            (error) => res.status(400).send({ 'message': error })
        )
});

router.put('/changeProfile/:id', (req, res) => {
    const { fullname, type, email, password } = req.body
    userService.update(req.params.id, fullname, type, email, password)
        .then((user) => res.send({
            'result': user,
            'message': 'User has been successfuly updated.'
        }))
        .catch((error) => res.status(400).send({ 'message': error }));
});

router.delete('/user/:id', (req, res) => {
    userService.deleteUser(req.params.id)
        .then(
            (msg) => res.send({ 'message': msg }),
            (error) => res.status(400).send({ 'message': error })
        )
});

router.put('/changePassword', (req, res) => {
    res.send('Password has been updated.');
});


module.exports = router;