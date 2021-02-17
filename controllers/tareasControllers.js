const Proyecto = require('../models/Proyectos');
const Tarea = require('../models/Tareas');

exports.nuevaTarea = async (req, res) => {
    const { tarea } = req.body
    const { url } = req.params
    const proyectos = await Proyecto.findAll()
    const proyecto = await Proyecto.findOne({
        where: {
            url
        }
    })
    let errors = []
    if (!tarea) {
        errors.push({texto: "Indica una Nueva Tarea"})
    }
    if (errors.length > 0) {
        res.render('detalleProyecto.pug',
        {
            nombre: "Detalle proyecto",
            errors,
            proyectos,
            proyecto
        })
    } else {
        await Tarea.create({
            tarea,
            estado: false,
            proyectoId: proyecto.dataValues.id
        })
        res.redirect(`/proyectos/${url}`)
    }
}

exports.cambiarEstadoTarea = async (req, res, next) => {
    const { id } = req.params;
    console.log(req.params)
    const tarea = await Tarea.findOne({
        where: {
            id
        }
    })
    let estado = false;
    console.log(tarea.estado)
    if (tarea.estado === estado) {
        estado = true
    }
    const resultado = await Tarea.update({
        estado
        },{
        where: {
            id
        }
    })


    if (!resultado) {
        res.status(500).send("fail")
        return next()
    }
    res.send("actualizado")
}

exports.eliminarTarea = async (req, res) => {
    const { id } = req.params

    const eli = await Tarea.destroy({
        where: {
            id
        }
    })
    if (!eli) {
        return next();
    }
    res.status(203).send("tarea eliminada!")
}