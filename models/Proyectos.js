const { DataTypes } = require('sequelize');
const shortid = require('shortid');
const slug = require('slug')

// importamos el modelo de la base de datos
const db = require('../config/database')


//tabla Proyecto de la base de datos Uptask
const Proyecto = db.define('proyectos', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100)
    },
    url: {
        type: DataTypes.STRING(100)
    }
}, {
    hooks: {
        beforeCreate(proyecto) {
            const url = slug(proyecto.nombre).toLowerCase();
            proyecto.url = `${url}-${shortid.generate()}`
        }
    }
})

module.exports = Proyecto