const fs = require('fs');
const rl = require('readline-sync');
const puppeteer = require('puppeteer');

// ANCHOR MANAGEMENT

module.exports["anchor"] = async (page, date) => {

  const whereto = "http://www.neopets.com/pirates/anchormanagement.phtml";

  console.log(`Page going to ${whereto}`);
  await page.goto(whereto);

  console.log("Aiming cannon at seamonster");

  try {


    await page.$eval("#form-fire-cannon", form => form.submit());
    console.log("Successfully fired cannon at seamonster");

    const save_path = `dump/anchor/${date}_anchor_results.png`;
    console.log(`Saving anchor management results as ${save_path}`);
    await page.screenshot({path: save_path});

  } catch (err) {

    console.log("Already defeated seamonster for today");

  }

  return page;

};

// BANK INTEREST

module.exports["bank_interest"] = async (page) => {

  const whereto = "http://www.neopets.com/bank.phtml";

  console.log(`Page going to ${whereto}`);
  await page.goto(whereto);

  console.log("Collecting bank interest");

  try {

    await page.$$eval("input[type='submit']", btns => btns[3].click());
    console.log("Successfully collected today's bank interest");

  } catch (err) {

    console.log("Already collected today's bank interest");

  }

  return page;

};

// FISHING

module.exports["fishing"] = async (page, date) => {

  const whereto1 = "http://www.neopets.com/quickref.phtml";
  const whereto2 = "http://www.neopets.com/process_changepet.phtml?new_active_pet=";
  const whereto3 = "http://www.neopets.com/water/fishing.phtml";

  console.log(`Page going to ${whereto1}`);
  await page.goto(whereto1);

  let neopets;

  try {

    neopets = await page.$$eval("img[width='50'][height='50'][border='0']", imgs => {
      const names = [...imgs]
        .filter(el => el.id.length > 0)
        .map(el => el.title);
      return [...new Set(names)];
    });

  } catch (err) {

    console.log("Fishing malfunction");
    return page;

  }

  const save_dir = `dump/fishing/${date}`;
  if (!fs.existsSync(save_dir)) fs.mkdirSync(save_dir);

  for (let neopet of neopets) {

    console.log(`Going fishing with ${neopet}`);
    await page.goto(whereto2 + neopet);
    await page.goto(whereto3);

    try {

      await page.click("input[type='submit'][value='Reel In Your Line']");
      await page.waitForNavigation({waitUntil: "load"});

      const save_path = `${save_dir}/${neopet}_fishing_results.png`;
      if (!fs.existsSync(save_path)) {
        console.log(`Saving ${neopet}'s fishing results as ${save_path}`);
        await page.screenshot({path: save_path});
      } else console.log(`Already fished with ${neopet} today`);

    } catch (err) {

      console.log(`${neopet} failed to fish`);

    }

  }

  return page;

};

// FRUIT MACHINE

module.exports["fruit_machine"] = async (page) => {

  const whereto = "http://www.neopets.com/desert/fruit/index.phtml";

  console.log(`Page going to ${whereto}`);
  await page.goto(whereto);

  try {

    console.log("Spinning the fruit machine");
    await page.click("input[type='submit'][value='Spin, spin, spin!']");

    console.log("Successfully spun the fruit machine");

  } catch (err) {

    console.log("Fruit Machine is not available");

  }

  return page;

};

// LAB

