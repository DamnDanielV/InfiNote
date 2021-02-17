const { Sequelize } = require('sequelize')

//variables de entorno
require('dotenv').config({path:'variables.env'})

const db = new Sequelize(process.env.BD_NAME, process.env.BD_USER, process.env.BD_PASS, {
    host: process.env.BD_HOST,
    dialect:'mysql',
    port: process.env.BD_PORT,
    define: {
        timestamps: false
    }
  });

  module.exports = db