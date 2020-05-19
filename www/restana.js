const files = require('serve-static')
const path = require('path')

const service = require('restana')({})

service.get('/hi', (req, res) => {
  res.send('Hello World!')
})

// serving "src" as root directory
const serve = files(path.join(__dirname, '/'))
service.use(serve)

service.start(2345)
