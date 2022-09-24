const mongoose = require('mongoose');


const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.']
    },
    category: {
        type: String,
        required: [true, 'Category is required.']
    },
    oneLiner: {
        type: String,
        required: [true, 'One liner is required.']
    },
    duration: {
        type: String,
        required: [true, 'Duration is required.']
    },
    language: {
        type: String,
        required: [true, 'Language is required.']
    },
    description: {
        type: String
    },
    lessons: [[String]],
    photo: {
        data: Buffer,
        contentType: String
    }
});


module.exports.CourseModel = mongoose.model('Course', courseSchema);