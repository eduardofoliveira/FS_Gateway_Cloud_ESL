const connector = require('./fs-connector')

connector.on('create', chamada => {
  console.log('create: ' + JSON.stringify(chamada, null, 2))
})

connector.on('hangup', chamada => {
  console.log('hangup: ' + JSON.stringify(chamada, null, 2))
})