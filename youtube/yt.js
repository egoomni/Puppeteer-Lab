const fs = require('fs');
const sanitize = require('sanitize-filename');
const puppeteer = require('puppeteer');

function get_iso_date() {
  const gimme_date = new Date();
  const date_offset = new Date().getTimezoneOffset();
  gimme_date.setMinutes(gimme_date.getMinutes() - date_offset);
  return gimme_date.toISOString().split("T")[0];
}

module.exports["transcribe"] = async (page, vid) => {

  const whereto = `https://www.youtube.com/watch?v=${vid}`;

  console.log(`Page going to ${whereto}`);
  await page.goto(whereto,  {waitUntil: "networkidle0"});

  const title = await page.$eval("#container > h1 > yt-formatted-string", h1 => h1.innerText);

  console.log(`Waiting for ${title}'s transcript to load`)
  await page.click("#button[aria-label='More actions']");
  try {
    await page.click("#items > ytd-menu-service-item-renderer:nth-child(2)");
  } catch (err) {
    console.log(`No captions available for ${title}`);
  }
  await page.waitForSelector("#body > ytd-transcript-body-renderer");

  const transcriptions = await page.$$eval(".cue", cue => [...cue].map(str => str.innerText));

  const save_path = `dump/${sanitize(title)}.txt`;
  fs.writeFileSync(save_path, transcriptions.join("\n"));

  console.log(`DONE (saved as ${save_path})`);
  return transcriptions;

}

module.exports["trending"] = async (page) => {

  const date = get_iso_date();
  const whereto = "https://www.youtube.com/feed/trending";

  console.log(`Page going to ${whereto}`);
  await page.goto(whereto,  {waitUntil: "networkidle0"});

  const vids = await page.$$eval("a#video-title", vid_anchors => [...vid_anchors].map(a => a.href.split("v=")[1]));

  const save_path = `dump/trending_vids_${sanitize(date)}.txt`;
  fs.writeFileSync(save_path, vids.join("\n"));

  console.log(`DONE (saved as ${save_path})`);
  return vids;

}
