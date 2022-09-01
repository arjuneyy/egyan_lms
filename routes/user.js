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
    // const user = new UserModel({
    //     fullname: "Arjun",
    //     type: "instructor",
    //     email: "armanipes@gmail.com",
    //     password: "admin123"
    // });

    // user.save()
    //     .then(() => {
    //         console.log("Successfully saved.");
    //         res.send("Successfully saved.");
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });

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