var express = require('express');
var app = express();

const API_PREFIX = '/api'

// Routes
var healthRouter = require('./routes/health')

app.use(`${API_PREFIX}/health`, healthRouter);


module.exports = app;