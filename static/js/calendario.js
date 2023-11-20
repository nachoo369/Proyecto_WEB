document.addEventListener('DOMContentLoaded', function () {
    const calendario = document.getElementById('calendario');
    const tipoConsultaSelect = document.getElementById('tipo-consulta');
    const doctorSelect = document.getElementById('doctor');
    const horarioSelect = document.getElementById('horario');
    const reservarButton = document.getElementById('reservar');
    const nombreMes = document.getElementById('nombreMes');
    const anteriorMesBtn = document.getElementById('anteriorMes');
    const siguienteMesBtn = document.getElementById('siguienteMes');

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
        // Evento para cambiar el mes hacia atrás
    anteriorMesBtn.addEventListener('click', function () {
        mesActual = (mesActual - 1 + 12) % 12;
        const doctorSeleccionado = doctorSelect.value;
        actualizarCalendario(doctorSeleccionado);
    });

    // Evento para cambiar el mes hacia adelante
    siguienteMesBtn.addEventListener('click', function () {
        mesActual = (mesActual + 1) % 12;
        const doctorSeleccionado = doctorSelect.value;
        actualizarCalendario(doctorSeleccionado);
    });
});
