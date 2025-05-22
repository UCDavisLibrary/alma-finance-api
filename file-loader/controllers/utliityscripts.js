const fs = require('fs');
const { logMessage } = require('../util/logger');

moveToArchive = (invoicearray) => {
    invoicearray.forEach(invoice => {
        var oldPath = '/app/xml/' + invoice + '.xml'
        var newPath = '/app/xml/archive/' + invoice + '.xml'

        fs.rename(oldPath, newPath, function (err) {
        if (err) throw err
        logMessage('INFO','Successfully moved to archive!')
        })
    });

}