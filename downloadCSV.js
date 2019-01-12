const createCsvWriter = require('csv-writer').createArrayCsvWriter;
const csvWriter = createCsvWriter({
    header: ['LEFT', 'RIGHT'],
    path: 'path/phones.csv'
});

function downloadCSV(records) {

    csvWriter.writeRecords(records)       // returns a promise
        .then(() => {
            console.log('...Done');
        });

}

module.exports = {
    downloadCSV
};