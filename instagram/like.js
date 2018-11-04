const puppeteer = require('puppeteer');

module.exports["like"] = async (page, post_id) => {

  const whereto = `https://www.instagram.com/p/${post_id}/`;

  console.log(`Page going to ${whereto}`);
  await page.goto(whereto);

  try {await page.click(".coreSpriteHeartOpen");}
  catch (err) {console.log("Unable to toggle the like button");}

  console.log("Successfully toggled the like button");
  return page;

};
