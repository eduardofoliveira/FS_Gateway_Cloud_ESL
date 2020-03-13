const connector = require('./fs-connector')

connector.on('create', chamada => {
  console.log('create: ' + chamada)
})

connector.on('hangup', chamada => {
  console.log('hangup: ' + chamada)
})