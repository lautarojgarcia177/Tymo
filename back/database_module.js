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
    let sqlQuery = 'SELECT a.NRO_ALUM, a.TIP_DOC, a.NUM_DOC, a.NOMBRE FROM ALUMNOS a WHERE a.NOMBRE LIKE "%' + name + '%";';
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
    let sqlQuery = "SELECT a.NRO_ALUM, a.TIP_DOC, a.NUM_DOC, a.NOMBRE FROM ALUMNOS a WHERE TIP_DOC = 'DNI' AND NUM_DOC = " + dni + ';';
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

exports.buscarEstudianteXLC = function(lc, callback) {
    let sqlQuery = "SELECT a.NRO_ALUM, a.TIP_DOC, a.NUM_DOC, a.NOMBRE FROM ALUMNOS a WHERE TIP_DOC = 'LC' AND NUM_DOC = '" + lc + "';";
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

exports.buscarEstudianteXNumero = function(numero, callback) {
    let sqlQuery = "SELECT a.NRO_ALUM, a.TIP_DOC, a.NUM_DOC, a.NOMBRE FROM ALUMNOS a WHERE NRO_ALUM LIKE '%" + numero + "';";
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

exports.obtenerNombreMateria = function(codMateria, callback) {
    console.log('codigo de la materia: ', codMateria);
    let sqlQuery = 'SELECT MEMO_FIJO' +
                    'FROM MATERIAS m ' +
                    "WHERE REST_CLAVE = '" + codMateria + "'";
    db.serialize( () => {
        db.all(sqlQuery, function(err, rows) {
            if(err) {
                callback(err);
            } else {
                callback(null, rows);
            }
        })
    })
}

exports.datosAnaliticoAlumno = function(alumnonro, callback) {
    let sqlQuery1 =  'SELECT * ' +  
                    'FROM ALUMNOS a ' +
                    'LEFT JOIN CARRERAS c ON a.CARRERA = c.NUMERO_CARRERA ' +
                    "JOIN EXAMENES e ON substr(a.nro_alum,3,7) LIKE ('%' + e.ALUMNO) " +
                    'WHERE a.NRO_ALUM = ' + alumnonro + ';'
                    ;
    db.serialize( () => {
       db.all(sqlQuery1, function(err,rows) {
         if(err) {
             callback(err);
         }  else {
             if(rows.length !== 0) {
                callback(null,rows);
             } else {
                let sqlQuery2 =  'SELECT * ' +  
                'FROM ALUMNOS a ' +
                'LEFT JOIN CARRERAS c ON a.CARRERA = c.NUMERO_CARRERA ' +
                "JOIN EXAMENES e ON substr(a.nro_alum,4,6) LIKE ('%' + e.ALUMNO) " +
                'WHERE a.NRO_ALUM = ' + alumnonro + ';'
                ;
                db.all(sqlQuery2, (err,rows) => {
                    if(err) {
                        callback(err);
                    } else {
                        callback(null,rows);
                    }
                });
             }             
         }
       });
    });
}; 


