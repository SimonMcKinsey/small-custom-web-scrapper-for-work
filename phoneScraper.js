const request = require('request-promise');
const cheerio = require('cheerio');

const url = "https://www.kimovil.com/en/where-to-buy-oneplus-6t-8gb-128gb";

const scrapeResults = [];
let dt = []; // holds all title of features

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

                // loop dt to extract all titles and format them according to section name
                const dtArr = rightColumn.find("dt");
                dt.push('Description (About)');
                $(dtArr).each((index, element) => {
                    dt.push($(element).text().replace(/[\n\r]/g, "") + ' (' + sectionName + ')')
                });
            });


        });
        
        dt = new Set(dt);
    } catch (err) {
        console.log(err);
    }
}

async function scrapeValues() {
    try {
        let dd = [];
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

        // Getting data of each section
        $(sections).each((index, element) => {
            const elm = $(element);

            // only element which is outside a table
            const description = elm.find('.mini-info').text();

            const tableRows = elm.find('.table').children();

            // inner loop to iterate rows
            $(tableRows).each((index, element) => {
                const rightColumn = $(element).find(".right").first();

                // extra inner loops to iterate dl which should be equal in size
                const ddArr = rightColumn.children().find("dd");
                dd.push(description);
                $(ddArr).each((index, element) => {
                    dd.push($(element).text().replace(/[\n\r]/g, "").trim())
                });
            });
        });
        dd = new Set(dd);
        return dd;
    } catch (err) {
        console.log(err);
    }
}

// scrapeSections();
scrapeValues();