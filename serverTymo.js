const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./back/database_module');
const pdfanalitico = require('./back/reportes/analitico_generator');

//middleware
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname,'./public/pages/index/index.html'));
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

app.get('/inicio.html', (req,res) => {
    res.sendFile(path.join(__dirname,'./public/pages/inicio/inicio.html'));
});

app.get('/analiticos.html', (req,res) => {
    res.sendFile(path.join(__dirname,'./public/pages/analiticos/analiticos.html'));
});

app.post('/analitico', (req,res) => {
    try {
        db.datosAnaliticoAlumno(req.body.alumnonro, (err,rows) => {
            if (err) {
                res.statusCode = 500;
                res.end('Ha ocurrido un error al consultar los datos: ' + err.message);
            } else {
                pdfanalitico.generarPDFAnalitico(rows, res, (err) => {
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
});

app.post('/alumnos', (req,res) => {
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

app.use(function (req,res,next) {
    res.status(404).send("Sorry, can't find that!");
});

// listen to port 
app.listen(port);