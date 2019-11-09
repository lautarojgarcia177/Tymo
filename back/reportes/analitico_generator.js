var exports = module.exports = {};

const PDFDocument = require('pdfkit');
const fs = require('fs');

const stream = require('stream');

exports.generarPDFAnalitico = function(datos, res, callback) {
    try {
        // Create a document
        var doc = new PDFDocument({
            info: {
                Title: 'Certificado analitico',
                Subject: 'Certificado analitico',
            },
            autoFirstPage: false
        });

        doc.addPage({
            margin: 25
        });

        doc.text('UNIVERSIDAD NACIONAL DE CÓRDOBA', {align: 'left'})
            .moveDown().text('FACULTAD DE FILOSOFÍA Y HUMANIDADES', {align: 'left'});


        doc.text('CERTIFICADO ANALÍTICO', {
            align: 'center',
            underline: 'true'
        });
        doc.moveDown();
        doc.text('Licenciatura en Historia - PLAN 1994', {
                align: 'center'
            });

        //doc.pipe(fs.createWriteStream('./back/reportes/output.pdf'));
        doc.pipe(res);

// Embed a font, set the font size, and render some text
        doc.text('Examenes', 100, 100);
        datos.forEach((examen) => {
           doc.text(JSON.stringify(examen));
        });
            
        let filename = 'analitico.pdf';
        doc.end(); 
        res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
        res.setHeader('Content-type', 'application/pdf');

        callback(null);
    } catch(err) {
        callback(err);
    }
};

