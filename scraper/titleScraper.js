const request = require("request-promise");
const cheerio = require("cheerio");
const totalPagesScraper = require('./utils/shared');
const errorHandler = require("./errorHandler");
var _ = require("lodash");

const baseUrl = "https://www.kimovil.com";
const startUrl = "https://www.kimovil.com/en/compare-smartphones/page.1?xhr=1";

// only occures ones
async function scrape() {
  console.log("scrape()");
  try {
    const finalLinksArr = await totalPagesScraper.scrapePaginationLinks(startUrl);

    const htmlResult = await request.get(innerFirstUrl);
    const $ = await cheerio.load(htmlResult);

    // targeting specific block
    const deviceProfile = $("#device-profile");

    // removing non relevant elements
    $(".commonly-compared").remove();
    $("#cards-wrapp_deviceprofile-top").remove();
    $(".user-opinion-questions").remove();

    // all children of the block, aka sections
    let sections = $(deviceProfile).children();
    dt.push("Description (About - About)");

    // Getting data of each section
    $(sections).each((index, element) => {
      const elm = $(element);
      let sectionName;
      if (elm.attr("class").split(" ").length > 0) {
        sectionName = elm.attr("class").split(" ")[1];
      }

      // rows of table of that section
      const tableRows = elm.find(".table").children();
      // inner loop to iterate rows
      $(tableRows).each((index, element) => {
        const rightColumn = $(element)
          .find(".right")
          .first();
        const leftColumn = $(element)
          .find(".left")
          .first(); // sub-title

        // loop dt to extract all titles and format them according to section name
        const dtArr = rightColumn.find("dt");
        dtArr.remove(".br");
        $(dtArr).each((index, element) => {
          dt.push(
            $(element)
              .text()
              .replace(/[\n\r]/g, "") +
              " (" +
              sectionName +
              " - " +
              leftColumn.text().replace(/[\n\r]/g, "") +
              ")"
          );
        });
      });
    });
  } catch (err) {
    errorHandler.handle();
  }
}


async function scrapeTitlesContent() {
    console.log("scrapeTitlesContent()");
    const scrapedTitles = [];
    // const titles = bindHeadersWithContent(dt);
    // finalScrapeData.push(titles);
    for (let i = 0; i < finalLinksArr.length; i++) {
      const _dd = await scrapeValues(finalLinksArr[i]);
      // const data = bindHeadersWithContent(_dd);
      // if(_dd.length > 72)
          finalScrapeData.push(_dd);
    }
    return finalScrapeData;
  }
