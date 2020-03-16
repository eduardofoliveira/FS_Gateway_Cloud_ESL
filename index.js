const connector = require('./fs-connector')
const axios = require('axios')
const api = axios.create({
  baseURL: 'http://35.171.122.245:85'
})

let lista = {}

connector.on('create', chamada => {
  //if(lastCallId !== chamada.callid){
    lastCallId = chamada.callid

    lista[chamada.callid] = {
      from: chamada.from,
      to: chamada.to,
    }

    const result = api.get(`/api/basix/domain/${chamada.to}`)
    result
    .then(data => {
      if(lista[chamada.callid]){
        lista[chamada.callid].domain = data.data.domain
        console.log(data.data.domain)
      }
    })
    .catch(erro => {
      console.error(`erro ao adicionar dominio no callid: ${chamada.callid}`)
    })
  //}
})

connector.on('hangup', chamada => {
  delete lista[chamada.callid]
})

setInterval(() => {
  console.log(lista)
  console.log('')
}, 5000)