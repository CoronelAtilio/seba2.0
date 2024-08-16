document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('sidebar');
    const switchMode = document.getElementById('switch-mode');

    // Restore sidebar state
    if (localStorage.getItem('sidebar-state') === 'hidden') {
        sidebar.classList.add('hide');
    }

    // Restore dark mode state
    if (localStorage.getItem('dark-mode') === 'enabled') {
        document.body.classList.add('dark');
        switchMode.checked = true;
    }

    // Show body content
    document.body.classList.remove('hidden');

    // Set active sidebar item
    const currentURL = window.location.pathname;
    const menuItems = document.querySelectorAll('.side-menu.top li');

    menuItems.forEach(item => {
        item.classList.remove('active');
    });

    if (currentURL === '/welcome') {
        document.getElementById('welcome').classList.add('active');
    } else if (currentURL === '/administrador/usuario') {
        document.getElementById('usuarios').classList.add('active');
    } else if (currentURL === '/curso') {
        document.getElementById('analytics').classList.add('active');
    } else if (currentURL === '/message') {
        document.getElementById('message').classList.add('active');
    } else if (currentURL === '/administrador/usuario/modificar') {
        document.getElementById('team').classList.add('active');
    }

    // Toggle sidebar
    const menuBar = document.querySelector('#content nav .bx.bx-menu');

    menuBar.addEventListener('click', function () {
        sidebar.classList.toggle('hide');
        localStorage.setItem('sidebar-state', sidebar.classList.contains('hide') ? 'hidden' : 'visible');
    });

    // Search button behavior
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

    // Switch mode (dark mode)
    switchMode.addEventListener('change', function () {
        document.body.classList.toggle('dark', this.checked);
        localStorage.setItem('dark-mode', this.checked ? 'enabled' : 'disabled');
    });
});

// Window resize event
window.addEventListener('resize', function () {
    const sidebar = document.getElementById('sidebar');
    const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
    const searchForm = document.querySelector('#content nav form');

    if (window.innerWidth < 768) {
        sidebar.classList.add('hide');
        localStorage.setItem('sidebar-state', 'hidden');
    } else if (window.innerWidth > 576) {
        searchButtonIcon.classList.replace('bx-x', 'bx-search');
        searchForm.classList.remove('show');
    }
});