let mesActual = 0; // Inicializado en enero (0-index
document.addEventListener('DOMContentLoaded', function () {
    const calendario = document.getElementById('calendario');
    const tipoConsultaSelect = document.getElementById('tipo-consulta');
    const doctorSelect = document.getElementById('doctor');
    const horarioSelect = document.getElementById('horario');
    const reservarButton = document.getElementById('reservar');
    const mesSelect = document.getElementById('mes'); // Agregado: Obtener el elemento del mes
    // Ejemplo de datos de disponibilidad (puedes obtener estos datos del servidor)
    const disponibilidadDoctores = {
        'Dr. Jorge Lopez Muñoz': [5, 10, 15, 22, 25, 31],
        'Dra. Amanda Reyes Perez': [8, 12, 22],
        'Dr. Jorge Lopez Muñoz' :[1,5.7,8,12,23,25],
        'Dr. Felipe Norambuena Reyes' :[1,5.7,8,12,23,25],
        'Dr. Alfonso Miranda Muñoz' :[1,5.7,8,12,23,25],
        'Dra Camila Montes Miranda' :[1,5.7,8,12,23,25]
        // Agrega más datos según sea necesario
    };

    //////// MANDAR A BD

    // Llena el menú desplegable de doctores según el tipo de consulta seleccionado
    tipoConsultaSelect.addEventListener('change', function () {
        const tipoConsulta = tipoConsultaSelect.value;
        llenarDoctores(tipoConsulta);
    });

    // Llena el menú desplegable de doctores con datos de ejemplo
    function llenarDoctores(tipoConsulta) {
        // Aquí deberías cargar los doctores según el tipo de consulta desde tu base de datos
        // Por ahora, usamos datos de ejemplo
        const doctores = obtenerDoctoresPorConsulta(tipoConsulta);

        // Limpiar opciones antiguas
        doctorSelect.innerHTML = '';

        // Agregar nuevas opciones
        for (const doctor of doctores) {
            const option = document.createElement('option');
            option.value = doctor;
            option.textContent = doctor;
            doctorSelect.appendChild(option);
        }

        // Actualizar el calendario cuando se selecciona un doctor
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
        // Limpiar días antiguos
        calendario.innerHTML = '';

        // Obtener la disponibilidad del doctor seleccionado
        const diasOcupados = disponibilidadDoctores[doctor] || [];

        // Llenar el calendario con días
        for (let i = 1; i <= 31; i++) {
            const dia = document.createElement('div');
            dia.classList.add('calendario_dias');

            // Verificar si el día está ocupado y aplicar estilos
            if (diasOcupados.includes(i)) {
                dia.classList.add('ocupado');
                // Agregar evento de clic para el día ocupado
                dia.addEventListener('click', function () {
                    alert('Este día está ocupado. Por favor, seleccione otro día.');
                    fechaSeleccionada = {
                        mes: mesActual,
                        dia: diaSeleccionado
                    };
                });
            } else {
                dia.classList.add('disponible');
                // Agregar evento de clic para el día disponible
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
        // Accede a la fecha completa (mes y día)
        const mesSeleccionado = (parseInt(mesSelect.value) + 1).toString().padStart(2, '0');
        const diaSeleccionado = fechaSeleccionada.dia;
    
        // Obtén el nombre del doctor seleccionado
        const doctorSeleccionado = doctorSelect.value;
        const nombreClienteReserva = nombreCliente;

        const apellidoClientReserva = apellidoCliente;
    
        // Obtén el horario seleccionado
        const horarioSeleccionado = horarioSelect.value;
        const fechaFormateada = `${diaSeleccionado.toString().padStart(2, '0')}/${mesSeleccionado}/2023`;
    
        // Realiza la solicitud fetch para enviar los datos al servidor
        fetch('/procesar_reserva', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `nombre_cliente=${nombreClienteReserva}&apellido_cliente=${apellidoClientReserva}&doctor_seleccionado=${doctorSeleccionado}&fecha_reserva=${fechaFormateada}&horario_reserva=${horarioSeleccionado}`,
        })
        .then(response => response.json())
        .then(data => {
            // Manejar la respuesta del servidor si es necesario
            console.log(data);
    
            // Puedes mostrar un mensaje al usuario o redirigir a otra página aquí
    
            // Por ejemplo, redirigir a la página de historial de consultas
            window.location.href = '/historial_consultas';
        })
        .catch(error => {
            // Manejar errores de la solicitud
            console.error('Error:', error);
        });
    });
});

