document.addEventListener('DOMContentLoaded', function () {
    // Al seleccionar un tipo de consulta, cargar los médicos
    document.getElementById('tipo-consulta').addEventListener('change', function () {
        var tipoConsultaSeleccionado = this.value;

        // Lógica para determinar qué médicos mostrar según el tipo de consulta
        var medicos = [];
        if (tipoConsultaSeleccionado === 'consulta1') {
            // Pediátrica
            medicos = ['Dr. Pediatra 1', 'Dra. Pediatra 2', 'Dr. Pediatra 3'];
        } else if (tipoConsultaSeleccionado === 'consulta2') {
            // Ginecológica
            medicos = ['Dr. Ginecólogo 1', 'Dra. Ginecóloga 2', 'Dr. Ginecólogo 3'];
        } else if (tipoConsultaSeleccionado === 'consulta3') {
            // Urológica
            medicos = ['Dr. Urólogo 1', 'Dra. Uróloga 2', 'Dr. Urólogo 3'];
        } else if (tipoConsultaSeleccionado === 'consulta4') {
            // Atención Primaria
            medicos = ['Dr. Médico General 1', 'Dra. Médico General 2', 'Dr. Médico General 3'];
        }

        // Actualizar opciones del médico en el select
        var medicoSelect = document.getElementById('medico');
        medicoSelect.innerHTML = '';
        for (var i = 0; i < medicos.length; i++) {
            var option = document.createElement('option');
            option.value = medicos[i];
            option.text = medicos[i];
            medicoSelect.add(option);
        }
    });

    // Al seleccionar un médico, cargar su información y horario
    document.getElementById('medico').addEventListener('change', function () {
        var rutMedicoSeleccionado = this.value;

        // Realizar una solicitud al servidor para obtener la información del médico y su horario
        obtenerInfoMedico(rutMedicoSeleccionado)
            .then(function (info) {
                // Mostrar la información del médico en la interfaz
                document.getElementById('nombre-medico').textContent = 'Nombre: ' + info.nombre + ' ' + info.apellido;

                // Mostrar el horario del médico en la interfaz
                var horarioMedico = info.horario.map(function (dia) {
                    return dia.dia_semana + ': ' + dia.hora_inicio + ' - ' + dia.hora_fin;
                }).join(', ');

                document.getElementById('horario-medico').textContent = 'Horario: ' + horarioMedico;
            })
            .catch(function (error) {
                console.error('Error al obtener información del médico:', error);
            });
    });

    // ... Otras partes de tu lógica ...

// Función para obtener información del médico desde el servidor
function obtenerInfoMedico(rutMedico) {
    return new Promise(function (resolve, reject) {
        // Realizar una solicitud al servidor
        fetch('/obtener_info_medico', {
            method: 'POST', // Puedes ajustar el método según tu backend
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rutMedico: rutMedico }),
        })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Error al obtener información del médico');
                }
                return response.json();
            })
            .then(function (data) {
                // Resolver la promesa con la información del médico y su horario
                resolve(data);
            })
            .catch(function (error) {
                // Rechazar la promesa con un mensaje de error
                reject(error.message);
            });
    });
}

    // ... Otras partes de tu lógica ...

    // Al seleccionar una fecha, cargar los horarios disponibles
    document.getElementById('fecha').addEventListener('change', function () {
        var fechaSeleccionada = this.value;

        // Aquí debes cargar dinámicamente los horarios disponibles en función de la fecha y el médico seleccionados
        // Puedes hacer una lógica similar a la de los médicos para determinar los horarios.
    });
});
