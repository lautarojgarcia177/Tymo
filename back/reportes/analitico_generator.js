var exports = module.exports = {};

const PDFDocument = require('pdfkit');
const fs = require('fs');

const stream = require('stream');

const numberConverter = require('../conversor_numeros_a_letras');

exports.generarPDFAnalitico = function(rows, db, observaciones, res, callback) {
    try {
        let datos = rows[0];
        // Create a document
        var doc = new PDFDocument({
            info: {
                Title: 'Certificado analitico',
                Subject: 'Certificado analitico',
            },
            autoFirstPage: false,
            bufferPages: true,
            size: [595.28, 841.89],
            margins: {
                top: 40,
                bottom: 40,
                left: 35,
                right: 35
            }
        });
        doc.on('pageAdded', () => {
            generarParteDeArribaDeTodasLasHojas(doc,datos);
        });
        doc.addPage();

        //tabla con examenes y totales
        generarTablaExamenes(rows, 35, 250, doc, db);

        // HTTP RES
        doc.pipe(res);
        doc.end();
            
        let filename = 'Analítico ' + datos.NOMBRE +'.pdf';
        res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
        res.setHeader('Content-type', 'application/pdf');

        callback(null);
    } catch(err) {
        callback(err);
    }
};

function generarParteDeArribaDeTodasLasHojas(doc, datos) {
    doc.image('back/reportes/assets/logo-unc.jpg', 35, 40, {
        width: 80
    });
    doc.font('Helvetica-Bold').fontSize(10);
    doc.text('UNIVERSIDAD NACIONAL DE CÓRDOBA', 35, 90,{align: 'left'});
    doc.text('FACULTAD DE FILOSOFÍA Y HUMANIDADES', 35, 105, {align: 'left'});

    doc.fontSize(14);
    doc.text('ANALÍTICO', 35, 125, {
        align: 'center',
        underline: 'true'
    });

    doc.fontSize(11);
    doc.text('Carrera: ' + sanitizarDato(datos.NOMBRE_CARRERA) + ' - PLAN ' + sanitizarNroPlan(datos.PLAN), 35, 155);    
    doc.text('Título: ' + sanitizarDato(datos.NUMERO_CARRERA) + ' ' + sanitizarDatoTitulo(datos), 35, 175);

    doc.fontSize(10).font('Helvetica');
    var texto = 'La Universidad Nacional de Córdoba - Facultad de Filosofía y Humanidades certifica que ' +
        datos.NOMBRE + ', Legajo N° ' + datos.NRO_ALUM + ', ' + datos.TIP_DOC + ' ' + datos.NUM_DOC + 
        ', quien ingresó el día <completar!!!!>' + ', registra la siguiente historia académica en la carrera' +
        ' de ' + sanitizarDato(datos.NOMBRE_CARRERA) + ', dictada en Facultad de Filosofía y Humanidades.';
    doc.text(texto, 35, 210, {align: 'justify'});
}

function generarFooter(doc, today, pageNumber) {
    doc.moveTo(30, 745)
        .lineTo(582, 745)
        .stroke();
    var footerText = today + '                                                                          '
     + '                                                                    Página ' + pageNumber;
    doc.fontSize(10).text(footerText, 30, 750);
}

function generarFooter2(doc,today, pageNumber, totalPagesNumber) {
    doc.moveTo(30, 745)
    .lineTo(582, 745)
    .stroke();
    var footerText = today + '                                                                          '
    + '                                                                    Página ' + pageNumber + ' de ' + totalPagesNumber;
    doc.fontSize(10).text(footerText, 30, 750);
}

function getTodaysDate() {
    var today = new Date();

    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    
    var hh = today.getHours();
    var min = today.getMinutes();
    var ss = today.getSeconds();

    today = dd + '/' + mm + '/' + yyyy + ' ' + hh + ':' + min + ':' +ss;
    return today;
}

