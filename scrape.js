const request = require('request')
const async = require('async')
const cheerio = require("cheerio")

let jobs = []

let parse = function(url, body) {
  let $ = cheerio.load(body)

  let data = $('ul.srchDetlLi dl dd.name.clr p a').map(function(i, elem) {
    let href, id, text, name;
    try {
      href = $(elem).attr("href")
      id = href.match(/^http:\/\/ameblo.jp\/([\w-]+)\/?/)[1]
      text = $(elem).text()
      name = text.split('\n')[0]
      return {id, name}
    } catch(e) {
      console.error('failed to extract name', {url, href, text})
    }
  }).get()

  return data
}

for(let i = 1; i <= 44; i++) {
  let url = `http://official.ameba.jp/kana/kana${i}.html`
  jobs.push(function(cb) {
    request(url, function(err, res, body) {
      if(err || res.statusCode != 200) {
        return cb(`failed to scrape ${url}. err: ${err} code: ${res.statusCode}`)
      }

      cb(null, parse(url, body))
    })
  })
}

module.exports = function(cb) {
  async.parallel(jobs, function(err, arr_ids) {
    if(err)
      return cb(err)
    ids = []
    cb(
      null,
      arr_ids.reduce((ids, val) => { return ids.concat(val) }, [])
    )
  })
}
