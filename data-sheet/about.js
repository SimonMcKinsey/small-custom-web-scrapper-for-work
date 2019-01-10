const $ = require("cheerio");
const tblEnum = require("../helpers/tableEnum.js");
const aboutTable = tblEnum.TableEnum.about;
let html;
// let table;
let dd;

function dissolveTable() {
  table = $(".table", html)[aboutTable];
  //   const rows = table.children;
  //   let stringBuilder;
  //   for (let i = 0; i < rows.length; i++) {
  //     const row = rows[i];
  //     // const leftCell = $(".left", row);
  //     const rightCell = $(".right", row);
  //     const dd = $("dd", rightCell);
  //     for (let i = 0; i < dd.length; i++) {
  //       if (dd.length - 1 !== i) {
  //         stringBuilder += dd[i].text() + " - ";
  //       }
  //     }
  //   }
  //   console.log("stringBuilder: ", stringBuilder);
  //   return stringBuilder;
}

function Description() {
  const description = $(".mini-info", html);
  return description.text();
}

function Brand() {
  const brand = dd
    .toArray()[0]
    .firstChild.data.replace(/[\n\r]/g, "")
    .trim();

  const alias = dd
    .toArray()[1]
    .firstChild.data.replace(/[\n\r]/g, "")
    .trim();
  const str = `${brand} (${alias})`;
  return str;
}

function Presentation() {
  const presentation = dd
    .toArray()[2]
    .firstChild.data.replace(/[\n\r,]/g, "")
    .trim();

  //   const state = dd
  //     .toArray()[3]
  //     .firstChild.data.replace(/[\n\r]/g, "")
  //     .trim();
  return presentation;
}

function Related() {
  const related = $(".table > .row > .right > dl > dd > ul > li > a", html)
    .toArray()[0]
    .firstChild.next.next.data.replace(/[\n\r,]/g, "");
  return related;
}

function Builder(htmlContent) {
  html = htmlContent;
  dd = $(".table > .row > .right > dl > dd", html);
  const description = Description();
  const brand = Brand();
  const presentation = Presentation();
  const related = Related();

  return {
      description,
      brand,
      presentation,
      related
  };
}

module.exports = {
  Builder
};
