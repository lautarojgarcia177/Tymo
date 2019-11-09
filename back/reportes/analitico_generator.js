var exports = module.exports = {};

const PDFDocument = require('pdfkit');
const fs = require('fs');

const stream = require('stream');

exports.generarPDFAnalitico = function(datos, res, callback) {
    try {
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

        //doc.pipe(fs.createWriteStream('./back/reportes/output.pdf'));
        doc.pipe(res);

            
        let filename = 'analitico.pdf';
        doc.end(); 
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
    doc.text('CERTIFICADO ANALÍTICO', 0, 150, {
        align: 'center',
        underline: 'true'
    }).fontSize(13);
    doc.text(datos.NOMBRE_CARRERA + ' - PLAN 1993', 0, 170, {
            align: 'center'
        });

    doc.text('Titulo: ' + datos.NUMERO_CARRERA + ' ' + datos.TITULO_CARRERA, 30, 195);

    doc.fontSize(12).font('Helvetica');
    var texto = 'El que suscribe Facultad de Filosofía y Humanidades, certifica que en libros de actas del Departamento respectivo' +
        ' consta que el alumno número ' + datos.NRO_ALUM + ' ' + datos.TIP_DOC + ' ' + datos.NUM_DOC + ', ' +
        datos.NOMBRE + ' con fecha de ingreso a la carrera ' + '' + ', cuenta con la actuación académica que a continuación se indica.';
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