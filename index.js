const connector = require('./fs-connector')
const axios = require('axios')
const api = axios.create({
  baseURL: 'http://35.171.122.245:85'
})

let lista = {}

connector.on('create', chamada => {
  if(!lista[chamada.callid]){
    const result = api.get(`/api/basix/domain/${chamada.to}`)
    result.then(data => {
      lista[chamada.callid].domain = data.domain
      console.log(data.domain)
    })
    
    lista[chamada.callid] = {
      from: chamada.from,
      to: chamada.to,
      domain: data.domain
    }
  }
})

connector.on('hangup', chamada => {
  delete lista[chamada.callid]
})

setInterval(() => {
  console.log(lista)
  console.log('')
}, 5000)