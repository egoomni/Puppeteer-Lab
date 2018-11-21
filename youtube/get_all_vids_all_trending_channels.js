const fs = require('fs');
const rl = require('readline-sync');
const puppeteer = require('puppeteer');
const yt = require('./yt.js');
const JSONDB = require('node-json-db');

const channel_id = "UC3XTzVzaHQEd30rQbuvCtTQ";
const save_path = `dump/${channel_id}`;
const db = new JSONDB(save_path, true, false);

(async () => {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const trending = [...(await yt.trending(page)).reduce((acc, cur) => {
    if (cur.cid) acc.add(cur.cid);
    return acc;
  }, new Set())];
  
  console.log(trending);
  //
  // while (true) {
  //
  //   try {
  //
  //     const channel_data = await yt.channel(page, channel_id);
  //     db.push("/", channel_data);
  //     break;
  //
  //   } catch (err) {
  //
  //     console.log(err.toString());
  //
  //   }
  //
  // }

  process.exit();

})();
