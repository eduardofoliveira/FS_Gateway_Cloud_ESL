const connector = require('./fs-connector')
const axios = require('axios')
const api = axios.create({
  baseURL: 'http://35.171.122.245:85'
})

let lista = {}

connector.on('create', async chamada => {
  
  if(!lista[chamada.callid]){
    const { data } = await api.get(`/api/basix/domain/${chamada.to}`)
    console.log(data.domain)

    lista[chamada.callid] = {
      from: chamada.from,
      to: chamada.to,
      domain: data.domain
    }
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