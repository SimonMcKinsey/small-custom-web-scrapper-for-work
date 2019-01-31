const request = require("request-promise");
const errorHandler = require("../errorHandler");
const cheerio = require("cheerio");
const baseUrl = "https://www.kimovil.com";
const totalPagesArr = [];
const finalLinksArr = [];
let pageCounter = 0;

// TODO: remove counter when finishing the scraper and making sure that the intersection of titles works.
export async function scrapePaginationLinks(url) {
  console.log("scrapePaginationDepth(url)");
  try {
    let { next_page_url } = JSON.parse(await request(url));
    totalPagesArr.push(baseUrl + next_page_url + "?xhr=1");
    pageCounter += 1;
    if (next_page_url && next_page_url.length > 0 && pageCounter < 10) {
      await scrapePaginationDepth(baseUrl + next_page_url + "?xhr=1");
    }
    const finalLinks = await scrapeMainPhonesPage();
    return finalLinks;
  } catch (err) {
    errorHandler.handle(err);
  }
}

async function scrapeMainPhonesPage() {
  console.log("scrapeMainPhonesPage()");
  try {
    for (let i = 0; i < totalPagesArr.length; i++) {
      const currentPageUrl = totalPagesArr[i];
      const { content } = JSON.parse(await request(currentPageUrl));
      const $ = await cheerio.load(content);
      $(".trigger-compare").each((index, element) => {
        const dataSlagAttr = $(element).attr("data-slug");
        finalLinksArr.push(
          `${baseUrl}/en/where-to-buy-${dataSlagAttr}`
        );
      });
    }
    return finalLinksArr;
  } catch (err) {
    errorHandler.handle(err);
  }
}