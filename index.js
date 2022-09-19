const express = require('express');
const app = express();
const db = require('./config/mongoose');
const path = require('path');
const bodyParser = require('body-parser');

// Connect mongoDB
db.connect()

const API_PREFIX = '/api'

// Middleware
app.use(express.json());
app.set('view engine', 'ejs'); // HTML templating engine
app.use(
    express.static(path.join(__dirname, "node_modules/")),
    express.static(path.join(__dirname, "/"))
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// API Routes
var healthRouter = require('./routes/health');
var courseRouter = require('./routes/course');
var userRouter = require('./routes/user');

app.use(`${API_PREFIX}/health`, healthRouter);
app.use(`${API_PREFIX}`, courseRouter);
app.use(`${API_PREFIX}`, userRouter);

// Views Routes
var homeRouter = require('./routes/views/home');
app.use('/', homeRouter);


module.exports = app;