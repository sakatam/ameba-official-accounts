const request = require('request')
const async = require('async')
const cheerio = require("cheerio")

let jobs = []

for(let i = 1; i <= 12; i++) {
  let url = `http://official.ameba.jp/search/birthday/birthday_${i}.html`
  jobs.push(function(cb) {
    request(url, function(err, res, body) {
      if(err)
        return cb(err)
      let $ = cheerio.load(body)
      let ids = $('ul.imgLi a').map(function(i, elem) {
        return $(elem).attr("href").match(/^http:\/\/ameblo.jp\/([\w-]+)\/?/)[1]
      }).get()
      ids = ids.filter((elem, pos) => { return ids.indexOf(elem) == pos })
      cb(null, ids)
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
