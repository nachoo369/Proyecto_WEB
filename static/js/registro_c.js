// registro.js
document.addEventListener("DOMContentLoaded", function () {
    var registroForm = document.getElementById("registro-form");

    registroForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Muestra el gif de carga
        document.getElementById("loading").style.display = "block";

        // Deshabilita el botón para evitar múltiples clics mientras se procesa
        document.getElementById("registro-button").disabled = true;

        // Obtiene los datos del formulario
        var formData = new FormData(registroForm);

        // Envía una solicitud XMLHttpRequest para procesar el formulario
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/procesar_registro", true);
        xhr.onload = function () {
            // Oculta el gif de carga
            document.getElementById("loading").style.display = "none";

            if (xhr.status === 200) {
                // La respuesta del servidor es válida (código 200)
                alert("Registro exitoso"); // Puedes personalizar el mensaje
                window.location.href = "/login";  // Redirige a /login
            } else {
                // Muestra un mensaje de error si hay un problema con la solicitud
                alert("Error en el servidor. Inténtalo de nuevo.");
                document.getElementById("registro-button").disabled = false; // Habilita el botón nuevamente
            }
        };
        xhr.onerror = function () {
            // Maneja los errores aquí
            document.getElementById("loading").style.display = "none";
            alert("Error al procesar el formulario.");
            document.getElementById("registro-button").disabled = false; // Habilita el botón nuevamente
        };
        xhr.send(formData);
    });
});
