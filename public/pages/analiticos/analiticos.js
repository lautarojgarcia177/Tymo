if (sessionStorage.getItem("logueado") !== "true") {
    window.location.href = 'index.html';
}

$(document).ready(function() {

   $('#btn-buscar').on('click', function() {
       if($('#input-buscar-alumno').val() !== '') {
           limpiar();
           $('#spinner-buscando').show();
           switch($('#select-buscar-alumno').val()) {
               case 'name':
                   var query = 'nombre=' + $('#input-buscar-alumno').val().toString();
                   buscarAlumnoPorNombre(query);
                   break;
               case 'dni':
                   var query = 'dni=' + $('#input-buscar-alumno').val();
                   buscarAlumnoPorDNI(query);
                   break;
               case 'lc':
                   var query = 'lc=' + $('#input-buscar-alumno').val();
                   buscarAlumnoPorLC(query);
                   break; 
               case 'legajo':
                   var query = 'numero=' + $('#input-buscar-alumno').val();
                   buscarAlumnoPorNumero(query); 
                   break;
           }
       } else {
           $('#alert-clave-incorrecta').show();
       }
   });

   $('#select-buscar-alumno').change(function() {
        var value = $('#select-buscar-alumno').val();
        if (value == 'Numero') {
            $('#input-buscar-alumno').attr('type','number');
        } else {
            $('#input-buscar-alumno').attr('type','text');
        }
   }); 

   $('#input-buscar-alumno').on('keyup', function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            $('#btn-buscar').trigger('click');
        }
    });

});

function buscarAlumnoPorNombre(nombre) {
    fetch('/alumnosXnombre', {
        method: 'POST',
        headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    body: nombre
}).then( res => {
    res.json().then((data) => {
        $('#spinner-buscando').hide();
        mostrarTabla(data);
    });
}).catch(err => {
    alert('Hubo un error al buscar los alumnos' + err);
    console.log('Hubo un error al buscar los alumnos', err);
});
}

function buscarAlumnoPorDNI(dni) {
    fetch('/alumnosXDNI', {
        method: 'POST',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: dni
    }).then( res => {
        res.json().then((data) => {
            $('#spinner-buscando').hide();
            mostrarTabla(data);
        });
    }).catch(err => {
        alert('Hubo un error al buscar los alumnos' + err);
        console.log('Hubo un error al buscar los alumnos', err);
    });
}

function buscarAlumnoPorLC(lc) {
    fetch('/alumnosXLC', {
        method: 'POST',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: lc
    }).then( res => {
        res.json().then((data) => {
            $('#spinner-buscando').hide();
            mostrarTabla(data);
        });
    }).catch(err => {
        alert('Hubo un error al buscar los alumnos' + err);
        console.log('Hubo un error al buscar los alumnos', err);
    });
}

function buscarAlumnoPorNumero(numero) {
    fetch('/alumnosXNumero', {
        method: 'POST',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: numero
    }).then( res => {
        res.json().then((data) => {
            $('#spinner-buscando').hide();
            mostrarTabla(data);
        });
    }).catch(err => {
        alert('Hubo un error al buscar los alumnos' + err);
        console.log('Hubo un error al buscar los alumnos', err);
    });
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
            console.log(item);
            newRow = '<tr><td>' + item.NRO_ALUM + '</td><td>' + item.TIP_DOC + '</td><td>' +
                item.NUM_DOC + '</td><td>' + item.NOMBRE + '</td><td>' + btnSeleccionarAlumno + '</td></tr>';
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
/*
function mostrarAnaliticoAlumno(alumno) {
    $('table').hide();
    $('#spinner-buscando').show();
    let alumnonroquery = 'alumnonro=' + alumno.NRO_ALUM;
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
        $('#spinner-buscando').hide();
        $('table').hide();
    })
    .catch(err => {
        console.log('Hubo un error al obtener el analítico', err);
    });
} 
*/

function mostrarAnaliticoAlumno(alumno) {
    $('table').hide();
    $('#spinner-buscando').show();
    window.open('/analitico?alumnonro=' + alumno.NRO_ALUM,'_blank');
    $('table').show();
    $('#spinner-buscando').hide();
}
