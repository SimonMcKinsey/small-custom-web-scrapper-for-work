const download = require('./downloadCSV.js');

const { convertArrayToCSV } = require('convert-array-to-csv');
const converter = require('convert-array-to-csv');

const header = ['left', 'right'];

class CSV {
    constructor(data) {
        const joinArrs = [];
        for (let i = 0; i < data['left'][i].length; i++) {
            const leftItem = data['left'][i];
            const rightItem = data['right'][i];
            joinArrs.push([leftItem, rightItem]);
        }

        convertArrayToCSV(joinArrs, {
            header,
            separator: ';'
        });

        download.downloadCSV(joinArrs);
    }
}

module.exports = CSV;


