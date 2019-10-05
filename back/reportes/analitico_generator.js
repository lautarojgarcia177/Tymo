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
                Subject: 'Certificado analitico'
            }
        });

        //doc.pipe(fs.createWriteStream('./back/reportes/output.pdf'));
        doc.pipe(res);

// Embed a font, set the font size, and render some text
        doc.text('Examenes', 100, 100);
        datos.forEach((examen) => {
           doc.text(JSON.stringify(examen));
        });
// Add another page
        doc.addPage()
            .fontSize(25)
            .text('Here is some vector graphics...', 100, 100);

// Draw a triangle
        doc.save()
            .moveTo(100, 150)
            .lineTo(100, 250)
            .lineTo(200, 250)
            .fill("#FF3300");

// Apply some transforms and render an SVG path with the 'even-odd' fill rule
        doc.scale(0.6)
            .translate(470, -380)
            .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
            .fill('red', 'even-odd')
            .restore();

// Add some text with annotations
        doc.addPage()
            .fillColor("blue")
            .text('Here is a link!', 100, 100)
            .underline(100, 100, 160, 27, {color: "#0000FF"})
            .link(100, 100, 160, 27, 'http://google.com/');

            
        let filename = 'analitico.pdf';
        doc.end(); 
        res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
        res.setHeader('Content-type', 'application/pdf');

        callback(null);
    } catch(err) {
        callback(err);
    }
};

