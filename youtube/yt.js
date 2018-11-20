const fs = require('fs');
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

  let likes = dislikes = 0;
  try {
    [likes, dislikes] = await page.$$eval("#text", txts => [Number(txts[1]["ariaLabel"].replace(/[^\d]/g, "")), Number(txts[2]["ariaLabel"].replace(/[^\d]/g, ""))]);
  } catch (err) {}

  const [channel_name, channel_id] = await page.$eval("#owner-name > a", a => [
    a.innerText, a.href.match(/(?<=\/channel\/).*$/g)[0]
  ]);

  const [day, date, month, year] = await page.$eval("#upload-info > span", span => {
    const date = new Date(span.innerText.replace(/Published\son\s/g, ""));
    return [date.getDay(), date.getDate(), date.getMonth(), date.getFullYear()];
  });

  console.log(`Waiting for ${title}'s transcript to load`);
  let transcript = [];
  await page.click("#button[aria-label='More actions']");
  try {
    await page.click("#items > ytd-menu-service-item-renderer:nth-child(2)");
    await page.waitForSelector("#body > ytd-transcript-body-renderer");
    transcript = await page.$$eval("#body > ytd-transcript-body-renderer > div", cue => {
      return [...cue].map(ts => {
        const time = ts.children[0].innerText.split(":").map(str => Number(str));
        const content = ts.children[1].innerText.replace(/^\s+|\s+$/gm, "");
        return [time, content];
      });
    });
  } catch (err) {
    console.log(`No captions available for ${title}`);
  }

  return {vid, title, description, views, likes, dislikes, channel_name, channel_id, day, date, month, year, transcript};

}

module.exports["trending"] = async (page) => {

  const date = get_iso_date();
  const whereto = "https://www.youtube.com/feed/trending";

  console.log(`Page going to ${whereto}`);
  await page.goto(whereto,  {waitUntil: "networkidle0"});

  return await page.$$eval("a#video-title", vid_anchors => [...vid_anchors].map(a => a.href.split("v=")[1]));

}
