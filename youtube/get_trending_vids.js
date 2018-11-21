const fs = require('fs');
const rl = require('readline-sync');
const sanitize = require('sanitize-filename');
const puppeteer = require('puppeteer');
const yt = require('./yt.js');
const JSONDB = require('node-json-db');

const save_path = `trending_${yt.get_iso_date()}`;
const db = new JSONDB(save_path, true, true);

(async () => {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const trending = (await yt.trending(page)).filter(obj => obj.cid);
  db.push("/", trending);
  process.exit();

  let cur = 1;
  for (let vid of trending) {
    let skip_thresh = 5;
    while (true) {
      try {
        console.log(`${(100 * cur / trending.length).toFixed(2)}%   |   ${cur}/${trending.length}`)
        const summary = await yt.summarize(page, vid);
        if (summary.transcript.length)
          db.push(`/${vid}`, summary);
        cur++;
        break;
      } catch (err) {
        skip_thresh--;
        if (skip_thresh <= 0) break;
      }
    }
  }

  process.exit();

})();
