import Swal from "sweetalert2";
import axios from "axios";

const btnEliminar = document.querySelector("#eliminar-proyecto");
if (btnEliminar) { // debido a que el script bundle.js se importa en layout.pug se debe verificar que dicho boton exista para que no gnere un error

    btnEliminar.addEventListener('click', (event) => {
        const { proyectourl } = event.target.dataset;      
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
              axios.delete(`${location.origin}/proyectos/${proyectourl}`, {
                params: proyectourl
              })
              .then(function (response) {
                // console.log(response);
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
    })
}

export default btnEliminar;