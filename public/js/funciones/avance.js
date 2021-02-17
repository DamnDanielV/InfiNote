export const actualizarAvance = () => {
    // seleccionar tareas existentes
    const tareas = document.querySelectorAll('li.tarea')

    if (tareas.length) {
        // seleccionar las tareas completadas  
        const tareasCompletadas = document.querySelectorAll('i.completo')

        const avance = Math.round((tareasCompletadas.length / tareas.length) * 100)

        const porcentaje = document.querySelector('#porcentaje')
        porcentaje.style.width = `${avance}%`


    }

}