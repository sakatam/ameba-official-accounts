const cheerio = require("cheerio")

html = `
<html>
  <a href="123">aaa</a>
  <a href="456">bbb</a>
</html>
`

let $ = cheerio.load(html)

$('a').each((i, elem) => { console.log($(elem).attr('href'))})
