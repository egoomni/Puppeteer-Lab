const puppeteer = require('puppeteer');

module.exports["neopets_login"] = async (username, password) => {

  console.log("Launching Headless Chrome");
  const browser = await puppeteer.launch();

  console.log("Logging in...");
  const page = await browser.newPage();
  await page.goto("http://www.neopets.com/login/index.phtml");

  await page.focus("input[type='text'][name='username'][tabindex='1']");
  await page.keyboard.type(username);

  await page.focus("input[type='password'][name='password'][tabindex='2']");
  await page.keyboard.type(password);

  await page.click(".welcomeLoginButton");

  const already_loggedin = (await page.url()) == "http://www.neopets.com/index.phtml";

  if (already_loggedin) {

    console.log("already logged in");

  } else {

    let loggedin = false;

    const login_timer = setTimeout(() => {
      if (!loggedin)
        console.log("Failed to login.");
        process.exit(1);
    }, 60 * 1000);

    console.log("Processing login request...");
    await page.waitForNavigation({waitUntil: "load"});
    loggedin = true;

  }

  console.log(`Successfully Logged in as ${username}`);
  console.log(`Redirected to ${await page.url()}`);

  return browser;

};
