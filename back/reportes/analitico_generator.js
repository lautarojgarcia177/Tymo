var exports = module.exports = {};

const PDFDocument = require('pdfkit');
const fs = require('fs');

const stream = require('stream');

const numberConverter = require('../conversor_numeros_a_letras');

exports.generarPDFAnalitico = function(rows, observaciones, res, callback) {
    try {
        var datos = rows[0];
        // Get date for Footer
        var today = getTodaysDate();
        var pageCount = 0;

        // Create a document
        var doc = new PDFDocument({
            info: {
                Title: 'Certificado analitico',
                Subject: 'Certificado analitico',
            },
            autoFirstPage: false
        });

        doc.on('pageAdded', () => {
            pageCount++;
            generarParteDeArribaDeTodasLasHojas(doc,datos);
            generarFooter(doc, today, pageCount);
        });

        doc.addPage({
            margin: 30
        }).font('Helvetica-Bold');

        //variable que tiene la altura a partir de la cual empieza el contenido de la página
        doc.font('Helvetica');
        let yStart = 310;
        let xStart = 30;

        // Observations
        var obs = String(observaciones);
        doc.moveDown()
            .fontSize(10)
            .text('OBSERVACIONES: ', xStart, yStart)
            .text(obs, xStart + 20, yStart + 20);
            

        //Penultimo texto
        var penultimateTxt = 'Se extiende el presente certificado a efectos de ser presentado ante las autoridades que correspondan.';
        var cantRenglonesPenultimateTxt = Math.ceil(obs.length / 95);
        var yposPenultimateText = yStart + 20 + 18 + (cantRenglonesPenultimateTxt * 12) ;
        doc.text(penultimateTxt, xStart, yposPenultimateText);

        //Ultimo texto
        var lastTxt = 'CÓRDOBA, Rep. Argentina, ' + getTodaysDateEnTexto();
        doc.fontSize(12);
        doc.text(lastTxt, xStart, yposPenultimateText + 15);
        
        // -------------------------------------------------------------------------------------------------------------------------------------------
        //Create actual PDF which will be send

        // Get date for Footer
        var today2 = getTodaysDate();
        var pageCount2 = 0;

        // Create a document
        var doc2 = new PDFDocument({
            info: {
                Title: 'Certificado analitico',
                Subject: 'Certificado analitico',
            },
            autoFirstPage: false
        });

        doc2.on('pageAdded', () => {
            pageCount2++;
            generarParteDeArribaDeTodasLasHojas(doc2,datos);
            generarFooter2(doc2, today, pageCount2, pageCount);
        });

        doc2.addPage({
            margin: 30
        }).font('Helvetica-Bold');

        //variable que tiene la altura a partir de la cual empieza el contenido de la página
        doc2.font('Helvetica');
        let yStart2 = 295;
        let xStart2 = 30;

        //tabla con examenes
        generarTablaExamenes(rows, xStart2, yStart2, doc2);

/*         // Observations
        var obs = String(observaciones);
        doc2.moveDown()
            .fontSize(10)
            .text('OBSERVACIONES: ', xStart2, yStart2)
            .text(obs, xStart2 + 20, yStart2 + 20);
            

        //Penultimo texto
        var penultimateTxt = 'Se extiende el presente certificado a efectos de ser presentado ante las autoridades que correspondan.';
        var cantRenglonesPenultimateTxt = Math.ceil(obs.length / 95);
        var yposPenultimateText = yStart2 + 20 + 18 + (cantRenglonesPenultimateTxt * 12) ;
        doc2.text(penultimateTxt, xStart2, yposPenultimateText);

        //Ultimo texto
        var lastTxt = 'CÓRDOBA, Rep. Argentina, ' + getTodaysDateEnTexto();
        doc2.fontSize(12);
        doc2.text(lastTxt, xStart2, yposPenultimateText + 15); */

        // HTTP RES
        doc2.pipe(res);
        doc2.end();
            
        let filename = 'Analítico ' + datos.NOMBRE +'.pdf';
        res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
        res.setHeader('Content-type', 'application/pdf');

        callback(null);
    } catch(err) {
        callback(err);
    }
};

function generarParteDeArribaDeTodasLasHojas(doc, datos) {
    doc.image('back/reportes/assets/logo-unc.jpg', 30, 30, {
        width: 100
    });
    doc.text('UNIVERSIDAD NACIONAL DE CÓRDOBA', 30, 90,{align: 'left'});
    doc.text('FACULTAD DE FILOSOFÍA Y HUMANIDADES', 30, 105, {align: 'left'});

    doc.fontSize(15);
    doc.text('ANALÍTICO', 0, 150, {
        align: 'center',
        underline: 'true'
    }).fontSize(13);

    doc.text('Carrera: ' + sanitizarDato(datos.NOMBRE_CARRERA) + ' - PLAN ' + sanitizarNroPlan(datos.PLAN), 30, 185);    
    doc.text('Título: ' + sanitizarDato(datos.NUMERO_CARRERA) + ' ' + sanitizarDatoTitulo(datos), 30, 205);

    doc.fontSize(12).font('Helvetica');
    var texto = 'La Universidad Nacional de Córdoba - Facultad de Filosofía y Humanidades certifica que ' +
        datos.NOMBRE + ', Legajo N° ' + datos.NRO_ALUM + ', ' + datos.TIP_DOC + ' ' + datos.NUM_DOC + 
        ', quien ingresó el día <completar!!!!>' + ', registra la siguiente historia académica en la carrera' +
        ' de ' + sanitizarDato(datos.NOMBRE_CARRERA) + ', dictada en Facultad de Filosofía y Humanidades.';
    doc.text(texto, 30, 240, {align: 'justify'});
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

function generarTablaExamenes(data, x, y, documento) {
    //Linea de arriba
    documento.moveTo(x, y)
            .lineTo(582, y)
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
    documento.moveTo(x, y)
            .lineTo(582,y)
            .stroke();
    //Llenar la info de la tabla
    data.forEach( (row) => {
        y+=15;
        documento.text(row.MATERIA, x + 20, y);
    });
    //Lineas de tabla de la tabla
    for(i = 0; i<= data.length; i++) {    
        y2+=15;
        documento.moveTo(x, y2)
            .lineTo(582,y2)
            .stroke();
    }
}