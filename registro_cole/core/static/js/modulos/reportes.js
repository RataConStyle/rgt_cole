
$('document').ready(function () {



    gradoId = $('#slcGrado').val()
    traerSecciones(gradoId);

    $('#slcSeccion').change(function () {
        var seccionId = $(this).val()
        gradoId = $('#slcGrado').val()
        mostrarAlumnos(gradoId, seccionId)
    })

    $('#slcAlumno').change(function () {
        var alumnoId = $(this).val()
        if (!alumnoId) { 
            $('#rslAlumno').empty();
            $('#divCalendarioAnual').empty();
        }
    })
           
    $('#slcGrado').change(function () {
        
        $('#slcAlumno').empty();
        var gradoId = $(this).val();
        if (!gradoId) { // Si no se ha seleccionado ningún valor en #slcGrado
            // Vaciar los demás selects
           
            $('#slcSeccion').prop('disabled', true).empty();
            $('#slcAlumno').prop('disabled', true).empty();
            $('#rslAlumno').empty();
            $('#divCalendarioAnual').empty();
            
            
            // Agrega aquí más líneas para vaciar otros selects si es necesario
        } else {
           
            // Si se seleccionó un valor en #slcGrado, traer las secciones correspondientes
            traerSecciones(gradoId);
           
            $('#slcSeccion').prop('disabled', false)
            $('#slcAlumno').prop('disabled', false)
            $('#divCalendarioAnual').removeClass('d-none').addClass('d-block');

        }
    });

    $('#rcgFiltros').on('click', function () {
        $('#slcGrado').val("");
        $('#slcSeccion').prop('disabled', true).empty();
        $('#slcAlumno').prop('disabled', true).empty();
        $('#rslAlumno').empty();
        $('#divCalendarioAnual').empty();
        $('#tblAsistenciasMes tbody').empty();
        $('#nombreAlumnotbl').empty();
    });

    $('#slcSeccion').prop('disabled', true).empty();
    $('#slcAlumno').prop('disabled', true).empty();

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

    $('#btnCalndarioMMostrar').on('click', function () {
        const urlServer = `../../reportes/asistenciasAlumno/`;
        const csrftoken = getCookie('csrftoken');

        const alumnoId = $('#slcAlumno').val()

        if (alumnoId === "") {
            Swal.fire("Aviso", "Debe seleccionar un alumno", "warning")
        } else {
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

                        nombre_completo_a = response.alumno.nombre_completo
                        grado_a = response.alumno.grado
                        seccion_a = response.alumno.seccion

                        const datosAsistencias = {}

                        response.asistencias.forEach(asistencia => {
                            const fecha = asistencia.fecha;
                            const registro = asistencia.registro;

                            datosAsistencias[fecha] = registro;
                        });

                        $('#rslAlumno').removeClass('d-none').addClass('d-block');
                        $('#rslAlumno').text(`Mostrando asistencias del alumno: ${nombre_completo_a} del ${grado_a} - ${seccion_a}`);

                        console.log(datosAsistencias);

                        // const divCalendarioAnual = $('#divCalendarioAnual')

                        CrearCalendarioAsistencias(datosAsistencias);// Aquí puedes configurar otras opciones de DataTables si es necesario

                    } else {
                        console.log("Algo salió mal: " + response.error);
                        Swal.fire("Aviso", "Debe seleccionar algun grado, seccion y alumno", "warning")
                    }
                },
                error: function (xhr, status, error) {
                    console.error('Error al obtener las asistencias:', error);
                }
            });
        }


    });

    $('#btnMostrarTabla').on('click', function () {
        
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
                   
                    $('#nombreAlumnotbl').text(`${response.alumno.nombre_completo} ${response.alumno.grado} ${response.alumno.seccion}`)

                    let html = '';

                    response.asistencias2.forEach(asistencia => {

                        let detalleA = ''

                        if (asistencia.detalle == 1) {
                            detalleA = `<span class="text-success">Puntual</span>`
                        }else {
                            detalleA = `<span class="text-warning">Tarde</span>`
                        }

                        html += `
                            <tr>
                                <td>${asistencia.fecha}</td>
                                <td>${asistencia.hora}</td>
                                <td>${detalleA}</td>
                            </tr>
                        `;
                    });

                    const tblAsistenciasMes = document.querySelector('#tblAsistenciasMes tbody')

                    tblAsistenciasMes.innerHTML = html

                } else {
                    console.log("Algo salió mal: " + response.error);
                    Swal.fire("Aviso", "Debe seleccionar algun grado, seccion y alumno", "warning")
                }
            },
            error: function (xhr, status, error) {
                console.error('Error al obtener las asistencias:', error);
            }
        });

    })
})


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
    
    // Si no se ha seleccionado ningún grado, bloquea la selección de sección
    $('#slcAlumno').empty();
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
                let alumno2 = ''
                response.alumnosGS.forEach(function (alumno) {                   
                    alumno2 = alumno.nombre_completo
                    $('#slcAlumno').append('<option value="' + alumno.id + '">' + alumno.nombre_completo + '</option>');
                });



                const alumnoId = $('#slcAlumno').val()
                if (!alumnoId) { 
                    $('#divCalendarioAnual').empty();
                    $('#rslAlumno').empty();
                }

                

            } else {
                console.log("algo salio mal " + response.error);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener las secciones:', error);
        }
    });

}

function CrearCalendarioAsistencias(datosAsistencias) {
   
    $('document').ready(function () {
        var calendarEl = document.getElementById('divCalendarioAnual');

        // Crear un array para almacenar los eventos del calendario
        var eventosCalendario = [];
        console.log(datosAsistencias);
        // Iterar sobre las claves y valores del objeto datosAsistencias
        for (var fecha in datosAsistencias) {
            if (datosAsistencias.hasOwnProperty(fecha)) {
                var registro = datosAsistencias[fecha];
                var fechaObjeto = new Date(fecha);

                // Obtener la fecha en formato YYYY-MM-DD
                var soloFecha = fechaObjeto.toISOString().split('T')[0];
                // Color del evento según el registro (1: verde, 0: amarillo)
                var color = registro == 1 ? 'green' : '#78771b';

                // Título del evento según el registro (1: Asistio, 0: Tarde)
                var titulo = registro == 1 ? 'Asistio' : 'Tarde';

                // Crear un objeto de evento y agregarlo al array de eventos
                eventosCalendario.push({
                    title: titulo, // Título del evento
                    start: soloFecha, // Fecha del evento
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