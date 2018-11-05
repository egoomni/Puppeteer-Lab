const fs = require('fs');

module.exports = class Neopets_Progress {

  constructor(save_path, dailies = {}) {

    this.save_path = save_path || "neopets_progress.json";

    this.data = (fs.existsSync(save_path)) ?
      JSON.parse(fs.readFileSync(save_path)) :
      Object.entries(dailies)
        .reduce((acc, [name, fn]) => {
          acc[name] = false;
          return acc;
        }, {});

  }

  finished(daily) {

    this.data[daily] = true;

  }

  is_finished(daily) {

    return this.data[daily];

  }

  save() {

    fs.writeFileSync(
      this.save_path,
      JSON.stringify(
        this.data,
        null,
        2
      )
    );

  }
