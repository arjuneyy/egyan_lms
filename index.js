const express = require('express');
const app = express();
const db = require('./config/mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const authMiddleware = require('./middleware/authentication')
const methodOverride = require('method-override');

const API_PREFIX = '/api'

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
/* New Route to the TinyMCE Node module */
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
app.use(methodOverride('_method'));


// API Routes
var homeRouter = require('./routes/home');
var dashboardRouter = require('./routes/dashboard');
var courseRouter = require('./routes/course');

app.use(`${API_PREFIX}`, courseRouter);
app.use(`${API_PREFIX}`, homeRouter);
app.use(`${API_PREFIX}`, dashboardRouter);



module.exports = app;