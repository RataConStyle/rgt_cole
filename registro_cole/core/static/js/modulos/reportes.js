console.log("hola mundo");

$('document').ready(function () {
    $('#slcGrado').select2({
        theme: 'bootstrap-5',
        language: {

            noResults: function () {

                return "No hay resultado";
            },
            searching: function () {

                return "Buscando..";
            }
        }
    });

    $('#slcSeccion').select2({
        theme: 'bootstrap-5',
        language: {

            noResults: function () {

                return "No hay resultado";
            },
            searching: function () {

                return "Buscando..";
            }
        }
    });
    $('#slcAlumno').empty();
    $('#slcAlumno').select2({
        theme: 'bootstrap-5',
        language: {

            noResults: function () {

                return "No hay resultado";
            },
            searching: function () {

                return "Buscando..";
            }
        }
    });

    const gradoId = $('#slcGrado').val()
    traerSecciones(gradoId)

    $('#slcGrado').change(function () {
        var gradoId = $(this).val()
        traerSecciones(gradoId)
    })

    $('#fromAlumnoReporte').on('click', function () {
        const urlServer = `../../reportes/asistenciasAlumno/`;
        const csrftoken = getCookie('csrftoken');

        const alumnoId = $('#slcAlumno').val()

        $.ajax({
            url: urlServer,
            method: 'POST',
            data: {
                alumnoId: alumnoId,
            },
            headers: {
                // Adjuntar el token CSRF al encabezado de la solicitud
                'X-CSRFToken': csrftoken
            },
            success: function (response) {
                if (response.icono == true) {

                    console.log(response);

                    const datosAsistencias = {}

                    response.asistencias.forEach(asistencia => {
                        const fecha = asistencia.fecha;
                        const registro = asistencia.registro;

                        datosAsistencias[fecha] = registro;
                    });

                    console.log(datosAsistencias);

                    // const divCalendarioAnual = $('#divCalendarioAnual')

                    CrearCalendarioAsistencias(datosAsistencias);// Aquí puedes configurar otras opciones de DataTables si es necesario

                } else {
                    console.log("Algo salió mal: " + response.error);
                }
            },
            error: function (xhr, status, error) {
                console.error('Error al obtener las asistencias:', error);
            }
        });
    });
})

function CrearCalendarioAsistencias(datosAsistencias) {
    $('document').ready(function () {
        var calendarEl = document.getElementById('divCalendarioAnual');
        
        // Crear un array para almacenar los eventos del calendario
        var eventosCalendario = [];

        // Iterar sobre las claves y valores del objeto datosAsistencias
        for (var fecha in datosAsistencias) {
            if (datosAsistencias.hasOwnProperty(fecha)) {
                var registro = datosAsistencias[fecha];

                // Color del evento según el registro (1: verde, 0: amarillo)
                var color = registro == 1 ? 'green' : 'yellow';

                // Título del evento según el registro (1: Asistio, 0: Tarde)
                var titulo = registro == 1 ? 'Asistio' : 'Tarde';

                // Crear un objeto de evento y agregarlo al array de eventos
                eventosCalendario.push({
                    title: titulo, // Título del evento
                    start: fecha, // Fecha del evento
                    backgroundColor: color // Color de fondo del evento
                });
            }
        }

        // Inicializar el calendario con los eventos
        var calendar = new FullCalendar.Calendar(calendarEl, {
            locale: 'es', // Establecer el idioma a español
            events: eventosCalendario, // Utilizar los eventos creados
            eventOverlap: function (stillEvent, movingEvent) {
                return stillEvent.allDay && movingEvent.allDay;
            }
        });

        // Agregar la clase 'dark' al elemento del calendario para aplicar el tema oscuro
        calendarEl.classList.add('dark');

        // Renderizar el calendario
        calendar.render();
    });
}

function traerSecciones(gradoId) {

    $('#slcSeccion').empty();

    // Si no se ha seleccionado ningún grado, bloquea la selección de sección

    // Realiza una petición AJAX para obtener las secciones del grado seleccionado
    const urlServer = `../../asistencias/verSecciones/` + gradoId;
    const csrftoken = getCookie('csrftoken');

    $.ajax({
        url: urlServer,
        method: 'GET',
        headers: {
            // Adjuntar el token CSRF al encabezado de la solicitud
            'X-CSRFToken': csrftoken
        },
        data: {
            action: 'peticion'
        },
        success: function (response) {

            if (response.icono == true) {
                response.secciones.forEach(function (seccion) {
                    $('#slcSeccion').append('<option value="' + seccion.id + '">' + seccion.nombre + '</option>');

                });

                const seccionId = $('#slcSeccion').val()
                mostrarAlumnos(gradoId, seccionId)

                $('#slcSeccion').change(function () {
                    var seccionId = $(this).val()
                    mostrarAlumnos(gradoId, seccionId)
                })

            } else {
                console.log("algo salio mal " + response.error);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener las secciones:', error);
        }
    });
}

function mostrarAlumnos(gradoId, seccionId) {

    $('#slcAlumno').empty();

    // Si no se ha seleccionado ningún grado, bloquea la selección de sección

    // Realiza una petición AJAX para obtener las secciones del grado seleccionado
    const urlServer = `../../reportes/verAlumnosGradoSeccion/${gradoId}/${seccionId}`;
    const csrftoken = getCookie('csrftoken');

    $.ajax({
        url: urlServer,
        method: 'GET',
        headers: {
            // Adjuntar el token CSRF al encabezado de la solicitud
            'X-CSRFToken': csrftoken
        },
        data: {
            action: 'peticion'
        },
        success: function (response) {

            if (response.icono == true) {
                console.log(response.alumnosGS);
                response.alumnosGS.forEach(function (alumno) {
                    $('#slcAlumno').append('<option value="' + alumno.id + '">' + alumno.nombre_completo + '</option>');

                    // $('#slcAlumno').change(function () {
                    //     var seccionId = $(this).val()
                    //     mostrarAlumnos(gradoId, seccionId)
                    // })
                });
            } else {
                console.log("algo salio mal " + response.error);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener las secciones:', error);
        }
    });

}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Verifica si esta cookie tiene el nombre que estamos buscando
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                // Obtén el valor de la cookie y decodifícalo
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}