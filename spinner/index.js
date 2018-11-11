const fs = require('fs');
const rl = require('readline-sync');
const math = require('mathjs');
const {wordsToNumbers} = require('words-to-numbers');
const puppeteer = require('puppeteer');

const solve_math_question = (text) => {
  const tokens = text.split(" ").map(token => {
    if (token == "minus") return "-";
    else if (token == "plus") return "+";
    else return wordsToNumbers(token);
  });
  const expression = tokens.join(" ");
  return math.parse(expression).eval();
};

const whereto = "https://articlerewritertool.com/";
const paragraphs = fs.readFileSync(rl.question("Where is your text file?\n> "), "utf8").split("\n");
let result = "";

(async () => {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  console.log(`Page going to ${whereto}`);
  await page.goto(whereto);

  for (let paragraph of paragraphs) {

    console.log(paragraph);

    await page.focus("textarea[name='formNameLabelTextBefore']");
    await page.keyboard.type(paragraph);

    let ans = await page.$eval("#math_captcha_equation", input => input.value);
    ans = String(solve_math_question(ans));
    await page.focus("textarea[name='formNameLabelTextBefore']");
    await page.keyboard.type(ans);

    await page.click("input[value='Rewrite Text']");
    result += await page.$eval("textarea[name='formNameLabelTextAfter']", textarea => textarea.value);
    result += "\n";

  }

  fs.writeFileSync("spinned.txt", result);
  console.log("saved");

})();
