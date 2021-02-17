const { DataTypes } = require('sequelize');

// conexion con la base de datos
const db = require('../config/database');

// Tabla Proyectos para la relacion
const Proyecto = require('./Proyectos');


// crea la tabla tareas en la BD
const Tarea = db.define('tareas', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tarea: {
        type: DataTypes.STRING(100)
    },
    estado: {
        type: DataTypes.BOOLEAN
    }
})
Tarea.belongsTo(Proyecto);

module.exports = Tarea;