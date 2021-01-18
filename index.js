const fetch = require('node-fetch');
const cheerio = require('cheerio');

(async () => {
  const res = await fetch('https://explodingtopics.com/topics-last-6-months')
  const text = await res.text()
  const $ = cheerio.load(text)

  const containers =  $('.topicInfoContainer').toArray()
  const trends = containers.map( c => {
    const i = $(c)
    const keyword = i.find('.tileKeyword').text()
    const description = i.find('.tileDescription').text()
    const score = i.find('.scoreTag').first().text()
    return {keyword, description, score}
  })

  console.log({trends})

})();