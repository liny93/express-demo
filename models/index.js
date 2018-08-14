/**
 * 根据dbconfig.js中的配置，自动连接数据库
 * 寻找与键值同名的文件夹，遍历文件，创建model
 * 
 * params文件夹为参数model，如有同名数据库，需人为修改
 */
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const dbconn = require('./dbconfig.js');

const db = {};
const models = {};

for (let key in dbconn) {
    const databaseObj = dbconn[key];
    const dbName = 'sequelize_' + key;
    db[dbName] = new Sequelize(databaseObj.database, databaseObj.username, databaseObj.password, databaseObj);
    seqImport(db[dbName], key);
}

function seqImport(seq, name) {
    let dir = path.join(__dirname, name);
    fs.readdirSync(dir).forEach(file => {
        const model = seq['import'](path.join(dir, file));
        models[model.name] = model;
    });
}

Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

Object.keys(db).forEach(function (dbName) {
    db[dbName].authenticate().then(function () {
        db[dbName].sync({ force: false });
        console.log(db[dbName].config.database + '数据库连接成功');
    }).catch(function (err) {
        console.error(err);
        throw err;
    });
});

db['Sequelize'] = Sequelize;
exports.db = db;
exports.models = models;