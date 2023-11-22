let mesActual = 0; // Inicializado en enero (0-index
document.addEventListener('DOMContentLoaded', function () {
    const calendario = document.getElementById('calendario');
    const tipoConsultaSelect = document.getElementById('tipo-consulta');
    const doctorSelect = document.getElementById('doctor');
    const horarioSelect = document.getElementById('horario');
    const reservarButton = document.getElementById('reservar');
    const mesSelect = document.getElementById('mes');
    const disponibilidadDoctores = {
        'Dr. Jorge Lopez Muñoz': [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,24,31,27],
        'Dra. Amanda Reyes Perez': [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,24,31,27],
        'Dr. Jorge Lopez Muñoz' :[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,24,31,27],
        'Dr. Felipe Norambuena Reyes' :[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,24,31,27],
        'Dr. Alfonso Miranda Muñoz' :[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,30,27],
        'Dra Camila Montes Miranda' :[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,30,27],
    };

    // Llena el menú desplegable de doctores según el tipo de consulta seleccionado
    tipoConsultaSelect.addEventListener('change', function () {
        const tipoConsulta = tipoConsultaSelect.value;
        llenarDoctores(tipoConsulta);
    });

    function llenarDoctores(tipoConsulta) {
        const doctores = obtenerDoctoresPorConsulta(tipoConsulta);
        doctorSelect.innerHTML = '';
        for (const doctor of doctores) {
            const option = document.createElement('option');
            option.value = doctor;
            option.textContent = doctor;
            doctorSelect.appendChild(option);
        }
        doctorSelect.addEventListener('change', function () {
            const doctorSeleccionado = doctorSelect.value;
            actualizarCalendario(doctorSeleccionado);
        });
    }
    let fechaSeleccionada = {
        mes: 0, // Inicializado en enero (0-index)
        dia: 0
    };
    // Actualiza el calendario según el doctor seleccionado
    function actualizarCalendario(doctor) {
        calendario.innerHTML = '';

        const diasOcupados = disponibilidadDoctores[doctor] || [];

        for (let i = 1; i <= 31; i++) {
            const dia = document.createElement('div');
            dia.classList.add('calendario_dias');
            if (diasOcupados.includes(i)) {
                dia.classList.add('ocupado');
                dia.addEventListener('click', function () {
                    alert('Este día está ocupado. Por favor, seleccione otro día.');
                    fechaSeleccionada = {
                        mes: mesActual,
                        dia: diaSeleccionado
                    };
                });
            } else {
                dia.classList.add('disponible');
                dia.addEventListener('click', function () {
                    // Almacena el día seleccionado
                    const diaSeleccionado = i;

                    // Habilita el menú de horarios y el botón de reservar
                    horarioSelect.disabled = false;
                    reservarButton.disabled = false;

                    // Actualiza los horarios disponibles
                    actualizarHorariosDisponibles(doctor, diaSeleccionado);
                });
            }

            dia.textContent = i;
            calendario.appendChild(dia);
        }
    }

    // Actualiza los horarios disponibles según el doctor y el día seleccionados
    function actualizarHorariosDisponibles(doctor, dia) {
        // Ejemplo de horarios disponibles (puedes obtener estos datos del servidor)
        const horariosDisponibles = obtenerHorariosPorDoctorYDia(doctor, dia);
        fechaSeleccionada = {
            mes: mesActual,
            dia: dia
        };
        // Limpiar opciones antiguas
        horarioSelect.innerHTML = '';

        // Agregar nuevas opciones
        for (const horario of horariosDisponibles) {
            const option = document.createElement('option');
            option.value = horario;
            option.textContent = horario;
            horarioSelect.appendChild(option);
        }
    }

    // Función de ejemplo para obtener doctores según el tipo de consulta (puedes cambiar esto)
    function obtenerDoctoresPorConsulta(tipoConsulta) {
        if (tipoConsulta === 'consulta1') {
            return ['Dr. Jorge Lopez Muñoz', 'Dra. Amanda Reyes Perez', 'Dr. Jorge Lopez Muñoz'];
        } else if (tipoConsulta === 'consulta2') {
            return ['Dr. Felipe Norambuena Reyes', 'Dr. Alfonso Miranda Muñoz', 'Dra Camila Montes Miranda'];
        }
        // Agrega más lógica según sea necesario
    }

    // Función de ejemplo para obtener horarios según el doctor y el día (puedes cambiar esto)
    function obtenerHorariosPorDoctorYDia(doctor, dia) {
        // Aquí deberías cargar los horarios disponibles desde tu base de datos
        // Por ahora, usamos datos de ejemplo
        return ['09:00', '11:00', '13:00', '15:00'];
    }

    reservarButton.addEventListener('click', function () {
        const mesSeleccionado = (parseInt(mesSelect.value) + 1).toString().padStart(2, '0');
        const diaSeleccionado = fechaSeleccionada.dia;
        const doctorSeleccionado = doctorSelect.value;
        const horarioSeleccionado = horarioSelect.value;
    
        // Utiliza la variable configurada en el script del HTML
        const rutClienteReservaLocal = rutClienteReserva;
    
        const fechaFormateada = `${diaSeleccionado.toString().padStart(2, '0')}/${mesSeleccionado}/2023`;

        fetch('/procesar_reserva', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `rut_cliente=${rutClienteReservaLocal}&doctor_seleccionado=${doctorSeleccionado}&fecha_reserva=${fechaFormateada}&horario_reserva=${horarioSeleccionado}`,
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            window.location.href = '/historial_consultas';
        })
        .catch(error => {
            // Manejar errores de la solicitud
            console.error('Error:', error);
        });
    });
});

