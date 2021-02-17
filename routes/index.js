const express = require('express')
const { body } = require('express-validator');
const router = express.Router()

//controladores

const { homeController,
        aboutController,
        nuevoProyecto,
        formularioProyecto,
        muestraProyecto,
        editarProyecto,
        updateProyecto,
        eliminaProyecto} = require('../controllers/proyectoControllers')

const { nuevaTarea,
        cambiarEstadoTarea,
        eliminarTarea } = require('../controllers/tareasControllers')

const { crearUsuario,
        nuevoUsuario,
        iniciarSesion,
        autenticarUsuario,
        estaAutenticado,
        cerrarSesion,
        reestablecer,
        enviarToken,
        resetPassword,
        nuevaContraseña,
        confirmarCuenta } = require('../controllers/usuariosControllers')

module.exports = () => {
    router.get('/',
            estaAutenticado,
            homeController
        )

    router.get('/about', aboutController)
    router.get('/nuevo-proyecto',
            estaAutenticado,
            formularioProyecto
            )
    router.post('/nuevo-proyecto',
                estaAutenticado,
                body('Nombre').not().isEmpty().trim().escape(),
                nuevoProyecto
                )
    
    router.get('/proyectos/:url',
                estaAutenticado,
                muestraProyecto
                ),
    //editar proyecto
    router.get('/proyecto/editar/:id',
                estaAutenticado,
                editarProyecto
                ),
    router.post('/nuevo-proyecto/:id', 
                estaAutenticado,
                body('Nombre').not().isEmpty().trim().escape(),
                updateProyecto
                ),
    //eliminar proyecto
    router.delete('/proyectos/:url',
                estaAutenticado,
                eliminaProyecto
                ),

    //agregar tarea
    router.post('/proyectos/:url',
                estaAutenticado,
                nuevaTarea
                ),

    //actualizar estado tarea
    router.patch('/tareas/:id',
                estaAutenticado,
                cambiarEstadoTarea
                ),

    // eliminar tarea
    router.delete('/tareas/:id',
                estaAutenticado,
                eliminarTarea
                )

    // registrar usuario
    router.get('/usuarios/crear', crearUsuario),
    router.post('/usuarios/crear', nuevoUsuario),

    // login de usuario}
    router.get('/iniciarSesion', iniciarSesion),
    // autenticacion de usuarios
    router.post('/iniciarSesion', autenticarUsuario),

    // cerrar sesion
    router.get('/cerrarSesion', cerrarSesion),

    router.get('/reestablecer', reestablecer),

    router.post('/reestablecer', enviarToken),

    router.get('/reestablecer/:token', resetPassword),
    router.post('/reestablecer/:token', nuevaContraseña),

    router.get('/confirmar/:email', confirmarCuenta)


    return router;
}