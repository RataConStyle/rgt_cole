const modalTomarAsis = new bootstrap.Modal(document.getElementById('modalTomarAsis'));


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
