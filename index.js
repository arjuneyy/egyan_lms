const express = require('express');
const app = express();
const db = require('./config/mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const authMiddleware = require('./middleware/authentication')

const oneHour = 1 * 1 * 60 * 60;
const sessionConfig = {
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true,
    // cookie: { maxAge: oneDay },
    store: new MongoStore({ mongoUrl: db.url, collection: 'sessions', ttl: oneHour })
};

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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session(sessionConfig));
app.use(authMiddleware.authMiddleware);
app.use(authMiddleware.disableCacheMiddleware);

// API Routes
var homeRouter = require('./routes/home');
var dashboardRouter = require('./routes/dashboard');
var healthRouter = require('./routes/health');
var courseRouter = require('./routes/course');
var userRouter = require('./routes/user');

app.use(`${API_PREFIX}/health`, healthRouter);
// app.use(`${API_PREFIX}`, userRouter);
app.use(`${API_PREFIX}`, courseRouter);
app.use(`${API_PREFIX}`, homeRouter);
app.use(`${API_PREFIX}`, dashboardRouter);



module.exports = app;