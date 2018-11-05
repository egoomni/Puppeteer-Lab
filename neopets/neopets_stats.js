const fs = require('fs');
const puppeteer = require('puppeteer');

module.exports = class Neopets_Stats {

  constructor(save_path) {

    this.inventory_url = "http://www.neopets.com/inventory.phtml";
    this.save_path = save_path || "neopets_stats.json";

    this.starting_inventory;
    this.current_inventory;

    this.starting_np;
    this.current_np;

  }

  async beginStat(page) {

    await page.goto(this.inventory_url);

    this.starting_inventory = await page.$eval(".inventory", table => {
      const trs = [...table.children[0].children];
      return trs.reduce((sum, tr) => sum += tr.children.length, 0);
    });

    this.starting_np = await page.$eval("#npanchor", a => {
      const np = a.innerText.replace(/,/g, "");
      return Number(np);
    });

  }

  async updateStat(page) {

    await page.goto(this.inventory_url);

    this.current_inventory = await page.$eval(".inventory", table => {
      const trs = [...table.children[0].children];
      return trs.reduce((sum, tr) => sum += tr.children.length, 0);
    });

    this.current_np = await page.$eval("#npanchor", a => {
      const np = a.innerText.replace(/,/g, "");
      return Number(np);
    });

  }

  summarize() {

    const si = this.starting_inventory,
          sn = this.starting_np,
          ci = this.current_inventory,
          cn = this.current_np;

    const delta_np = cn - sn;
    const delta_inventory = ci - si;

    let summary = "";
    summary += `At the beginning of the session, you began with ${si} items in your inventory and ${sn}NP.`;
    summary += `By the end of the session, you ended with ${ci} items in your inventory and ${cn}NP.`;
    summary += `You ${(ci >= si) ? "gained" : "lost"} ${Math.abs(delta_inventory)} items in your inventory`;
    summary += ` and ${(cn >= sn) ? "gained" : "lost"} ${Math.abs(delta_np)} NP.`;

    return {delta_np, delta_inventory, summary};

  }

  save() {

    fs.writeFileSync(
      this.save_path,
      JSON.stringify(
        this.summarize()
      )
    );

  }

}
