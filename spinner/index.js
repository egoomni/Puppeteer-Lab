const fs = require('fs');
const puppeteer = require('puppeteer');

// https://articlerewritertool.com/
// But I have to solve a math question...
//  Try https://github.com/finnfiddle/words-to-numbers
//  and https://github.com/josdejong/mathjs

const tests = ["five - five =", "eight minus five =", "five minus ten =", "seven plus 3 =", "7 plus 5 =", "one minus one ="];

// helper functions

const solve_math_question(text) {
  let tokens = text.split(" ");
  tokens.map(token => {
    token.replace(/minus/g, "-");
    token.replace(/plus/g, "+");
    token = token; // convert to num
  });
  return 0; // math.solve(tokens.join(" "))

}
