const errorHandler = require('./errorHandler');
const ObjectsToCsv = require("objects-to-csv");

export async function createCsvFile(data) {
    console.log("createCsvFile(data)");
    try {
      let csv = new ObjectsToCsv(data);
  
      // Save to file:
      await csv.toDisk("./test5.csv");
    } catch (err) {
        errorHandler.handle(err);
    }
  }