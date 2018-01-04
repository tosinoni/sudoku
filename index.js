const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use("/js", express.static(__dirname + '/js'))
  .use('/lib', express.static(__dirname + '/node_modules'))
  .set('views', __dirname + '/public/views')
  .set('view engine', 'html')
  .engine('html', require('ejs').renderFile)
  .get('*', (req, res) => res.render('sudoku.html'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))