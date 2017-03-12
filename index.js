var express = require('express')
var scrape = require('./scrape')

var app = express()

var cache = {data: null, time: null}
const CACHE_TTL = 60 * 60 * 1000

var scrape_with_cache = function(cb) {
  let now = new Date().getTime()
  if(cache.data && now - cache.time < CACHE_TTL) {
    console.log("cache hit", cache.time)
    cb(null, cache.data)
  } else {
    console.log("no cache hit")
    scrape(function(err, ids) {
      if(err)
        return cb(err)
      cache = {data: ids, time: new Date().getTime()}
      cb(err, ids)
    })
  }
}

app.get('/', function(req, res, next) {
  scrape_with_cache(function(err, data) {
    if(err) {
      console.error(err)
      return res.status(500).send('error caught')
    }

    res.send({data, length: data.length})
  })
})

const port = process.env.PORT || 3000
app.listen(port, function() {
  console.log(`listening on port ${port}`)
})

