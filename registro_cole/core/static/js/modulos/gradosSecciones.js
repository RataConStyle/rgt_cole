
const frmAlumnos = document.querySelector("#registroAlumno");
const modalNuevo = new bootstrap.Modal(document.getElementById('modalNuevo'));
const modalAsis = new bootstrap.Modal(document.getElementById('modalAsis'));

const titleModal = document.querySelector("#titleCabeza")
const nuevo = document.querySelector("#nuevo")
const btnDatos = document.querySelector("#btnDatos")

$(document).ready(function () {

    

    $('#seccionSlc').prop('disabled', true).empty();

    $('#gradoSlc').change(function () {
        $('#tblgradoSecciones').DataTable().destroy();
        var gradoId2 = $(this).val();
        $('#seccionAlumno').empty();

        // Limpia las opciones de la selección de sección
        cargarSecciones2(gradoId2)

    });

    $('#gradoSlc').on("change", function () {
        // Si el valor del grado no está vacío, habilita la selección de sección
        if ($(this).val() !== '') {
            $('#seccionSlc').prop('disabled', false);
            $('#tablaGradosSecciones').removeClass('d-none').addClass('d-block');
        } else {
            // Si el valor del grado está vacío, deshabilita la selección de sección y elimina las opciones
            $('#seccionSlc').prop('disabled', true).empty();
        }
    });

    var gradoId = $('#gradoAlumno').val();

    // Llamar a la función cargarSecciones con el valor seleccionado
    cargarSecciones(gradoId);

    $('#gradoAlumno').change(function () {
        var gradoId = $(this).val();
        
        // Limpia las opciones de la selección de sección
        cargarSecciones(gradoId)
    });

    $('#eliminarT').on('click', function () {
        
        $('#seccionSlc').empty();
        $('#gradoSlc').val('');
        $('#seccionSlc').prop('disabled', true).empty();
        $('#tablaGradosSecciones').removeClass('d-block').addClass('d-none');
    })
})

function cargarSecciones2(gradoId2) {

    $('#seccionSlc').empty();

    // Si no se ha seleccionado ningún grado, bloquea la selección de sección

    // Realiza una petición AJAX para obtener las secciones del grado seleccionado
    const urlServer = `../../asistencias/verSecciones/` + gradoId2;
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
                    $('#seccionSlc').append('<option value="' + seccion.id + '">' + seccion.nombre + '</option>');
                });

                seccionId = $('#seccionSlc').val()

                crearTablaSlc(gradoId2, seccionId);

                $('#seccionSlc').change(function () {
                    $('#tblgradoSecciones').DataTable().destroy();
                    var seccionId = $(this).val();
                    crearTablaSlc(gradoId2, seccionId);         
                    $('#seccionAlumno').empty();           
                });

                // Crear la tabla con los datos del grado y la sección seleccionados
                // crearTablaSlc(gradoId, seccionId);

            } else {
                console.log("algo salio mal " + response.error);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener las secciones:', error);
        }
    });
}

function crearTablaSlc(gradoId2, seccionId) {

    console.log(gradoId2, seccionId);
    
    const urlServer2 = `../../asistencias/alumnosGradosSecciones/${gradoId2}/${seccionId}`;

    tblAsistenciass = $('#tblgradoSecciones').DataTable({

        ajax: {
            url: urlServer2,
            dataSrc: function (json) {
                console.log(json); // Muestra todo el JSON que se está trayendo
                return json.alumnos; // Asegúrate de que este es el campo correcto en tu JSON
            }
        },
        columns: [
            { data: 'nombre_completo' },
            { data: 'codigo' },
            {
                data: 'grado',
                render: function (data, type, row) {
                    return data + '°';
                }
            },
            { data: 'seccion' },
            {
                data: null,
                render: function (data, type, row) {
                    return `
                    <button onclick="editarAlumno(${data.id})" class="btn btn-primary"><i class="fas fa-pen"></i></button>
                    <button onclick="eliminarAlumno(${data.id})" class="btn btn-danger"><i class="fas fa-trash"></i></button>
                    <button onclick="verAsis(${data.id})" class="btn btn-warning"><i class="fas fa-eye"></i></button>
                    `;
                }
            }
        ],
        language,
        dom
    });

    frmAlumnos.addEventListener('submit', function (e) {
        e.preventDefault();
        const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
        let data = new FormData(this);

        data.append('csrfmiddlewaretoken', csrfToken);

        const http = new XMLHttpRequest();
        http.open("POST", url2, true);
        http.send(data);
        http.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log(this.responseText);
                const res = JSON.parse(this.responseText);
                if (res.icono == 'success') {
                    modalNuevo.hide();
                    tblAsistenciass.ajax.reload();
                    frmAlumnos.reset();
                }
                console.log(this.responseText);
                Swal.fire("Aviso", res.msg, res.icono);
            }
        }

    })
}

