module.exports =
{
  development: {
    username: 'root',
    password: 'password',
    database: 'shopping_cart_robert',
    host: '127.0.0.1',
    dialect: 'mysql',
    seederStorage: 'sequelize'
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql',
    seederStorage: 'sequelize'
  },
  production: {
    // use_env_variable: 'PROD_DATABASE_URL',
    // operatorsAliases: false,
    host: process.env.RDS_HOSTNAME,
    username: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DB_NAME,
    dialect: 'mysql'
  }
}

// module.exports = {
//   ...
//   "production": {
//     "host": process.env.RDS_HOSTNAME,
//     "username": process.env.RDS_USERNAME,
//     "password": process.env.RDS_PASSWORD,
//     "port": process.env.RDS_PORT,
//     "database": process.env.RDS_DB_NAME,
//     "dialect": "mysql"
//   }
// }
