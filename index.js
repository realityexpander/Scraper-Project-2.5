const fetch = require('node-fetch');
const cheerio = require('cheerio');
const Sheet = require('./sheet');

(async () => {
  let page = 1
  let allTrends = []
  let containers

  do {
    const res = await fetch(`https://explodingtopics.com/topics-last-6-months?page=${page}`)
    const text = await res.text()
    const $ = cheerio.load(text)

    containers =  $('.topicInfoContainer').toArray()
    if (containers.length == 0) break;

    const trends = containers.map( c => {
      const i = $(c)
      const keyword = i.find('.tileKeyword').text()
      const description = i.find('.tileDescription').text()
      let score = i.find('.scoreTag').first().text().split('mo')[1]

      // Calculate actual score modifier (M or K)
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

    allTrends.push(...trends)
    console.log({page})
    page++
  // } while (containers.length > 0)
  } while (page < 1)
    
  // console.log({allTrends})
  console.log(`Pages Processed:${page}`)

  // const sheet = new Sheet()
  // await sheet.load()
  // sheet.clearSheet()
  // sheet.addRows(allTrends)

  const sheet = new Sheet()
  await sheet.load()
  sheet.addNewRowsAndIgnoreExistingDuplicates(allTrends)

})();