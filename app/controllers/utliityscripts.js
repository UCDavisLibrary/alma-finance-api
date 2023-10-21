const fs = require('fs');

moveToArchive = (invoicearray) => {
    invoicearray.forEach(invoice => {
        var oldPath = '/app/xml/' + invoice + '.xml'
        var newPath = '/app/xml/archive/' + invoice + '.xml'

        fs.rename(oldPath, newPath, function (err) {
        if (err) throw err
        console.log('Successfully moved to archive!')
        })
    });

}