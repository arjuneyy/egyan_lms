// @ts-nocheck
const CourseModel = require('../models/course').CourseModel;


async function create(name, category, oneLiner, duration, language, description, lessons, photoBuffer) {
    if (photoBuffer) {
        photoBuffer = {
            data: photoBuffer,
            contentType: 'image/png'
        }
    }
    const course = new CourseModel({
        name: name,
        category: category,
        oneLiner: oneLiner,
        duration: duration,
        language: language,
        description: description,
        lessons: lessons,
        photo: photoBuffer
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

async function findById(id) {
    return await CourseModel.findById(id);
}

async function deleteCourse(id) {
    try {
        let foundCourse = await findById(id);
        if (!foundCourse) throw `Course with id '${id}' not found.`;

        await CourseModel.deleteOne({ _id: id });
        return `Course with id '${id}' successfully deleted.`;
    } catch (err) {
        throw err;
    }
}

async function update(id, name, category, oneLiner, duration, language, description, lessons, photoBuffer) {
    try {
        let foundCourse = await findById(id);
        if (!foundCourse) throw `Course with id '${id}' not found.`;

        if (photoBuffer) {
            photoBuffer = {
                data: photoBuffer,
                contentType: 'image/png'
            }
        } else {
            photoBuffer = foundCourse.photo;
        }

        foundCourse.set({
            name: name,
            category: category,
            oneLiner: oneLiner,
            duration: duration,
            language: language,
            description: description,
            lessons: lessons,
            photo: photoBuffer
        });
        return await foundCourse.save();
    } catch (err) {
        console.log(err)
        if (err.name === 'ValidationError') {
            error = Object.values(err.errors).map(val => val.message);
            throw error;
        } else {
            throw err;
        }
    }
}


module.exports = {
    create,
    findAll,
    findById,
    deleteCourse,
    update
}