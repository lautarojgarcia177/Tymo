// firt, before everything else, check if user is logged
if (sessionStorage.getItem("logueado") !== "true") {
    window.location.href = 'index.html';
}

$(document).ready(function() {
    $(".opcion").on('click', function() {
        window.location.href="analiticos.html";
    });
});
