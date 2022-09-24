const multer = require('multer');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        console.log('upload filename:', file)
        cb(null, file.fieldname + '-' + Date.now())
    }
});


module.exports.upload = multer({ storage: storage })

