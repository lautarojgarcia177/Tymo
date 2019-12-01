// firt, before everything else, check if user is logged
if (sessionStorage.getItem("logueado") !== "true") {
    window.location.href = 'index.html';
}

$(document).ready(function() {
    $("#analitico").on('click', function() {
        window.location.href="analiticos.html";
    });

    $("#observaciones").on('click', function() {
        window.location.href="observaciones.html";
    });
});

document.addEventListener('keydown', () => {
    switch (event.keyCode) {
        case 119:
            window.location.href="observaciones.html";
            break;
        case 116:
            event.preventDefault();
            window.location.href="analiticos.html";
            break;
    }
});