var express = require('express');
var router = express.Router();

// User Login
router.post('/login', (req, res) => {
    res.send('User Login');
});

// User Registration
// Must implement GET? and POST
router.post('/register', (req, res) => {
    res.send('User registration');
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