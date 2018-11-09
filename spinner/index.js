const fs = require('fs');
const math = require('mathjs');
const {wordsToNumbers} = require('words-to-numbers');
const puppeteer = require('puppeteer');

// https://articlerewritertool.com/

// HELPERS
const solve_math_question = (text) => {
  const tokens = text.split(" ").map(token => {
    if (token == "minus") return "-";
    else if (token == "plus") return "+";
    else return wordsToNumbers(token);
  });
  const expression = tokens.slice(0, tokens.length - 1).join(" ");
  return math.parse(expression).eval();
};
