const $ = require("cheerio");
// const tblEnum = require("../helpers/tableEnum.js");
// const aboutTable = tblEnum.TableEnum.about;
let html;
// let table;
let h3, h4, dl, dd, dt;

function dissolveTable() {
    //   table = $(".table", html)[aboutTable];
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

// function Description() {
//   const description = $(".mini-info", html);
//   return description.text();
// }

// function Brand() {
//   const brand = dd
//     .toArray()[0]
//     .firstChild.data.replace(/[\n\r]/g, "")
//     .trim();

//   const alias = dd
//     .toArray()[1]
//     .firstChild.data.replace(/[\n\r]/g, "")
//     .trim();
//   const str = `${brand} (${alias})`;
//   return str;
// }

// function Presentation() {
//   const presentation = dd
//     .toArray()[2]
//     .firstChild.data.replace(/[\n\r,]/g, "")
//     .trim();

//   //   const state = dd
//   //     .toArray()[3]
//   //     .firstChild.data.replace(/[\n\r]/g, "")
//   //     .trim();
//   return presentation;
// }

// function Related() {
//   const related = $(".table > .row > .right > dl > dd > ul > li > a", html)
//     .toArray()[0]
//     .firstChild.next.next.data.replace(/[\n\r,]/g, "");
//   return related;
// }

function Builder(htmlContent) {
    //   const notesFromUsers = [19, 20, 21, 22, 23, 48, 49, 50, 72, 73, 74, 75, 98, 99, 100, 105, 107, 108];
    html = htmlContent;
    //   h3 =  $(".h3 .blue", html); // group title
    //   h4 =  $(".h4", html); // sub group title
    //   dl = $(".table > .row > .right > dl", html); // group content
    dt = $(".table > .row > .right > dl > dt", html); // left sub group contnet
    dd = $(".table > .row > .right > dl > dd", html); // right sub group contnet
    const left = [];
    const right = [];

    for (let i = 0; i < dt.length; i++) {
        if (dt[i] && dt[i].firstChild && dt[i].firstChild.data && typeof dt[i].firstChild.data === "string") {
                const item = dt[i].firstChild.data.replace(/[\n\r]/g, "").trim();
                left.push(item);
        }
    }

    for (let i = 0; i < dd.length; i++) {
        if (dd[i] && dd[i].firstChild && dd[i].firstChild.data && typeof dd[i].firstChild.data === "string") {
            // const item = dd[i].firstChild.data.replace(/[\n\r,]/g, "").trim();
            let item = dd[i].firstChild.data.trim().toString().replace(/[\n\r]/g, "");
            if (dd[i].firstChild.next && dd[i].firstChild.next.firstChild) {
                if (typeof dd[i].firstChild.next.firstChild.data !== 'undefined') {
                    item += dd[i].firstChild.next.firstChild.data.trim().toString().replace(/[\n\r]/g, "");
                }
            }
            right.push(item);
        }
    }

    let data = { left, right };
    return data;
}

module.exports = {
    Builder
};
