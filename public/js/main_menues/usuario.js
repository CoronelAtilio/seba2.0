document.addEventListener("DOMContentLoaded", function() {
    const navLinks = document.querySelectorAll(".nav-links a");
    const forms = document.querySelectorAll(".form-content");

    navLinks.forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const formId = this.getAttribute("data-form");

            forms.forEach(form => {
                if (form.id === formId) {
                    form.style.display = "block";
                } else {
                    form.style.display = "none";
                }
            });
        });
    });

    // Mostrar el formulario activo en caso de errores
    const activeForm = "<%= typeof activeForm !== 'undefined' ? activeForm : '' %>";
    if (activeForm) {
        const formElement = document.getElementById(activeForm);
        if (formElement) {  // Verifica si el elemento existe
            formElement.style.display = "block";
        } else {
            console.warn(`Elemento con id "${activeForm}" no encontrado.`);
        }
    }
});
