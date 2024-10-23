document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('sidebar');
    const switchMode = document.getElementById('switch-mode');

    // Restaurar el estado del sidebar
    if (localStorage.getItem('sidebar-state') === 'hidden') {
        sidebar.classList.add('hide');
    }

    // Restaurar el estado del modo oscuro
    if (localStorage.getItem('dark-mode') === 'enabled') {
        document.body.classList.add('dark');
        switchMode.checked = true;
    }

    // Mostrar el contenido del body
    document.body.classList.remove('hidden');

    // Configurar el ítem activo en el menú lateral
    const currentURL = window.location.pathname;
    const menuItems = document.querySelectorAll('.side-menu.top li');

    menuItems.forEach(item => {
        item.classList.remove('active');
    });

    if (currentURL === '/welcome') {
        document.getElementById('welcome').classList.add('active');
    } else if (currentURL === '/administrador/usuario') {
        document.getElementById('usuarios').classList.add('active');
    } else if (currentURL === '/preceptor/usuario') {
        document.getElementById('designar').classList.add('active');
    } else if (currentURL === '/message') {
        document.getElementById('message').classList.add('active');
    } else if (currentURL === '/administrador/usuario/modificar') {
        document.getElementById('team').classList.add('active');
    } else if (currentURL === '/docente'){
        document.getElementById('notas').classList.add('active');
    }

    // Alternar la visibilidad del sidebar
    const menuBar = document.querySelector('#content nav .bx.bx-menu');
    menuBar.addEventListener('click', function () {
        sidebar.classList.toggle('hide');
        localStorage.setItem('sidebar-state', sidebar.classList.contains('hide') ? 'hidden' : 'visible');
    });

    // Comportamiento del botón de búsqueda
    const searchButton = document.querySelector('#content nav form .form-input button');
    const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
    const searchForm = document.querySelector('#content nav form');

    searchButton.addEventListener('click', function (e) {
        if (window.innerWidth < 576) {
            if (!searchForm.classList.contains('show')) {
                e.preventDefault();
                searchForm.classList.add('show');
                searchButtonIcon.classList.replace('bx-search', 'bx-x');
            } else {
                searchForm.submit();
            }
        }
    });

    // Cambiar el modo oscuro
    switchMode.addEventListener('change', function () {
        document.body.classList.toggle('dark', this.checked);
        localStorage.setItem('dark-mode', this.checked ? 'enabled' : 'disabled');
    });

    // Evento de redimensionamiento de la ventana
    window.addEventListener('resize', function () {
        const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
        const searchForm = document.querySelector('#content nav form');

        if (window.innerWidth < 768) {
            sidebar.classList.add('hide');
            localStorage.setItem('sidebar-state', 'hidden');
        } else {
            if (localStorage.getItem('sidebar-state') === 'visible') {
                sidebar.classList.remove('hide');
            }
        }

        if (window.innerWidth > 576) {
            searchButtonIcon.classList.replace('bx-x', 'bx-search');
            searchForm.classList.remove('show');
        }
    });
});