// http://www.neopets.com/trudydaily/slotgame.phtml

// button = (590, 300)


// fetch('https://api.github.com/gists', {
//     method: 'post',
//     body: JSON.stringify(opts)
//   }).then(function(response) {
//     return response.json();
//   }).then(function(data) {
//     ChromeSamples.log('Created Gist:', data.html_url);
//   });
// var ajaxurl = '/trudydaily/ajax/claimprize.php';
//       //var data = {'action': 'getslotstate'};
//       var data = {
//         'action': 'getslotstate','key': '0'};
//       var resp;
//       parent.$.post(ajaxurl, data, function (response){
//         resp = JSON.parse(response);
//                     SlotsGame.LoadAssets(AssetLoadComplete, "http://images.neopets.com");
//                 }
//         );
//         SlotsGame.Initialize();
//         function AssetLoadComplete(){
//           SlotsGame.Start(resp);
//         }

require('dotenv').load();
const puppeteer = require('puppeteer');
const {neopets_login} = require('../login/index.js');

const whereto = "http://www.neopets.com/lab2.phtml";

(async () => {

  console.log("Launching Headless Chrome");
  const browser = await neopets_login(
    process.env.NEOPETS_USERNAME,
    process.env.NEOPETS_PASSWORD
  );

  console.log("Browser opening new tab");
  const page = await browser.newPage();

  console.log(`Page going to ${whereto}`);
  await page.goto(whereto);

  setInterval(async () => {
    const save_path = `dump/${Math.floor(Math.random() * 9999)}_trudy.png`;
    console.log("saving")
    await page.screenshot({path: save_path});
  }, 2 * 1000);

  page.mouse.move(590, 300);
  page.mouse.down();

  // const date = new Date().toISOString().split("T")[0];
  // const save_path = `${date}_lab_results.png`;
  // console.log(`Saving lab results as ${save_path}`)
  // await page.screenshot({path: save_path});
  // console.log("SUCCESS");
  //
  // console.log("Closing Headless Chrome")
  // await browser.close();
})();
