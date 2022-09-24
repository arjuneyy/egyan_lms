var express = require('express');
var router = express.Router();
const courseService = require('../services/courseService')

router.get('/dashboard', async (req, res) => {
    const courses = await courseService.findAll();
    res.render('pages/dashboard', {
        user: {
            fullname: req.session.fullname
        },
        courses: courses
    });
});

router.get('/createCourse', (req, res) => {
    res.render('pages/createCourse', {
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