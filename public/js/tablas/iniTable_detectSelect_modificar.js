$(document).ready(function () {
    // Inicializar DataTables
    $('#example').DataTable();

    // Verificamos todos los selects cuando cambian
    function checkFormReady() {
        const tablaSelected = document.getElementById('cursoSelect').value;

        if (tablaSelected !== 'Selecciona Tabla') {
            // Envía el formulario 'tablas' si el campo cursoSelect tiene una selección válida
            document.getElementById('tablas').submit();
        }

    }

    // Listeners para todos los selects
    document.getElementById('cursoSelect').addEventListener('change', checkFormReady);

    // ---- Lógica para el toggle button ----
    const btns = document.querySelectorAll(".toggle-btn-delete");

    btns.forEach(btn => {
        btn.addEventListener("click", () => {
            // Alternar la clase active-delete para reflejar el estado visualmente
            btn.classList.toggle("active-delete");

            // Obtener el estado actual (1 o 0) y cambiarlo
            let currentState = btn.classList.contains("active-delete") ? 1 : 0;

            // Obtener el ID del elemento (DNI en este caso) para identificarlo
            let dni = btn.getAttribute("data-id");

            // Enviar la información al servidor/controlador por medio de fetch
            fetch(`http://localhost:4000/administrador/usuario/modificar/alumno/${dni}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    dni: dni,
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
});
