const connector = require('./fs-connector')

let lista = {}

connector.on('create', chamada => {
  // console.log('create: ' + JSON.stringify(chamada, null, 2))
  lista[chamada.callid] = {
    from: chamada.from,
    to: chamada.to
  }
})

connector.on('hangup', chamada => {
  // console.log('hangup: ' + JSON.stringify(chamada, null, 2))
  delete lista[chamada.callid]
})

setInterval(() => {
  console.log(lista)
  console.log('')
}, 5000)