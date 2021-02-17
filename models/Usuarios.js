const { DataTypes } = require('sequelize')
const bcrypt = require('bcrypt');

const db = require('../config/database')
const Proyecto = require('./Proyectos')


const Usuario = db.define('usuarios', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: {
            args: true,
            msg: "Ya existe el email"
        },
        validate: {
            isEmail: {
                msg: "Ingresa un email válido"
            },
            notEmpty: {
                msg: "No puede ir vacio"
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            min: 6,
            notEmpty: {
                msg: "indica una contraseña"
            }
        }
    },
    token: {
        type: DataTypes.STRING
    },
    expiracion: {
        type: DataTypes.DATE
    },
    activo: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
}, {
    hooks: {
        beforeCreate(usuario) {
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
        }
    }
})

Usuario.hasMany(Proyecto)

module.exports = Usuario;
