const request = require('request-promise');
const cheerio = require('cheerio');
const ObjectsToCsv = require('objects-to-csv');

const url = "https://www.kimovil.com/en/where-to-buy-oneplus-6t-8gb-128gb";

const scrapeResults = [];
let dt = []; // holds all title of features
let dd = [];// holds all content of features

// only happens ones
async function scrapeTitles() {
    try {
        const htmlResult = await request.get(url);
        const $ = await cheerio.load(htmlResult);

        // targeting specific block
        const deviceProfile = $('#device-profile');

        // removing non relevant elements
        $('.commonly-compared').remove();
        $('#cards-wrapp_deviceprofile-top').remove();
        $('.user-opinion-questions').remove();
        

        // all children of the block, aka sections
        let sections = $(deviceProfile).children();
        dt.push('Description (About - About)');

        // Getting data of each section
        $(sections).each((index, element) => {
            const elm = $(element);
            let sectionName = elm.attr('class').split(' ')[1];
            sectionName = sectionName[0].toUpperCase() + sectionName.slice(1);
            
            
            // rows of table of that section
            const tableRows = elm.find('.table').children();
            // inner loop to iterate rows
            $(tableRows).each((index, element) => {
                const rightColumn = $(element).find(".right").first();
                const leftColumn = $(element).find(".left").first(); // sub-title
                
                // loop dt to extract all titles and format them according to section name
                const dtArr = rightColumn.find("dt");
                dtArr.remove('.br');
                $(dtArr).each((index, element) => {
                    dt.push($(element).text().replace(/[\n\r]/g, "") + ' (' + sectionName + ' - ' + leftColumn.text().replace(/[\n\r]/g, "") + ')')
                });
            });
        });
        
    } catch (err) {
        console.log(err);
    }
}

async function scrapeValues() {
    try {
        const htmlResult = await request.get(url);
        const $ = await cheerio.load(htmlResult);

        // targeting specific block
        const deviceProfile = $('#device-profile');

        // removing non relevant elements
        $('.commonly-compared').remove();
        $('#cards-wrapp_deviceprofile-top').remove();
        $('.user-opinion-questions').remove();
        
        
        // all children of the block, aka sections
        let sections = $(deviceProfile).children();

        // only element which is outside a table
        const description = sections.find('.mini-info').text();
        dd.push(description);

        // Getting data of each section
        $(sections).each((index, element) => {
            const elm = $(element);


            const tableRows = elm.find('.table').children();

            // inner loop to iterate rows
            $(tableRows).each((index, element) => {
                const rightColumn = $(element).find(".right").first();

                // extra inner loops to iterate dl which should be equal in size
                const ddArr = rightColumn.children().find("dd");
                $(ddArr).each((index, element) => {
                    // const title = dt[index];
                    // const content = $(element).text().replace(/[\n\r]/g, "").trim();
                    // scrapeResults.push({ title, content });
                    dd.push($(element).text().replace(/[\n\r]/g, "").trim())
                });
            });
        });
        return dd;
    } catch (err) {
        console.log(err);
    }
}


async function createCsvFile(data) {
    try {
        let csv = new ObjectsToCsv(data);
        
        // Save to file:
        await csv.toDisk('./test2.csv');

    } catch(err) {
        console.log(err);
    }
}

async function scrapeTest() {
    await scrapeTitles();
    await scrapeValues();
    const data = bindHeadersWithContent();
    scrapeResults.push(data);
    await createCsvFile(scrapeResults);
}

function bindHeadersWithContent() {
    const binder = {};
    for(let i = 0; i < dt.length; i++) {
        const itemTitle = dt[i];
        const itemContent = dd[i];
        binder[itemTitle] = itemContent;
    }
    console.log(binder);
    return binder;
}

// scrapeSections();
scrapeTest();



// scrapeResult = { title, url, datePosted, hood };
// scrapeResults.push(scrapeResult);