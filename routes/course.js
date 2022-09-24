var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const { check, validationResult } = require('express-validator');
const { upload } = require('../middleware/fileUpload');
const courseService = require('../services/courseService');

const createCoursePage = 'pages/createCourse'

const courseValidation = [
    check('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required.'),
    check('category')
        .trim()
        .notEmpty()
        .withMessage('Category is required.'),
    check('oneLiner')
        .trim()
        .notEmpty()
        .withMessage('One Liner is required.'),
    check('duration')
        .trim()
        .notEmpty()
        .withMessage('Duration is required.'),
    check('language')
        .trim()
        .notEmpty()
        .withMessage('Language is required.')
];


router.post('/createCourse', [courseValidation, upload.single('image')], (req, res) => {
    var errors = {};
    if (!validationResult(req).isEmpty()) {
        validationResult(req).array().forEach(err => {
            if (err['param'] in errors) {
                errors[err['param']].push(err['msg']);
            } else {
                errors[err['param']] = [err.msg];
            }
        });

        res.render(createCoursePage, {
            errors: errors,
            form: {
                ...req.body
            }
        });
    } else {
        const { name, category, oneLiner, duration, language, description, lessons } = req.body
        imageBuffer = fs.readFileSync(path.join('./uploads', req.file.filename));

        courseService.create(name, category, oneLiner, duration, language, description, lessons, imageBuffer)
            .then((course) => res.render('pages/dashboard', { showSwal: true, message: 'Course has been created.' }))
            .catch((errors) => {
                var mappedErrors = {};
                errors.forEach(err => {
                    if (err['param'] in errors) {
                        mappedErrors[err['path']].push(err['msg']);
                    } else {
                        mappedErrors[err['path']] = [err.msg];
                    }
                });

                console.log(errors)

                res.render(createCoursePage, {
                    errors: mappedErrors,
                    form: {
                        ...req.body
                    }
                })
            });
    }
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