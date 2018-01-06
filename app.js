const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const resJson = require('./util/resJson');

const app = express();

app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    credentials: true, // enable set cookie
}));

// 跨域问题
// app.all('/', (req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'X-Requested-With');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     next();
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}));

app.use(require('./routes'));

// catch 404
app.use((req, res) => {
    resJson(res, 404, '');
});

module.exports = app;