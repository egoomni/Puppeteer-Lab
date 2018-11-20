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

module.exports["summarize"] = async (page, vid) => {

  const whereto = `https://www.youtube.com/watch?v=${vid}`;

  console.log(`Page going to ${whereto}`);
  await page.goto(whereto,  {waitUntil: "networkidle0"});

  const title = await page.$eval("#container > h1 > yt-formatted-string", h1 => h1.innerText);
  const description = await page.$eval("#description > yt-formatted-string", desc => desc.innerText);
  const views = await page.$eval("#count > yt-view-count-renderer > span.view-count.style-scope.yt-view-count-renderer", txt => Number(txt.innerText.replace(/[^\d]/g, "")));

  const [likes, dislikes] = await page.$$eval("#text", txts => [
    Number(txts[0].innerText.replace(/[^\d]/g, "")),
    Number(txts[1].innerText.replace(/[^\d]/g, ""))
  ]);

  const [channel_name, channel_id] = await page.$eval("#owner-name > a", a => [
    a.innerText, a.href.match(/(?<=\/channel\/).*$/g)[0]
  ]);

  const [day, date, month, year] = await page.$eval("#upload-info > span", span => {
    const date = new Date(span.innerText.replace(/Published\son\s/g, ""));
    return [date.getDay(), date.getDate(), date.getMonth(), date.getFullYear()];
  });

  const subs = await page.$$eval("#subscribe-button > ytd-subscribe-button-renderer > paper-button > yt-formatted-string > span", span => {
    const token = span[1].innerText; // "10M"
    const val = Number(token.replace(/[^\d]/g, "")); // 10
    const scalar_str = token.match(/[a-zA-Z]/g); // ["M"]
    const scalar = scalar_str.length ? scalar_str[0] == "K" ? 1000 : 1000000 : 1; // 1,000,000
    return val * scalar; // 10,000,000
  });

  console.log(`Waiting for ${title}'s transcript to load`)
  await page.click("#button[aria-label='More actions']");
  try {
    await page.click("#items > ytd-menu-service-item-renderer:nth-child(2)");
    await page.waitForSelector("#body > ytd-transcript-body-renderer");
  } catch (err) {
    console.log(`No captions available for ${title}`);
  }

  const transcriptions = await page.$$eval(".cue", cue => [...cue].map(str => str.innerText).join(" ").split(/\!|\?|\./));

  const summary = {title, description, views, likes, dislikes, channel_name, channel_id, day, date, month, year, subs, transcriptions};

  const save_path = `dump/${sanitize(title)}.json`;
  fs.writeFileSync(save_path, JSON.stringify(summary, null, 2));

  console.log(`DONE (saved as ${save_path})`);
  return summary;

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
