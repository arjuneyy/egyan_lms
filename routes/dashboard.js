var express = require('express');
var router = express.Router();

router.get('/dashboard', (req, res) => {
    res.render('pages/dashboard', {
        user: {
            fullname: req.session.fullname
        }
    });
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/api/login');
});

module.exports = router;