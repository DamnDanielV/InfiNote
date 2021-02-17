import axios from "axios";
import Swal from "sweetalert2";
import { actualizarAvance } from "../funciones/avance";

const tareas = document.querySelector('.listado-pendientes')

if (tareas) {
    tareas.addEventListener('click', (event) => {
        if(event.target.classList.contains('fa-check-circle')) {
            const icono = event.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;
            //request tareas/:id
            const url = `${location.origin}/tareas/${idTarea}`;
            axios.patch(url, {idTarea})
            .then((res) => {
                console.log(res.status)
                if (res.status === 200) {
                    icono.classList.toggle('completo')
                    actualizarAvance();
                } 
            })
        }
        if (event.target.classList.contains('fa-trash')) {
            const tareaHTML = event.target.parentElement.parentElement;
            const idTarea = tareaHTML.dataset.tarea;
            console.log(idTarea)
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
              }).then((result) => {
                  // enviar peticion por axios
                  axios.delete(`${location.origin}/tareas/${idTarea}`, {
                    params: {idTarea}
                  })
                  .then(function (response) {
                    // console.log(response);
                    // console.log(response.status)
                    if (response.status === 203) {
                        tareaHTML.parentElement.removeChild(tareaHTML)
                        actualizarAvance();
                    }
                    if (result.isConfirmed) {
                      Swal.fire(
                        'Deleted!',
                        response.data,
                        'success'
                      )
                    }
                  })
                  .catch(function (error) {
                    // console.log(error);
                    if (result.isConfirmed) {
                        Swal.fire(
                          'error!',
                          'ha ocurrido un error',
                          'error'
                        )
                      }
                  });
              }) 
        }
    })
}

export default tareas;