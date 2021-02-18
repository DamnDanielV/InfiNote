//modelo
const Proyecto = require('../models/Proyectos');
const Tarea = require('../models/Tareas');

exports.homeController = async (req, res) => {
    const usuarioId = res.locals.usuario.id
    const proyectos = await Proyecto.findAll({
        where:
        { usuarioId }
    });
    const tareas = await Tarea.findAll({
        where: {
            estado: false
        }
    })
    res.render('index.pug',{
        nombre: "Uptask",
        proyectos,
        tareas
    }) // renderiza el archivo .pug indicado en la linea 10 de index.js
}

exports.aboutController = (req, res) => {
    res.render('about')
}

exports.formularioProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id
    const proyectos = await Proyecto.findAll({
        where:
        { usuarioId }
    });
    res.render('nuevoProyecto.pug', {
        nombre: "Nuevo Proyecto",
        proyectos
    })
}

exports.nuevoProyecto = async (req, res) => {
    // validacion del formulario
    const usuarioId = res.locals.usuario.id
    const proyectos = await Proyecto.findAll({
        where:
        { usuarioId }
    });
    const { Nombre } = req.body;
    console.log(Nombre)
    let errors = []
    if (!Nombre) {
        errors.push({texto: "debes indicar un nombre"})

    }
    if (errors.length > 0) {
        res.render('nuevoProyecto.pug',
        {
            nombre: "Nuevo Proyecto",
            errors,
            proyectos
        })   
    } else {
        const usuarioId = res.locals.usuario.id
        await Proyecto.create(
            {
                nombre: Nombre,
                usuarioId
            })
                // .then(()=>console.log(`campo ${Nombre} creado!`))
                // .catch((err)=>console.log(err))
        res.redirect('/')
    }
}

exports.muestraProyecto = async (req, res, next) => {
    const usuarioId = res.locals.usuario.id
    const { url } = req.params;
    const proyectosPromise = Proyecto.findAll({where:{usuarioId}});
    const proyectoPromise = Proyecto.findOne(
        {
            where: {
                url,
                usuarioId
            }
        }
    )

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise])
    if (proyecto === null) {
        return next()
    }
    
    const tareas = await Tarea.findAll({
        where: {
            proyectoId: proyecto.dataValues.id
        }
    })
    res.render('detalleProyecto.pug',
    {
        nombre: "Detalle Proyecto",
        proyecto,
        proyectos,
        tareas
    })
}

exports.editarProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id
    const { id } = req.params;

    // const proyectos = await Proyecto.findAll()
    // const proyecto = await Proyecto.findOne(
    //     {
    //         where: {
    //             id
    //         }
    //     }
    // )

    const proyectosPromise = Proyecto.findAll({where:{usuarioId}})
    const proyectoPromise = Proyecto.findOne({
        where: {
            id,
            usuarioId
        }
    })

    const [ proyectos, proyecto ] =  await Promise.all([proyectosPromise, proyectoPromise])

    res.render('nuevoProyecto.pug', {
        nombre: "Editar Proyecto",
        proyecto,
        proyectos
    })
}

exports.updateProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id
    const { Nombre } = req.body;
    const { id } = req.params;
    const proyectosPromise = Proyecto.findAll({where:{usuarioId}})
    const proyectoPromise = Proyecto.findOne({
        where: {
            id,
            usuarioId
        }
    })

    const [ proyectos, proyecto ] =  await Promise.all([proyectosPromise, proyectoPromise])

    let errors = []
    if (!Nombre) {
        errors.push({texto: "debes indicar un nombre"})

    }
    if (errors.length > 0) {
        res.render('nuevoProyecto.pug', {
            nombre: "Editar Proyecto",
            proyecto,
            proyectos,
            errors
        })
    } else {
        await Proyecto.update(
            {nombre:Nombre},
            { where: { id }}
        )
        res.redirect('/')
    }
}

exports.eliminaProyecto = async (req, res, next) => {
    const { url } = req.params
    const eli = await Proyecto.destroy({
        where: {
            url
        }
    })
    if (!eli) {
        return next();
    }
    res.status(203).send("eliminado correctamente!")
}

