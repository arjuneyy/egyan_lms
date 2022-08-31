var express = require('express');
var app = express();

const API_PREFIX = '/api'

// Routes
var healthRouter = require('./routes/health');
var courseRouter = require('./routes/course');

app.use(`${API_PREFIX}/health`, healthRouter);
app.use(`${API_PREFIX}`, courseRouter);


module.exports = app;