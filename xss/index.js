const fs = require('fs');
const puppeteer = require('puppeteer');
const vectors_path = "vectors.txt";

const vectors = fs.readFileSync(vectors_path, "utf8").split("\n").slice(0, 100);
const whereto = `${__dirname}/index.html`;

(async () => {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  console.log(`Page going to ${whereto}`);
  await page.goto(whereto);
  await page.screenshot({path: "test.png"});

  process.exit();

})();
