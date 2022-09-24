// @ts-nocheck
const CourseModel = require('../models/course').CourseModel;
const fs = require('fs');


async function create(name, category, oneLiner, duration, language, description, lessons, photoBuffer) {
    const course = new CourseModel({
        name: name,
        category: category,
        oneLiner: oneLiner,
        duration: duration,
        language: language,
        description: description,
        lessons: lessons,
        photo: {
            data: photoBuffer,
            contentType: 'image/png'
        }
    });

    try {
        return await course.save();
    } catch (err) {
        if (err.name === 'ValidationError') {
            var error = Object.values(err.errors).map(val => {
                return { 'value': val.value, 'path': val.path, 'msg': val.properties.message };
            });
            throw error;
        }

        throw err;
    }
}

async function findAll() {
    return await CourseModel.find();
}


module.exports = {
    create,
    findAll
}