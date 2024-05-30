const modalTomarAsis = new bootstrap.Modal(document.getElementById('modalTomarAsis'));
const modalAsis = new bootstrap.Modal(document.getElementById('editarAsistencia'));

$(document).ready(function () {
    var urlServer = `../../asistencias/getAsistenciasAlumnos/` 
    const csrftoken = getCookie('csrftoken');


    const tblAsistenciasAlumnos = $('#tblAsistenciasAlumnos').DataTable({
        ajax: {
            url: urlServer,
            dataSrc: 'alumnos'
        },
        columns: [
            { data: 'fecha' },
            { data: 'hora' },
            { data: 'nombre_completo' },
            { data: 'codigo' },
            { data: 'grado_seccion' },
            { 
                data: null,

                render : function (data, type, row) {
                    let = detalle_a = '';

                    if (data.detalle == true){
                        detalle_a = '<span class="bg-success p-2 rounded-3">Puntual</span>'
                    } else {
                        detalle_a = '<span class="bg-warning p-2 rounded-3">Tarde</span>'
                    }

                    return `${detalle_a}`
                }
            },
            {
                data: null,
                render: function (data, type, row) {
                    return `
                    <button onclick="editarAsis(${data.id})" class="btn btn-primary"><i class="fas fa-pen"></i></button>
                    <button onclick="deleteAsis(${data.id})" class="btn btn-danger"><i class="fas fa-trash"></i></button>
                    `;
                }
            }
        ],
        language,
        dom,
        order: [[1, 'asc']]
    })

    $('#btnEditar').click(function () {
        var urlServer = `../../asistencias/editarAsistencia/`
        var csrftoken = getCookie('csrftoken');

        const id = $('#idAsis').val();
        const detalle = $('#detalleAsistencia').val();
        const fecha = $('#fechaAsistencia').val();
        const hora = $('#horaAsistencia').val();

        $.ajax({
            url: urlServer,
            method: 'POST',
            headers: {
                // Adjuntar el token CSRF al encabezado de la solicitud
                'X-CSRFToken': csrftoken
            },
            data: {
                'id': id,
                'detalle': detalle,
                'fecha': fecha,
                'hora': hora
            },
            success: function (response) {
                if (response.icono == true) {
                    console.log(response);

                    Swal.fire({
                        icon: 'success',
                        title: 'Asistencia actualizada',
                        text: response.msg,
                        showConfirmButton: false,
                        timer: 2000
                    })

                    modalAsis.hide();
                    tblAsistenciasAlumnos.ajax.reload();

                } else {
                    console.log("error: " + response.msg);

                    Swal.fire({
                        icon:'warning',
                        title: 'Error',
                        text: response.msg,
                        showConfirmButton: false,
                        timer: 2000
                    })
                }
            }
        })

    })
})


function escanearCodigoDeBarras() {
    // Quagga.init({
    //     inputStream: {
    //         name: "Live",
    //         type: "LiveStream",
    //         target: document.querySelector('#miCanvas')
    //     },
    //     decoder: {
    //         readers: ["code_128_reader"]
    //     },

    // }, function (err) {
    //     if (err) {
    //         console.error("Error al iniciar Quagga:", err);
    //         return;
    //     }
    //     console.log("Quagga iniciado correctamente");
    //     Quagga.start();
    // });

    // Quagga.onDetected(function (result) {

    code = "JCM64433945";

    var codigoAlumno = code;
    // Enviar el código de barras escaneado al formulario
    const datosAlumno = document.querySelector('#datosAlumno')

    const url = url7.replace("0", codigoAlumno);
    const http = new XMLHttpRequest();
    http.open("GET", url, true);
    http.send();
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const res = JSON.parse(this.responseText);
            console.log(res);

            if (res.icono == true) {

                document.querySelector('#id').value = res.id;
                document.querySelector('#codigoAlumno').value = res.codigoAlumno;
                document.querySelector('#nombreCompletoA').value = res.nombreCompleto;

                let html = `
                        <p class="h4"><b>Nombre Completo:</b> ${res.nombreCompleto}</p>
                        <p class="h4"><b>Grado:</b> ${res.grado}</p>
                        <p class="h4"><b>Seccion:</b> ${res.seccion}</p>
                    `
                datosAlumno.innerHTML = html;

            } else {
                console.log("error: " + res.error);
            }

        }
    }
    // Puedes agregar aquí código para enviar el código de barras al servidor y obtener los datos del alumno correspondiente
    // });
}

function editarAsis(idAsis) {

    modalAsis.show();

    const urlServer = `../../asistencias/getAsistencia/`;
    const csrftoken = getCookie('csrftoken');

    $.ajax({
        url: urlServer,
        method: 'GET',
        headers: {
            // Adjuntar el token CSRF al encabezado de la solicitud
            'X-CSRFToken': csrftoken
        },
        data: {
            'idAsis': idAsis
        },
        success: function (response) {
            if (response.icono == true) {

                console.log(response);
                
                $('#idAsis').val(response.asistencias.id);
                $('#fechaAsistencia').val(response.asistencias.fecha);
                $('#horaAsistencia').val(response.asistencias.hora);
                $('#detalleAsistencia').val(response.asistencias.detalle);

            } else {
                console.log("error: " + response.msg);
                
            }
        },
        error: function (xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
}


function deleteAsis(idAsis) {
    var urlServer = `../../asistencias/deleteAsistencia/`;
    const csrftoken = getCookie('csrftoken');

    Swal.fire({
        title: '¿Estas seguro/a?',
        text: "No podras revertir esta accion!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: urlServer,
                method: 'GET',
                headers: {
                    // Adjuntar el token CSRF al encabezado de la solicitud
                    'X-CSRFToken': csrftoken
                },
                data: {
                    'idAsis': idAsis
                },
                success: function (response) {
                    if (response.icono == true) {

                        Swal.fire({
                            icon: 'success',
                            title: 'Asistencia eliminada',
                            text: response.msg,
                            showConfirmButton: false,
                            timer: 2000
                        })

                        $('#tblAsistenciasAlumnos').DataTable().ajax.reload();
                        console.log(response);

                    } else {
                        console.log("error: " + response.msg);

                        Swal.fire({
                            icon:'warning',
                            title: 'Error',
                            text: response.msg,
                            showConfirmButton: false,
                            timer: 2000
                        })
                    }
                },
                error: function (xhr, status, error) {
                    console.log(xhr.responseText);
                }
            });
        }
    })
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