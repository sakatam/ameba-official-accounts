const request = require('request')
const async = require('async')
const cheerio = require("cheerio")

let jobs = []

for(let i = 1; i <= 12; i++) {
  let url = `http://official.ameba.jp/search/birthday/birthday_${i}.html`
  jobs.push(function(cb) {
    request(url, function(err, res, body) {
      if(err || res.statusCode != 200) {
        return cb(`failed to scrape ${url}. err: ${err} code: ${res.statusCode}`)
      }

      let $ = cheerio.load(body)

      let data = $('ul.imgLi.clr p a').map(function(i, elem) {
        let id = $(elem).attr("href").match(/^http:\/\/ameblo.jp\/([\w-]+)\/?/)[1]
        let name = $(elem).attr("title")
        return {id, name}
      }).get()

      cb(null, data)
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
