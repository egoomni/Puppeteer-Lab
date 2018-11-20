const fs = require('fs');
const rl = require('readline-sync');
const sanitize = require('sanitize-filename');
const puppeteer = require('puppeteer');
const yt = require('./yt.js');

(async () => {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await yt.summarize(page, "cfbacRyEVTM");

  process.exit();

})();
