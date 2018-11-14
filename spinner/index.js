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
const try_again_thresh = 4 * 1000;

const prog_path = "recent_spin_progress.json";

const corpus_path = process.argv[2];

const paragraphs = (fs.existsSync(prog_path)) ?
  JSON.parse(fs.readFileSync(prog_path)) :
  fs.readFileSync(corpus_path, "utf8")
    .split("\n")
    .filter(p => p.length)
    .map(p => {
      return {content: p, spun: ""};
    });

const total = paragraphs.length;
let counter = 0;

(async () => {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  console.log(`Page going to ${whereto}`);
  await page.goto(whereto);

  for (let paragraph of paragraphs) {

    console.log(`--- ${Math.floor(100 * counter / total)}%  |  ${counter}/${total} ---`);

    let {content} = paragraph;

    if (paragraph.spun.length || content.length < 50) {
      counter++;
      continue;
    } else if (content.length < 50) {
      paragraph.spun = content;
      counter++;
      continue;
    }

    while (true) {

      await page.evaluate(p => {
        document.querySelector("textarea[name='formNameLabelTextBefore']").value = p
      }, content);

      const expression = await page.$eval("#math_captcha_equation", input => input.value);
      const ans = String(solve_math_question(expression));
      await page.evaluate(a => {
        document.querySelector("input[name='math_captcha_answer']").value = a
      }, ans);

      try {

        await page.click("input[value='Rewrite Text']");
        await page.waitForNavigation({waitUntil: "load", timeout: try_again_thresh});

        const spun_paragraph = await page.$eval("textarea[name='formNameLabelTextAfter']", textarea => textarea.value);
        console.log(`${content.slice(0, 15)} spun to ${spun_paragraph.slice(0, 15)}`);
        paragraph.spun = spun_paragraph;

        fs.writeFileSync(prog_path, JSON.stringify(paragraphs, null, 2));

      } catch (err) {

        console.log("Trying that again. Oops.");
        continue;

      }

      break;

    }

    counter++;

  }

  const result = JSON.parse(fs.readFileSync(prog_path)).map(p => p.spun.length ? p.spun : p.content).join("\n");

  const save_path = "recent_spin.txt";
  fs.writeFileSync(save_path, result);
  console.log(`Saved spun article as ${save_path}`);

})();
