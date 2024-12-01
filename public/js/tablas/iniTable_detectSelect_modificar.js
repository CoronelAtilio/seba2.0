$(document).ready(function () {
    // Inicializar DataTables
    const table = $('#example').DataTable();

    // Función para verificar y enviar el formulario 'tablas' si el select cambia
    function checkFormReady() {
        const tablaSelected = document.getElementById('cursoSelect').value;

        if (tablaSelected !== 'Selecciona Tabla') {
            // Envía el formulario 'tablas' si el campo cursoSelect tiene una selección válida
            document.getElementById('tablas').submit();
        }
    }

    // Listener para el cambio en el select del curso
    document.getElementById('cursoSelect').addEventListener('change', checkFormReady);

    // ---- Lógica para los botones toggle ----
    function assignToggleEvents() {
        // Seleccionar todos los botones actuales en la tabla
        const btns = document.querySelectorAll(".toggle-btn-delete");

        // Asignar evento click a cada botón
        btns.forEach(btn => {
            btn.addEventListener("click", () => {
                // Alternar la clase active-delete para reflejar el estado visualmente
                btn.classList.toggle("active-delete");

                // Obtener el estado actual (1 o 0) y cambiarlo
                let currentState = btn.classList.contains("active-delete") ? 1 : 0;

                // Obtener el ID del elemento (DNI en este caso) para identificarlo
                let id = btn.getAttribute("data-id");
                // Obtener la tabla desde el atributo data-tabla
                let tabla = btn.getAttribute("data-tabla");
                console.log(tabla,'\n',id);
                
                // Enviar la información al servidor/controlador por medio de fetch
                fetch(`http://localhost:4000/administrador/usuario/modificar/${tabla}/${id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: id,
                        estado: currentState // enviar el nuevo estado
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Estado actualizado:', data);
                    })
                    .catch(error => {
                        console.error('Error al actualizar estado:', error);
                    });
            });
        });
    }

    // Asignar eventos al cargar la tabla por primera vez
    assignToggleEvents();

    // Asignar eventos cada vez que se redibuja la tabla (paginado, búsqueda, ordenamiento)
    table.on('draw', function () {
        assignToggleEvents();
    });
});
