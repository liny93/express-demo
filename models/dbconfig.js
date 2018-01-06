require('dotenv').config();

module.exports = {
    test: {
        database: process.env.MYSQL_TEST_DB,
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            idle: 20000,
            acquire: 20000
        },
        define: {
            timestamps: false,
            freezeTableName: true
        },
        logging: false,
    }
}