if (sessionStorage.getItem("logueado") !== "true") {
    window.location.href = 'index.html';
}

$(document).ready(function() {

   $('#btn-buscar').on('click', function() {
       if($('#input-buscar-alumno').val() !== '') {
           limpiar();
           $('#spinner-login').show();
           switch($('#select-buscar-alumno').val()) {
               case 'Nombre':
                   var query = 'nombre=' + $('#input-buscar-alumno').val().toString();
                   buscarAlumnoPorNombre(query);
                   break;
               case 'DNI':
                   buscarAlumnoPorDNI($('#input-buscar-alumno').val());
                    // TODO
                   break;
               case 'Numero':
                   buscarAlumnoPorNumero($('#input-buscar-alumno').val());
                   // TODO
                   break;
           }
       } else {
           $('#alert-clave-incorrecta').show();
       }
   });
});

function buscarAlumnoPorNombre(nombre) {
    fetch('/alumnos', {
        method: 'POST',
        headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    body: nombre
}).then( res => {
    res.json().then((data) => {
        $('#spinner-login').hide();
        mostrarTabla(data);
    });
}).catch(err => {
    console.log('Hubo un error al enviar la contraseña', err);
});
}

function buscarAlumnoPorDNI(dni) {
 // TODO
}

function buscarAlumnoPorNumero(numero) {
    // TODO
}

// Muestra los resultados de una busqueda en una tabla para que se pueda seleccionar
// cual es el alumno que se desea imprimir el analitico.
function mostrarTabla(data) {
    if(data.length !== 0) {
        let newRow;
        let acu = 0;
        let btnSeleccionarAlumno = '<button id="btn-seleccionar-alumno-' + acu
            +'" class="btn btn-outline-success my-2 my-sm-0 btn-seleccionar-alumno">Seleccionar</button>';
        data.forEach(function(item) {
            newRow = '<tr><td>' + item.numero + '</td><td>' + item.dni + '</td><td>' +
                item.nombre + '</td><td>' + item.fecha_ingreso + '</td><td>' + btnSeleccionarAlumno + '</td></tr>';
            $('table tbody').append(newRow);
            acu++;
            btnSeleccionarAlumno = '<button id="btn-seleccionar-alumno-' + acu
                +'" class="btn btn-outline-success my-2 my-sm-0 btn-seleccionar-alumno">Seleccionar</button>';
        });
        $('.btn-seleccionar-alumno').on('click', function() {
            let numeroColumna =this.id.substring(23);
            mostrarAnaliticoAlumno(data[numeroColumna]);
        });
        $('table').show();
    } else {
        $('#no-hay-alumnos').show();
    }
}

//Limpia la pantalla para cuando se hace una nueva busqueda
function limpiar() {
    $('table tbody').empty();
    $('#no-hay-alumnos').hide();
    $('#alert-clave-incorrecta').hide();
}

function mostrarAnaliticoAlumno(alumno) {
    let alumnonroquery = 'alumnonro=' + alumno.numero;
    fetch('/analitico', {
        method: 'POST',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: alumnonroquery
    }).then( result => {
        result.blob()
            .then( pdfblob => {
                var blobURL = window.URL.createObjectURL(pdfblob);
                $('#object-pdf-analitico').attr({'data': blobURL});
            });
    })
    .catch(err => {
        console.log('Hubo un error al obtener el analítico', err);
    });
}


