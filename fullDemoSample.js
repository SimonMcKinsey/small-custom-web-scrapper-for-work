const request = require('requestretry').defaults({fullResponse: false});
const cheerio = require('cheerio');
const ObjectsToCsv = require('objects-to-csv');

const url = "https://sfbay.craigslist.org/d/software-qa-dba-etc/search/sof";

const scrapeSample = {
    title: 'title',
    description: 'description',
    datePosted: new Date('2018-07-13'),
    url: 'https://',
    hood: 'hood',
    address: 'address',
    compensation: '23/hr'
};

const scrapeResults = [];

async function scrapeJobHeader() {
    try {
        const htmlResult = await request.get(url);
        const $ = await cheerio.load(htmlResult);

        $(".result-info").each((index, element) => {
            const resultTitle = $(element).children(".result-title");
            const title = resultTitle.text();
            const url = resultTitle.attr("href");
            const datePosted = new Date(
                $(element)
                    .children("time")
                    .attr("datetime")
            );
            const hood = $(element).find(".result-hood").text();
            scrapeResult = { title, url, datePosted, hood };
            scrapeResults.push(scrapeResult);
        });
        return scrapeResults;
    } catch (err) {
        console.log(err);
    }
}

async function scrapeDescription(jobsWithHeaders) {
    let counter = 0;
    return await Promise.all(jobsWithHeaders.map(async (job) => {
        try {
            const htmlResult = await request.get(job.url);
            const $ = await cheerio.load(htmlResult);
            $(".print-qrcode-container").remove();
            job.description = $("#postingbody").text();
            job.address = $("div.mapaddress").text();
            const compensationText = $(".attrgroup").children().first().text();
            job.compensation = compensationText.replace("compensation: ", "");
            console.log(job);
            return job;
        } catch(err) {
            console.log(err);
        }
    }))
}

async function createCsvFile(data) {
    try {
        let csv = new ObjectsToCsv(data);
        
        // Save to file:
        await csv.toDisk('./test.csv');
    } catch(err) {
        console.log(err);
    }
}

async function scrapeCraigslist() {
    const jobsdWithHeaders = await scrapeJobHeader();
    const jobsFullData = await scrapeDescription(jobsdWithHeaders);
    await createCsvFile(jobsFullData);
}

scrapeCraigslist();