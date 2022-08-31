var express = require('express');
var router = express.Router();


router.post('/createCourse', (req, res) => {
    res.send({ 'message': 'Course has been created.' });
});

router.get('/viewCourse', (req, res) => {
    res.send({ 'data': [], 'message': 'List of courses.' });
});

router.get('/viewCourse/:id', (req, res) => {
    let id = req.params.id;
    res.send({ 'message': `Course info for course with id '${id}'.` });
});

router.put('/updateCourse/:id', (req, res) => {
    let id = req.params.id;
    res.send({ 'message': `Course with id '${id}' has been updated.` });
});

router.delete('/deleteCourse/:id', (req, res) => {
    let id = req.params.id;
    res.send({ 'message': `Course with id '${id}' has been deleted.` });
});

module.exports = router;