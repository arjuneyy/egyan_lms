var express = require('express');
var router = express.Router();


// Health status check
router.get('/', (req, res) => {
    res.send('Healh :- OK!');
});

module.exports = router;