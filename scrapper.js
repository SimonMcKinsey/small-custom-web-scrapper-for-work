const rp = require('request-promise');
const $ = require('cheerio');
const baseUrl = 'https://www.kimovil.com';
const startUrl = 'https://www.kimovil.com/en/compare-smartphones/page.1?xhr=1';

// Handlers
const About = require('./data-sheet/about.js');

// Variables - 
let htmlPageAccumulator;
let finalLinksArr = [];
let itemCount = 20;


class Scrapper {

  constructor() {
    this.pageCounter = 0;
  }

  async pollData(url) {
    try {
      let { content, next_page_url } = JSON.parse(await rp(url));
      htmlPageAccumulator += content;
      this.pageCounter += 1;
      
      if (next_page_url && next_page_url.length > 0 && this.pageCounter < 2) {
        await this.pollData(baseUrl + next_page_url + '?xhr=1');
      }

    } catch (e) {
      console.log('ERROR: ', e);
    }
  }

  async targetElements(html) {
    for(let i = 0; i < this.pageCounter * itemCount; i++) {
      const dataSlagAttr = $('.trigger-compare', html)[i].attribs['data-slug'];
      finalLinksArr.push(`https://www.kimovil.com/en/where-to-buy-${dataSlagAttr}`);
    }

    for(let i = 0; i < this.pageCounter * itemCount; i++) {
      await this.pollItems(finalLinksArr[i]);
    }
  }

  async pollItems(url) {
    try {
      let htmlContent = await rp(url);
      const info = $('.mini-info', htmlContent);

    } catch (e) {
      console.log("pollItems Error: ", e)
    }
  }
}

const scrapper = new Scrapper();
scrapper.pollData(startUrl)
  .then(() => {
    scrapper.targetElements(htmlPageAccumulator);
  });