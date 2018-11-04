const puppeteer = require('puppeteer');

module.exports["insta_login"] = async (username, password) => {

  console.log("Launching Headless Chrome");
  const browser = await puppeteer.launch();

  console.log("Logging in...");
  const page = await browser.newPage();
  await page.goto("https://www.instagram.com/accounts/login/");

  await page.screenshot({path: "dump/login/test1.png"});

  try {await page.$$eval("button", btns => btns[1].click());}
  catch (err) {}

  await page.screenshot({path: "dump/login/test2.png"});

  try {
    
    await page.focus("input[aria-label='Phone number, username, or email']");
    await page.keyboard.type(username);

    await page.screenshot({path: "dump/login/test3.png"});

    await page.focus("input[aria-label='Password']");
    await page.keyboard.type(password);

    await page.screenshot({path: "dump/login/test4.png"});

    let loggedin;

    await page.click("button[type='submit']");
    const login_timer = setTimeout(() => {
      if (!loggedin)
        console.log("Failed to login.");
        process.exit(1);
    }, 60 * 1000);

    console.log("Processing login request...");
    await page.waitForNavigation({waitUntil: "load"});

    loggedin = true;

    await page.screenshot({path: "dump/login/test5.png"});

  } catch (err) {

    console.log("Failed to login");
    return;

  }

  console.log(`Successfully Logged in as ${username}`);
  console.log(`Redirected to ${await page.url()}`);

  return browser;

};
