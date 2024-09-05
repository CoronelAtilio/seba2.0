$(document).ready(function () {
    $('#example').DataTable();
});

document.getElementById('cursoSelect').addEventListener('change', function () {
    document.getElementById('cursoForm').submit();  // Envía el formulario
});