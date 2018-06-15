const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const resJson = require('./util/resJson');
const path = require('path')

const app = express();

// 跨域处理
app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    credentials: true,
}));

// 静态文件处理
app.use(express.static(path.resolve(__dirname, './public')))

// body解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// 开启session
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}));

// 路由注册
var Router = require('./routers');
Router(app);

// 无效路由处理
app.use((req, res) => {
    resJson(res, 404, '');
});

module.exports = app;