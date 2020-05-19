const files = require('serve-static')
const path = require('path')

const service = require('restana')({})

service.get('/hi', (req, res) => {
  res.send('Hello World!')
})

service.get('/index', (req, res) => {
  res.send('/index.html')
})


// serving "src" as root directory
const serve = files(path.join(__dirname, '/'))
service.use(serve)

service.start(1234)
