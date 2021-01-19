const fetch = require('node-fetch');
const cheerio = require('cheerio');
const Sheet = require('./sheet');

// Scrape source: Exploding Topics
// https://explodingtopics.com/topics-last-6-months?page=1

// Google Credentials
// https://console.cloud.google.com/apis/credentials?project=returnz-tester-215418

// Google Spreadsheet
// https://theoephraim.github.io/node-google-spreadsheet/#/classes/google-spreadsheet-worksheet?id=fn-setheaderrow

// Spreadsheet dev notes
// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/request#setbasicfilterrequest
// https://developers.google.com/apps-script/articles/removing_duplicates


(async () => {
  let page = 1
  let allTrends = []
  let containers

  do {
    const res = await fetch(`https://explodingtopics.com/topics-last-6-months?page=${page}`)
    const text = await res.text()
    const $ = cheerio.load(text)

    containers = $('.topicInfoContainer').toArray()
    if (containers.length == 0) break;

    const trendsForPage = containers.map( c => {
      const i = $(c)
      const keyword = i.find('.tileKeyword').text()
      const description = i.find('.tileDescription').text()
      let score = i.find('.scoreTag').first().text().split('mo')[1]

      score = calculateScoreModifier(score);

      return {keyword, description, score}
    })

    allTrends.push(...trendsForPage)

    console.log({page})
    page++
  } while (containers.length > 0)
  // } while (page < 1) // for testing
    
  // console.log({allTrends})
  console.log(`Pages Processed:${page}`)

  const sheet = new Sheet()
  await sheet.load()
  sheet.addNewRowsAndIgnoreExistingDuplicates(allTrends)

})();

// Calculate actual score with modifier (trailing M or K)
function calculateScoreModifier(score) {
  if (score != undefined) {
    const scoreMult = score.substr(score.length - 1, 1).toLowerCase();
    if ((+score).toString() == "NaN") { // Check if it's has a trailing character
      score = score.substr(0, score.length - 1);
      if (scoreMult == "k")
        score *= 1000;
      if (scoreMult == "m")
        score *= 1000000;
    }
  }
  return score;
}
