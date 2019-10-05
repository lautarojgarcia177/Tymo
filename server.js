const http = require('http');
const fs = require('fs');
const url = require('url');
// Operaciones con la base de datos
const db = require('./back/database_module');
const pdfanalitico = require('./back/reportes/analitico_generator');

const server = http.createServer((request, response) => {
    // para acceder a las query
    const queryObject = url.parse(request.url, true).query;

    request.on('error', (err) => {
        response.statusCode = 400;
        response.end('Ha ocurrido un error ' + err);
    });
    response.on('error', (err) => {
        console.error(err);
    });
    switch(request.method) {
        case 'POST':
            switch(request.url) {
                case '/alumnos':
                    try {
                        let body = [];
                        request.on('data', chunk => {
                           body.push(chunk);
                        });
                        request.on('end', () => {
                            let nombre = body.toString().substring(7);
                            db.buscarEstudianteXNombre(nombre,function(err, rows) {
                                if (err) {
                                    response.statusCode = 400;
                                    response.end('Ha ocurrido un error ' + err.message);
                                } else {
                                    response.statusCode = 200;
                                    response.end(JSON.stringify(rows));
                                }
                            });
                        })
                    } catch(err) {
                        response.statusCode = 400;
                        response.end('Ha ocurrido un error ' + err);
                    }
                    break;
                case '/login':
                    try {
                        let body = [];
                        request.on('data', chunk => {
                           body.push(chunk);
                        });
                        request.on('end', () => {
                            let password = body.toString().substring(9);
                            db.login(password, function(err, claveCorrecta) {
                                if (err) {
                                    response.statusCode = 400;
                                    response.end('Ha ocurrido un error ' + err.message);
                                } else {
                                    if (claveCorrecta === true) {
                                        response.statusCode = 200;
                                        response.end('clave correcta');
                                    } else {
                                        response.statusCode = 200;
                                        response.end('clave incorrecta');
                                    }
                                }
                            });
                        });
                    } catch(err) {
                        response.statusCode = 400;
                        response.end('Ha ocurrido un error ' + err);
                    }
                    break;
                case '/test':
                    try {
                        let data = [];
                        request.on('data', chunk => {
                            data.push(chunk);
                        });
                        request.on('end', () => {
                            let bodyAsJson = JSON.parse(data);
                            response.statusCode = 200;
                            response.end('tuto bene');
                        });
                    } catch(err) {
                        console.log('hubo un error');
                        console.log(err);
                        response.statusCode = 404;
                        response.end('No se ha encontrado el recurso solicitado');
                    }
                    break;
                case '/analitico':
                    try {
                        let body = [];
                        request.on('data', chunk => {
                           body.push(chunk)
                        });
                        request.on('end', () => {
                            let alumnonro = body.toString().substring(10);
                            db.datosAnaliticoAlumno(alumnonro, function(err,rows) {
                               if (err) {
                                   response.statusCode = 400;
                                   response.end('Ha ocurrido un error ' + err.message);
                               } else {
                                    pdfanalitico.generarPDFAnalitico(rows, function(err,pdfanalitico) {
                                       if(err) {
                                           response.statusCode = 500;
                                           response.end('Hubo un error al generar el pdf ' + err.message);
                                       } else {
                                           response.writeHead(200, {
                                              'Content-Type': 'application/pdf',
                                              'Content-Disposition': 'attachment; filename=some_file.pdf',
                                               'Content-Length': pdfanalitico.length
                                           });
                                           //res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
                                           response.send(pdfanalitico);
                                           response.end();
                                       }
                                    });
                               }
                            });
                        })
                    } catch(err) {
                        response.statusCode = 400;
                        response.end('Ha ocurrido un error' + err);
                    }
                    break;
                default:
                    response.statusCode = 404;
                    response.end('No se ha encontrado el recurso solicitado');
            }
            break;
        case 'GET':
            switch(request.url) {
                // Archivos necesarios para el front
                case '/jquery-3.4.1.min.js':
                    fs.readFile('./front/jquery-3.4.1.min.js', function(err, data) {
                        if(err) {
                            response.statusCode(500);
                            response.end('Ha ocurrido un error en el servidor');
                        } else {
                            response.writeHead(200, {'Content-Type': 'text/javascript'});
                            response.end(data);
                        }
                    });
                    break;
                case '/bootstrap-4.3.1-dist/js/bootstrap.bundle.js':
                    fs.readFile('./front/bootstrap-4.3.1-dist/js/bootstrap.bundle.js', function(err, data) {
                        if(err) {
                            response.statusCode(500);
                            response.end('Ha ocurrido un error en el servidor');
                        } else {
                            response.writeHead(200, {'Content-Type': 'text/javascript'});
                            response.end(data);
                        }
                    });
                    break;
                case '/bootstrap-4.3.1-dist/css/bootstrap.css':
                    fs.readFile('./front/bootstrap-4.3.1-dist/css/bootstrap.css', function(err, data) {
                        if(err) {
                            response.statusCode(500);
                            response.end('Ha ocurrido un error en el servidor');
                        } else {
                            response.writeHead(200, {'Content-Type': 'text/css'});
                            response.end(data);
                        }
                    });
                    break;
                // Páginas web
                case '/':
                    fs.readFile('./front/pages/index/index.html', function(err, data) {
                       if(err) {
                           response.statusCode(500);
                           response.end('Ha ocurrido un error en el servidor');
                       } else {
                           response.writeHead(200, {'Content-Type': 'text/html'});
                           response.end(data);
                       }
                    });
                    break;
                case '/index.html':
                    fs.readFile('./front/pages/index/index.html', function(err, data) {
                        if(err) {
                            response.statusCode(500);
                            response.end('Ha ocurrido un error en el servidor');
                        } else {
                            response.writeHead(200, {'Content-Type': 'text/html'});
                            response.end(data);
                        }
                    });
                    break;
                case '/index.js':
                    fs.readFile('./front/pages/index/index.js', function(err, data) {
                        if(err) {
                            response.statusCode(500);
                            response.end('Ha ocurrido un error en el servidor');
                        } else {
                            response.writeHead(200, {'Content-Type': 'text/javascript'});
                            response.end(data);
                        }
                    });
                    break;
                case '/inicio':
                    fs.readFile('./front/pages/inicio/inicio.html', function(err, data) {
                        if(err) {
                            response.statusCode(500);
                            response.end('Ha ocurrido un error en el servidor');
                        } else {
                            response.writeHead(200, {'Content-Type': 'text/html'});
                            response.end(data);
                        }
                    });
                    break;
                case '/inicio.html':
                    fs.readFile('./front/pages/inicio/inicio.html', function(err, data) {
                        if(err) {
                            response.statusCode(500);
                            response.end('Ha ocurrido un error en el servidor');
                        } else {
                            response.writeHead(200, {'Content-Type': 'text/html'});
                            response.end(data);
                        }
                    });
                    break;
                case '/inicio.js':
                    fs.readFile('./front/pages/inicio/inicio.js', function(err, data) {
                        if(err) {
                            response.statusCode(500);
                            response.end('Ha ocurrido un error en el servidor');
                        } else {
                            response.writeHead(200, {'Content-Type': 'text/javascript'});
                            response.end(data);
                        }
                    });
                    break;
                case '/analiticos':
                    fs.readFile('./front/pages/analiticos/analiticos.html', function(err, data) {
                        if(err) {
                            response.statusCode(500);
                            response.end('Ha ocurrido un error en el servidor');
                        } else {
                            response.writeHead(200, {'Content-Type': 'text/html'});
                            response.end(data);
                        }
                    });
                    break;
                case '/analiticos.html':
                    fs.readFile('./front/pages/analiticos/analiticos.html', function(err, data) {
                        if(err) {
                            response.statusCode(500);
                            response.end('Ha ocurrido un error en el servidor');
                        } else {
                            response.writeHead(200, {'Content-Type': 'text/html'});
                            response.end(data);
                        }
                    });
                    break;
                case '/analiticos.js':
                    fs.readFile('./front/pages/analiticos/analiticos.js', function(err, data) {
                        if(err) {
                            response.statusCode(500);
                            response.end('Ha ocurrido un error en el servidor');
                        } else {
                            response.writeHead(200, {'Content-Type': 'text/javascript'});
                            response.end(data);
                        }
                    });
                    break;
                default:
                    response.statusCode = 404;
                    response.end('No se ha encontrado el recurso solicitado');
            }
            break;
        default:
            response.statusCode = 404;
            response.end('No se ha encontrado el recurso solicitado');
    }
}).listen(8080);
