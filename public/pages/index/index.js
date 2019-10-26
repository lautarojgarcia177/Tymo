$(document).ready(function() {
    if(sessionStorage.getItem("logueado") == "true") {
        loguear();
    }

    $('#login-button').on('click', function () {
        comprobarClave();
    });
    
    $('#password-login-input').on('keyup', function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            comprobarClave();
        }
    });
    
});



function loguear() {
    sessionStorage.setItem('logueado','true');
    window.location.href = 'inicio.html';
}

function comprobarClave() {
        // hide form and show spinner
        $('#login-form').hide();
        $('#spinner-login').show();
        var typedPassword = 'password=' + $('#password-login-input').val().toString();

        fetch('/login', {
            method: 'POST',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body: typedPassword
        }).then( res => {
            res.text().then( data => {
               if(data === "clave correcta") {
                   loguear();
               } else {
                   $('#password-login-input').val('');
                   $('#login-form').show();
                   $('#spinner-login').hide();
                   $('#alert-clave-incorrecta').show();
               }
            });
        }).catch(err => {
            console.log('Hubo un error al enviar la contraseña', err);
        });
};

