const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./back/database_module');
const pdfanalitico = require('./back/reportes/analitico_generator');
const aux = require('./back/auxiliares');

//middleware
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname,'./public/pages/index/index.html'));
});

app.get('/index_template', (req,res) => {
    res.sendFile(path.join(__dirname,'./public/pages/index_template/index.html'));
});

app.get('/prueba', (req,res) => {
    res.sendFile(path.join(__dirname,'/public/pages/prueba/prueba.html'));
});

app.post('/login', (req,res) => {
    db.login(req.body.password, function(err, claveCorrecta) {
        if (err) {
            res.statusCode = 400;
            res.end('Ha ocurrido un error ' + err.message);
        } else {
            if (claveCorrecta === true) {
                res.statusCode = 200;
                res.end('clave correcta');
            } else {
                res.statusCode = 200;
                res.end('clave incorrecta');
            }
        }
    });
});

app.get('/acerca-de.html', (req,res) => {
    res.sendFile(path.join(__dirname, './public/pages/acerca-de/acerca-de.html'));
});

app.get('/contacto.html', (req,res) => {
    res.sendFile(path.join(__dirname, './public/pages/contacto/contacto.html'));
});

app.get('/inicio.html', (req,res) => {
    res.sendFile(path.join(__dirname,'./public/pages/inicio/inicio.html'));
});

app.get('/analiticos.html', (req,res) => {
    res.sendFile(path.join(__dirname,'./public/pages/analiticos/analiticos.html'));
});

/* app.post('/analitico', (req,res) => {
    try {
        db.datosAnaliticoAlumno(req.body.alumnonro, (err,rows) => {
            if (err) {
                res.statusCode = 500;
                res.end('Ha ocurrido un error al consultar los datos: ' + err.message);
            } else {
                
                pdfanalitico.generarPDFAnalitico(rows, db, res, (err) => {
                    if (err) {
                        res.statusCode = 500;
                        res.end('Hubo un error al generar el pdf: ' + err.message);
                    }
                });
            }
        });
    } catch (err) {
        res.statusCode = 500;
        res.end('Hubo un error al generar el analitico: '+ err.message);
    }
}); */

app.get('/analitico', (req,res) => {
    try {
        db.datosAnaliticoAlumno(req.query.alumnonro, (err,rows) => {
            if (err) {
                res.statusCode = 500;
                res.end('Ha ocurrido un error al consultar los datos: ' + err.message);
            } else { 
                aux.generarArrayConNombresDeMaterias(rows, db, (arrayConNombresDeMaterias) => {
                    pdfanalitico.generarPDFAnalitico(rows, db, req.query.observaciones, res, arrayConNombresDeMaterias, (err) => {
                        if (err) {
                            res.statusCode = 500;
                            res.end('Hubo un error al generar el pdf: ' + err.message);
                        }
                    });
                });
            }
        });
    } catch (err) {
        res.statusCode = 500;
        res.end('Hubo un error al generar el analítico: ' + err.message);
    }
});

app.post('/alumnosXnombre', (req,res) => {
    db.buscarEstudianteXNombre(req.body.nombre, (err,rows) => {
        if (err) {
            res.statusCode = 400;
            res.end('Ha ocurrido un error ' + err.message);
        } else {
            res.statusCode = 200;
            res.end(JSON.stringify(rows));
        }
    });
});

app.post('/alumnosXDNI', (req,res) => {
    db.buscarEstudianteXDNI(req.body.dni, (err,rows) => {
        if(err) {
            res.statusCode = 400;
            res.end('Ha ocurrido un error ' + err.message);
        } else {
            res.statusCode = 200;
            res.end(JSON.stringify(rows));
        }
    });
});

app.post('/alumnosXLC', (req,res) => {
    db.buscarEstudianteXLC(req.body.lc, (err,rows) => {
        if(err) {
            res.statusCode = 400;
            res.end('Ha ocurrido un error ' + err.message);
        } else {
            res.statusCode = 200;
            res.end(JSON.stringify(rows));
        }
    });
});

app.post('/alumnosXNumero', (req,res) => {
    db.buscarEstudianteXNumero(req.body.numero, (err,rows) => {
        if(err) {
            res.statusCode = 400;
            res.end('Ha ocurrido un error ' + err.message);
        } else {
            res.statusCode = 200;
            res.end(JSON.stringify(rows));
        }
    });
});

app.use(function (req,res,next) {
    res.status(404).sendFile(path.join(__dirname,'./public/pages/error/404.html'));
});

// listen to port 
app.listen(port);