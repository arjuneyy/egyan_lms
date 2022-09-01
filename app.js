var express = require('express');
var app = express();
var db = require('./config/mongoose')

// Connect mongoDb
db.connect()

const API_PREFIX = '/api'

// Middleware
app.use(express.json());

// Routes
var healthRouter = require('./routes/health');
var courseRouter = require('./routes/course');
var userRouter = require('./routes/user');

app.use(`${API_PREFIX}/health`, healthRouter);
app.use(`${API_PREFIX}`, courseRouter);
app.use(`${API_PREFIX}`, userRouter);


module.exports = app;