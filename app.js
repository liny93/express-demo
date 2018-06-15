const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const resJson = require('./util/resJson');
const path = require('path')

const app = express();

app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    credentials: true, // enable set cookie
}));

app.use(express.static(path.resolve(__dirname, './public')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}));

var Router = require('./routers');
Router(app);
// catch 404
app.use((req, res) => {
    resJson(res, 404, '');
});

module.exports = app;