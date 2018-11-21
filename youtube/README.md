# yt.js

## Initialize
`const yt = require('yt.js');`

## Functionality
When using yt.js, it is recommended that you are using [Puppeteer]() as well.
This is because it is more efficient to be using the same browser instance in Puppeteer for the yt.js functions.
For example, you can start with this boilerplate:
```javascript
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // yt.js stuff

})();
```

## Documentation
* `yt.transcribe(page, vid)`
  * `page` = instance of Puppeteer's page
  * `vid` = string ID of a YouTube video
  * saves a txt file with a file naming convention of `<video_title>.txt`
  * returns a promise that resolves to an array of lines from the video transcription
* `yt.trending(page)`
  * `page` = instance of Puppeteer's page
  * returns a promise that resolves to an array of YouTube's trending videos objects like:
  ```javascript
  {
    "vid": "XXXXXXXXXXX", // video ID of trending YouTube video
    "cid": "XXXXXXXXXXXXXXXXXXXXXXXX" // channel ID of video's channel
  }
  ```
* `yt.summarize(page, vid)`
  * `page` = instance of Puppeteer's page
  * `vid` = string ID of a YouTube video
  * returns a promise that resolves to an object of information about a given video
  * the resulting object is formatted in this way:
  ```javascript
  // {vid, title, description, views, likes, dislikes, channel_name, channel_id, day, date, month, year, transcript}
  {
    "vid": "XXXXXXXXXXX", // video ID of trending YouTube video
    "title": "", // title of video
    "description": "", // video description
    "views": 0, // number of views
    "likes": 0, // number of likes
    "dislikes": 0, // number of dislikes
    "channel_name": "", // name of video's channel
    "channel_id": "", // ID of video's channel
    "day": 0, // number 0-6 (0 being Sunday and 6 being Saturday) that the video was uploaded on
    "date": 1, // number representing day of the month video was uploaded on
    "month": 0, // number 0-11 (0 being January and 11 being December) that the video was uploaded on
    "year": 2018, // year that the video was uploaded in
    "transcript": [
      [
        [
          0, // minutes into the video
          5 // seconds after minute shown above
        ], // timestamp
        "Once upon a time" // words being said during timestamp above
      ]
    ] // array of data showing the words spoken throughout the video
  }
  ```
