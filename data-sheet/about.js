const $ = require("cheerio");
const tblEnum = require("../helpers/tableEnum.js");
const aboutTable = tblEnum.TableEnum.about;
let html;
// let table;
let aboutVar;

function Description() {
  const description = $(".mini-info", aboutVar);
  return description.text();
}

function Builder(htmlContent) {
  html = htmlContent;
  aboutVar = $("#about > .table > .row > .right > dl > dd", html).children();
  var a = " ";
  for (let i = 0; i < aboutVar.length; i++) {
    a += extractData(aboutVar);
  }
  console.log(a);

  console.log(aboutVar);
  // const description = Description();

  return {};
}

function extractData(aV) {
  if (aV && aV.firstChild) {
    var fC = aV.firstChild;
    if (fC.data && typeof fC.data === "string") {
      return aV.firstChild.data;
    } else {
      extractData(aV.firstChild);
    }
  }
}

module.exports = {
  Builder
};
