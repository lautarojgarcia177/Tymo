var exports = module.exports = {};

// sqlite3
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./back/tymo_db.db', (err) => {
    if(err) {
        console.log('Error al abrir la base de datos');
        console.log(err.message);
    }
});

exports.login = function(password, callback) {
    db.serialize( () => {
        db.all('SELECT COUNT(pass) FROM passwords WHERE pass = ?',[password], function(err,rows) {
            if(err) {
                callback(err);
            } else {
                var result = rows[0];
                var resultTitle = result[Object.keys(result)[0]];
                if (resultTitle > 0) {
                    // clave correcta, devuelve true a la funcion de callback
                    callback(null,true);
                } else {
                    // clave incorrecta, devuelve false a la funcion de callback
                    callback(null,false);
                }
            }
        });
    });
};

exports.buscarEstudianteXNombre = function(name, callback) {
    let sqlQuery = 'SELECT * FROM alumno WHERE nombre LIKE "%' + name + '%";';
  db.serialize( () => {
    db.all(sqlQuery, function(err,rows) {
       if (err) {
           callback(err);
       } else {
           callback(null, rows);
       }
    });
  });
};

exports.buscarEstudianteXDNI = function(dni, callback) {
    let sqlQuery = 'SELECT * FROM alumno WHERE dni = ' + dni + ';';
    db.serialize( () => {
        db.all(sqlQuery,function(err,rows) {
            if(err) {
                callback(err);
            } else {
                callback(null, rows);
            }
        });
    });
};

exports.datosAnaliticoAlumno = function(alumnonro, callback) {
    let sqlQuery = 'SELECT m.nombre, ex.fecha, ex.nota, ex.libro, ex.acta, ex.pagina ' +
        'FROM Materia m INNER JOIN examenes ex ON m.id = ex.materia ' +
        'WHERE ex.alumno_nro = ' + alumnonro;
    db.serialize( () => {
       db.all(sqlQuery, function(err,rows) {
         if(err) {
             callback(err);
         }  else {
             callback(null,rows);
         }
       });
    });
};
