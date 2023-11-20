document.addEventListener("DOMContentLoaded", function () {
    var loginButton = document.getElementById("login-button");

    loginButton.addEventListener("click", function () {
        // Muestra el gif de carga al hacer clic en el botón
        document.getElementById("loading").style.display = "block";

        // Deshabilita el botón para evitar múltiples clics mientras se procesa
        loginButton.disabled = true;

        // Obtiene los datos del formulario
        var formData = new FormData(document.getElementById("login-form"));

        // Envía una solicitud XMLHttpRequest para procesar el formulario
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/procesar_login", true);
        xhr.onload = function () {
            // Oculta el gif de carga
            document.getElementById("loading").style.display = "none";

            if (xhr.status >= 200 && xhr.status < 300) {
                // La respuesta del servidor está en el rango de éxito
                var response = JSON.parse(xhr.responseText);
                if (response.valid) {
                    // Redirige a home.html si las credenciales son válidas
                    window.location.href = "/home";
                } else {
                    // Muestra un mensaje de error si las credenciales son inválidas
                    alert("Credenciales inválidas. Intenta de nuevo.");
                }
            } else {
                // Muestra un mensaje de error si hay un problema con la solicitud
                alert("Error en la solicitud al servidor. Código de estado: " + xhr.status);
            }

            // Habilita el botón nuevamente
            loginButton.disabled = false;
        };

        xhr.onerror = function () {
            // Maneja los errores aquí
            document.getElementById("loading").style.display = "none";
            alert("Error al procesar el formulario.");
            loginButton.disabled = false;
        };

        xhr.send(formData);
    });
});