function editarAlumno(idAlumno) {
    const url4 = url3.replace("0", idAlumno);
    const http = new XMLHttpRequest();
    http.open("GET", url4, true);
    http.send();
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const res = JSON.parse(this.responseText);
            console.log(res);
            if (res.icono == true) {
                document.querySelector('#id').value = res.alumno.id;
                document.querySelector('#nombreAlumno').value = res.alumno.nombre;
                document.querySelector('#apellidosAlumno').value = res.alumno.apellidos;
                $('#gradoAlumno').val(res.alumno.grado);

                gradoId = res.alumno.grado_id
                seccion_id = res.alumno.seccion_id

                $('#seccionAlumno').empty();

                $('#seccionAlumno').prop('disabled', false);
                // Si no se ha seleccionado ningún grado, bloquea la selección de sección
                if (gradoId === '') {
                    $('#seccionAlumno').prop('disabled', true);
                    return;
                }

                res.alumno.secciones.forEach(seccion => {
                    if (seccion.id === seccion_id) {
                        $('#seccionAlumno').append('<option value="' + seccion.id + '" selected>' + seccion.nombre + '</option>');
                    } else {
                        $('#seccionAlumno').append('<option value="' + seccion.id + '">' + seccion.nombre + '</option>');
                    }
                });



                titleModal.textContent = 'Editar Alumno';
                btnDatos.textContent = "Guardar"
                modalNuevo.show();

            } else {
                console.log(res.error);
            }

        }
    }
}


function eliminarAlumno(idAlumno) {
    Swal.fire({
        title: '¿Estas seguro?',
        text: "Se eliminara el alumno",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, borrar'
    }).then((result) => {
        if (result.isConfirmed) {
            const url5 = url4.replace("0", idAlumno);
            const http = new XMLHttpRequest();
            http.open("GET", url5, true);
            http.send();
            http.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    console.log(this.responseText);
                    const res = JSON.parse(this.responseText);
                    if (res.icono == 'success') {
                        tblAsistenciass.ajax.reload();
                    }
                    console.log(this.responseText);
                    Swal.fire("Aviso", res.msg, res.icono);
                }
            }
        }
    })
}

function verAsis(idAlumno) {
    modalAsis.show();
    const url1 = url5.replace("0", idAlumno);
    const http = new XMLHttpRequest();
    http.open("GET", url1, true);
    http.send();
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const res = JSON.parse(this.responseText);
            console.log(res);
            document.querySelector('#faltas').textContent = res.datos.faltas;
            document.querySelector('#tardanzas').textContent = res.datos.tardanzas;
            document.querySelector('#asistencias').textContent = res.datos.asistencias;

            const tblAsistencias = document.querySelector("#tblAsistencias tbody");

            // Objeto con las asistencias de la semana actual
            const asistenciasSemanaActual = res.asis;

            let html = `
                <tr>
                    <td>Lunes</td>
                    <td class="text-success">${asistenciasSemanaActual.lunes === 'X' ? 'X' : ''}</td>
                </tr>
                <tr>
                    <td>Martes</td>
                    <td class="text-success">${asistenciasSemanaActual.martes === 'X' ? 'X' : ''}</td>
                </tr>
                <tr>
                    <td>Miércoles</td>
                    <td class="text-success">${asistenciasSemanaActual.miercoles === 'X' ? 'X' : ''}</td>
                </tr>
                <tr>
                    <td>Jueves</td>
                    <td class="text-success">${asistenciasSemanaActual.jueves === 'X' ? 'X' : ''}</td>
                </tr>
                <tr>
                    <td>Viernes</td>
                    <td class="text-success">${asistenciasSemanaActual.viernes === 'X' ? 'X' : ''}</td>
                </tr>
            `;

            tblAsistencias.innerHTML = html;
        }
    }
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

function cargarSecciones(gradoId) {

    $('#seccionAlumno').empty();

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
                    $('#seccionAlumno').append('<option value="' + seccion.id + '">' + seccion.nombre + '</option>');
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

