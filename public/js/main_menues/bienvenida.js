//funcion de tabla con fetch
function updateTable(data) {

    const atributos = document.querySelector('.atributos');
    const valores = document.querySelector('.valores');
    atributos.innerHTML = '';
    valores.innerHTML = '';

    // Suponiendo que todos los objetos tienen las mismas claves
    const keys = Object.keys(data.data[0]);

    // Agregar los nombres de los atributos a la cabecera
    keys.forEach(key => {
        const th = document.createElement('th');
        th.textContent = key;
        atributos.appendChild(th);
    });

    // Agregar los valores de los objetos al cuerpo de la tabla
    data.data.forEach(item => {
        const tr = document.createElement('tr'); // Nueva fila para cada objeto
        keys.forEach(key => {
            const td = document.createElement('td');
            td.textContent = item[key];
            tr.appendChild(td); // Agregar cada valor a la fila
        });
        valores.appendChild(tr); // Agregar la fila completa a la tabla
    });

    //cambio nombre al seleccionar categoría
    const nombreCategoria = document.getElementById('categoria_nombre')
    nombreCategoria.textContent = data.meta.table_name
}

//evento al terminar carga document
document.addEventListener('DOMContentLoaded', function () {

    //categoria del menu main
    // Selecciona todos los botones de categoría
    const categoryButtons = document.querySelectorAll('.category-button');
    // Agrega un event listener a cada botón
    categoryButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            console.log(event.target.innerText);
            fetch(`/api/index/${event.target.innerText}`)
                .then(response => response.json())
                .then(alumnos => {
                    updateTable(alumnos);
                })
                .catch(error => console.error('Error:', error));
        });
    });

});