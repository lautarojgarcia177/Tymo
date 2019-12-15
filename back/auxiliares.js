var exports = module.exports = {};

exports.obtenerCodigoDeMateria = function(row, callback) {
    let nroMateria = String(row.MATERIA);
    switch(nroMateria.length) {
        case 1:
            nroMateria = '00' + nroMateria;
            break;
        case 2:
            nroMateria = '0' + nroMateria;
            break;
        default:
            break;
    }
    let codigoMateria = row.NUMERO_CARRERA + row.PLAN + nroMateria;
    callback(codigoMateria);
}

exports.generarArrayConNombresDeMaterias = function(rows, db, callback) {
    let arrayConNombresDeMaterias = [];
    rows.forEach((row) => {
        this.obtenerCodigoDeMateria(row, (codigoMateria) => {
            try {
                db.obtenerNombreMateria(codigoMateria, (err, nombreMateria) => {
                    cargarArrayConNombreDeMateria(nombreMateria, arrayConNombresDeMaterias, (err, arrayResultado) => {
                        if(rows.indexOf(row) === rows.length - 1) {
                            callback(arrayConNombresDeMaterias);
                        }
                    });
                });
            } catch(err) {
                console.log('been here err');
            }
        });
    });
}

function cargarArrayConNombreDeMateria(obj, array, callback) {
    try {
        array.push(obj[0][Object.keys(obj[0])[0]]);
        callback(null, array);
    } catch(err) {
        callback(err);
    }    
}