module.exports["lab"] = async (page, date) => {

  const whereto = "http://www.neopets.com/lab2.phtml";

  console.log(`Page going to ${whereto}`);
  await page.goto(whereto);

  let gimmeNeopet = process.env.MAIN_NEOPET || 0;

  if (!gimmeNeopet) {

    try {

      const neopets = await page.$$eval("input[type='radio']", radio_inputs => {
        const all_neopets = [...radio_inputs].map(el => el.value);
        return [...new Set(all_neopets)];
      });

      const neopet_index = rl.keyInSelect(neopets, "Which Neopet?");
      gimmeNeopet = neopets[neopet_index];

    } catch (err) {

      console.log("Lab unavailable");
      return page;

    }

  }

  try {

    await page.evaluate((neopet) => document.querySelector(`input[type='radio'][value='${neopet}']`).checked = true, gimmeNeopet);

    await page.click(`input[type='radio'][value='${gimmeNeopet}']`);
    await page.click("input[type='submit'][value='Carry on with the Experiment!']");

    console.log(`Submitting ${gimmeNeopet} for lab treatment`);

    await page.waitForNavigation({waitUntil: "load"});

    const save_path = `dump/lab/${date}_lab_results.png`;
    console.log(`Saving lab results as ${save_path}`)
    await page.screenshot({path: save_path});

  } catch (err) {

    console.log("Lab unavailable");

  }

  return page;

};

// METEOR

module.exports["meteor"] = async (page, date) => {

  const whereto = "http://www.neopets.com/moon/meteor.phtml?getclose=1";

  console.log(`Page going to ${whereto}`);
  await page.goto(whereto);

  let present;

  try {

    console.log("Poking meteor with a stick");
    await page.$eval("select", sel => sel.value = "1");
    await page.click("input[name='meteorsubmit']");
    await page.waitForNavigation({waitUntil: "load"});

    present = true;

  } catch (err) {

    console.log("The Kreludor Meteor is unavailable");

  }

  if (present) {

    const save_path = `dump/meteor/${date}_meteor_results.png`;
    console.log(`Saving meteor results as ${save_path}`);
    await page.screenshot({path: save_path});

  }

  return page;

};

// MONEY TREE

module.exports["money_tree"] = async (page, date, max_attempts = 15) => {

  const whereto = "http://www.neopets.com/donations.phtml";

  const save_path = `dump/money_tree/${date}_money_tree_results.txt`;

  for (let i = 1; i <= max_attempts; i++) {

    console.log(`Page going to ${whereto}`);
    await page.goto(whereto);

    console.log(`Looking for donation #${i}`);

    let donation;

    try {

      donation = await page.$$eval(".donated", divs => {
        const el = divs[divs.length - 1];
        el.children[0].click();
        return el.children[1].innerText;
      });

      fs.appendFile(save_path, `${donation}\n`, err => {
        console.log(`Attemping to grab ${donation}`);
      });

    } catch (err) {

      console.log("No more donations");
      return page;

    }

  }

  return page;

};

// THE DISCARDED MAGICAL BLUE GRUNDO PLUSHIE OF PROSPERITY

module.exports["tdmbgpop"] = async (page, date) => {

  const whereto = "http://www.neopets.com/faerieland/tdmbgpop.phtml";

  console.log(`Page going to ${whereto}`);
  await page.goto(whereto);

  try {

    console.log("Talking to the Plushie");
    await page.click("input[type='submit'][value='Talk to the Plushie']");

    console.log("Waiting for Plushie's response");
    await page.waitForNavigation({waitUntil: "load"});

    const save_path = `dump/tdmbgpop/${date}_tdmbgpop_results.png`;
    console.log(`Saving tdmbgpop results as ${save_path}`);
    await page.screenshot({path: save_path});

  } catch (err) {

    console.log("The Discarded Magical Blue Grundo Plushie of Prosperity is unavailable");

  }

  return page;

};

// TIKI TACK TOMBOLA

module.exports["tombola"] = async (page, date) => {

  const whereto = "http://www.neopets.com/island/tombola.phtml";

  console.log(`Page going to ${whereto}`);
  await page.goto(whereto);

  try {

    console.log("Playing Tombola");
    await page.click("input[type='submit'][value='Play Tombola!']");

    const save_path = `dump/tombola/${date}_tombola_results.png`;
    console.log(`Saving tombola results as ${save_path}`);
    await page.screenshot({path: save_path});

  } catch (err) {

    console.log("Tombola unavailable");

  }

  return page;

};
