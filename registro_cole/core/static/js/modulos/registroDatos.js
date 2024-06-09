

$(document).ready(function () {
    $('#btnActualizarEscuela').click(function () {
        var csrftoken = getCookie('csrftoken');
        var urlServer = `../../registrarDatosCole/`  

        var nombreEscuela = $('#nombreEscuela').val();
        var imagenEscuela = $('#imagenEscuela').val();
        var nombreDirector = $('#nombreDirector').val();

        $.ajax({
            url: urlServer,
            type: "POST",
            headers: {'X-CSRFToken': csrftoken},
            data: {
                nombreEscuela : nombreEscuela,
                imagenEscuela : imagenEscuela,
                nombreDirector : nombreDirector,
            },
            success: function (response) {
                console.log(response);  

                if (response.estado == true) {

                    console.log(response);

                    Swal.fire({
                        title: "Aviso",
                        icon: response.icono,
                        text: response.msg,
                        showConfirmButton: false,
                        timer: 2000
                    })  

                } else {
                    console.log(response);
                }

            },
            error: function (status, error, data) {
                console.log(status, error);
            }
        })
    })
})



function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}