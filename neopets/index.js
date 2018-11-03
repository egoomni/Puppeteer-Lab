require('dotenv').load();
const puppeteer = require('puppeteer');

const {neopets_login} = require('./login.js');

const {fruit_machine} = require('./fruit_machine.js');
const {tombola} = require('./tombola.js');
const {lab} = require('./lab.js');
const {fishing} = require('./fishing.js');
const {tdmbgpop} = require('./tdmbgpop.js');

const neopet_functions = [fruit_machine, tombola, lab, fishing, tdmbgpop];

(async () => {

  console.log("Launching Headless Chrome");
  const browser = await neopets_login(
    process.env.NEOPETS_USERNAME,
    process.env.NEOPETS_PASSWORD
  );

  console.log("Browser opening new tab");
  const page = await browser.newPage();

  for (let fn of neopet_functions) {
    await fn(page);
  }

  console.log("hi from main");


  await browser.close();

})();
