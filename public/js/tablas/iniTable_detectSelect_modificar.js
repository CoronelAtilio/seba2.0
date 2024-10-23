$(document).ready(function () {
    // Inicializar DataTables
    $('#example').DataTable();

    // Verificamos todos los selects cuando cambian
    function checkFormReady() {
        const tablaSelected = document.getElementById('cursoSelect').value;
        const relacionSelected = document.getElementById('divisionSelect').value;


        if (tablaSelected !== 'Selecciona Tabla') {
            // Envía el formulario si los tres campos están seleccionados
            document.getElementById('tablas').submit();
        }
        if (relacionSelected !== 'Selecciona Relacion') {
            // Envía el formulario si los tres campos están seleccionados
            document.getElementById('relaciones').submit();
        }
    }

    // Listeners para todos los selects
    document.getElementById('cursoSelect').addEventListener('change', checkFormReady);
    document.getElementById('divisionSelect').addEventListener('change', checkFormReady);
});
