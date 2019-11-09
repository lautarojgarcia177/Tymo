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
            margin: 30
        }).font('Helvetica-Bold');

        //First page header

        doc.image('back/reportes/assets/logo-unc.jpg', 30, 30, {
            width: 100
        });
        doc.text('UNIVERSIDAD NACIONAL DE CÓRDOBA', 30, 90,{align: 'left'});
        doc.text('FACULTAD DE FILOSOFÍA Y HUMANIDADES', 30, 105, {align: 'left'});

        doc.fontSize(15);
        doc.text('CERTIFICADO ANALÍTICO', 0, 150, {
            align: 'center',
            underline: 'true'
        });
        doc.text('Licenciatura en Historia - PLAN 1994', 0, 170, {
                align: 'center'
            });

        doc.text('Titulo: ')

        //doc.pipe(fs.createWriteStream('./back/reportes/output.pdf'));
        doc.pipe(res);

// Embed a font, set the font size, and render some text
        doc.text('Examenes', 300, 300);
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

