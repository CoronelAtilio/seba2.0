$(document).ready(function () {
    // Inicializar DataTables
    $('#example').DataTable();

    // Verificamos todos los selects cuando cambian
    function checkFormReady() {
        const cursoSelected = document.getElementById('cursoSelect').value;
        const divisionSelected = document.getElementById('divisionSelect').value;
        const cicloSelected = document.getElementById('cicloSelect').value;
        const materiaSelected = document.getElementById('materiaSelect').value;

        if (cursoSelected !== 'Selecciona Año' && divisionSelected !== 'Selecciona División' && cicloSelected !== 'Selecciona Ciclo' && materiaSelected !== 'Selecciona Materia') {
            // Envía el formulario si los tres campos están seleccionados
            document.getElementById('cursoForm').submit();
        }
    }

    // Listeners para todos los selects
    document.getElementById('cursoSelect').addEventListener('change', checkFormReady);
    document.getElementById('divisionSelect').addEventListener('change', checkFormReady);
    document.getElementById('cicloSelect').addEventListener('change', checkFormReady);
    document.getElementById('materiaSelect').addEventListener('change', checkFormReady);
});
