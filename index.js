const fetch = require('node-fetch');
const cheerio = require('cheerio');
const Sheet = require('./sheet');

(async () => {
  const res = await fetch('https://explodingtopics.com/topics-last-6-months')
  const text = await res.text()
  const $ = cheerio.load(text)

  const containers =  $('.topicInfoContainer').toArray()
  const trends = containers.map( c => {
    const i = $(c)
    const keyword = i.find('.tileKeyword').text()
    const description = i.find('.tileDescription').text()
    let score = i.find('.scoreTag').first().text().split('mo')[1]

    // Correct by score modifier (M or K)
    if (score != undefined) {
      const scoreMult = score.substr(score.length-1,1).toLowerCase()
      if ( (+score).toString() == "NaN" ) {
        score = score.substr(0, score.length-1)
        if (scoreMult == "k") score *= 1000
        if (scoreMult == "m") score *= 1000000 
      }
    }
    return {keyword, description, score}
  })

  console.log({trends})

  const sheet = new Sheet()
  await sheet.load()
  sheet.addRows(trends)

})();