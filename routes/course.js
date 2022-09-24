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


router.post('/createCourse', upload.single('image'), courseValidation, (req, res) => {
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
            action: 'POST',
            errors: errors,
            form: {
                ...req.body
            }
        });
    } else {
        const { name, category, oneLiner, duration, language, description, lessons } = req.body
        imageBuffer = null;

        if (req.file && 'filename' in req.file) {
            imageBuffer = fs.readFileSync(path.join('./uploads', req.file.filename));
        }

        courseService.create(name, category, oneLiner, duration, language, description, lessons, imageBuffer)
            .then((course) => res.redirect('dashboard'))
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

                res.render(createCoursePage, {
                    action: 'POST',
                    errors: mappedErrors,
                    form: {
                        ...req.body
                    }
                })
            });
    }
});

router.get('/viewCourse', async (req, res) => {
    const course = await courseService.findById(req.query.id);
    res.render('pages/viewCourse', {
        course: course
    });
});

router.get('/viewCourse/:id', (req, res) => {
    let id = req.params.id;
    res.send({ 'message': `Course info for course with id '${id}'.` });
});

router.put('/updateCourse/:id', upload.single('image'), courseValidation, (req, res) => {
    let id = req.params.id;
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
            action: 'PUT',
            errors: errors,
            form: {
                ...req.body,
                id: id
            }
        });
    } else {
        const { name, category, oneLiner, duration, language, description, lessons } = req.body
        imageBuffer = null;

        if (req.file && 'filename' in req.file) {
            imageBuffer = fs.readFileSync(path.join('./uploads', req.file.filename));
        }

        courseService.update(id, name, category, oneLiner, duration, language, description, lessons, imageBuffer)
            .then((course) => res.redirect('/api/dashboard'))
            .catch((errors) => {
                console.log(errors)
            });
    }
});

router.get('/deleteCourse/:id', (req, res) => {
    courseService.deleteCourse(req.params.id)
        .then((msg) => res.redirect('/api/deleteCourse'))
        .catch(err => console.log(err));
});

module.exports = router;