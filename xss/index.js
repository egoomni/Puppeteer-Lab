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

  for (vector of vectors) {

    await page.focus("input");
    await page.keyboard.type(vector);
    await page.keyboard.press("Enter");

    const success = await page.evaluate(() => xss_injection_success);
    vector = [vector, success];
    console.log(vector);

    await page.reload();

  }

  fs.writeFileSync("result.json", JSON.stringify(vectors, null, 2));

  process.exit();

})();