function getTodaysDateEnTexto() {
    var today = new Date();

    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    var Converter = numberConverter.conversorNumerosALetras;
    let myConverter = new Converter();
    
    dd = myConverter.convertToText(String(dd));
    yyyy = myConverter.convertToText(String(yyyy));
    mm = myConverter.convertirNroMesAtexto(String(mm));

    return `${dd} de ${mm} de ${yyyy}`;
}

function sanitizarDato(dato) {
    if(dato) {
        return dato;
    } else {
        return '-';
    }
}

function sanitizarNroPlan(nroPlan) {
    if(nroPlan) {
        nroPlanInt = parseInt(nroPlan);
        if(nroPlanInt < 55) {
            return nroPlanInt + 2000;
        } else {
            return nroPlanInt + 1900;
        }
    } else {
        return '-';
    }    
}

function sanitizarDatoTitulo(data) {
    if(data.TITULO_CARRERA_MASCULINO) {
        if(data.SEXO == 1) {
            return data.TITULO_CARRERA_MASCULINO;
        } else {
            return data.TITULO_CARRERA_FEMENINO;
        }
    } else {
        return '-';
    }    
}

function generarTablaExamenes(data, x, y, documento, db) {
    let cantAprobadas = 0;
    let acuAprobadas = 0;
    let cantReprobadas = 0;
    let acuReprobadas = 0;
    //Linea de arriba
    documento.moveTo(x, y)
            .lineTo(560.28, y)
            .stroke();
    //Nombres de las columnas            
    y+=7;
    documento.font('Helvetica-Bold')
            .text('ASIGNATURA', x + 70, y)
            .text('FECHA', x + 140, y)
            .text('NOTA', x + 200, y)
            .text('Tipo', x + 240, y)
            .text('Libro', x + 300, y)
            .text('Acta', x + 340, y)
            .text('Pg', x + 380, y)
            .text('Cred', x + 420, y);
    //Linea de abajo primera fila
    y+=15;
    let y2 = y;  
    //Lineas de tabla de la tabla
    documento.font('Helvetica');
    for(i = 0; i<= data.length; i++) {   
        documento.moveTo(x, y2)
        .lineTo(560.28,y2)
        .stroke(); 
        y2+=15;
    }  
    //Llenar la info de la tabla
    y+=4;
    data.forEach( (row) => {
        // Obtener nombre de la materia a partir de su numero
        let nroMateria = String(row.MATERIA);
        let materiaName;
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
        db.obtenerNombreMateria(codigoMateria, (err, nombreMateria) => { 
            if(err) {
                console.log('Hubo un error: ', err);
            } else {
                try {
                    materiaName = nombreMateria[0][Object.keys(nombreMateria[0])[0]];
                    console.log(materiaName);
                    //documento.text(materiaName, x + 20, y);
                } catch (error) {
                    console.log(error);
                }                                               
            }
        });     
        
        documento.text(materiaName, x + 20, y);
        if(row.NOTA >= 4) { 
            cantAprobadas++;
            acuAprobadas+=parseInt(row.NOTA);
        } else {
            cantReprobadas++;
            acuReprobadas+=parseInt(row.NOTA);
        }
        y+=15;
    });
    //Totales
    y+=12;
    documento.moveTo(x, y)
        .lineTo(560.28,y)
        .stroke();
    y+=10;
    documento.text('Total de materias aprobadas: ' + cantAprobadas, x, y);
    x+=262.64;
    let promedioConAplazos = ((acuAprobadas + acuReprobadas) / (cantAprobadas + cantReprobadas)).toFixed(2);
    documento.text('Promedio con aplazos: ' + promedioConAplazos, x, y);
    x=35;
    y+=15;
    documento.text('Cantidad de aplazos: ' + cantReprobadas, x, y);
    x+=262.64;
    documento.text('Promedio sin aplazos: ' + (acuAprobadas/cantAprobadas).toFixed(2), x, y);
    x=35;
    y+=15;
    documento.text('Total de créditos: ', x, y);
    
}