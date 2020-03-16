const axios = require('axios')
const express = require('express')
const app = express()
const port = 80

app.get(`/chamada/:from/:to/:user/:domain/:callid/:method`, (req, res) => {
  const { from, user, domain, callid, method } = req.params;
  let { to } = req.params;

  let [detalhe] = Object.keys(lista).filter(item => {
    if(lista[item].from === from && lista[item].domain === domain){
      return true
    }
    return false
  })

  if(detalhe){
    to = lista[detalhe].to
  }

  console.log(from, user, domain, callid, method)
  console.log(to)
  console.log(lista[detalhe])

  res.send()
})

app.get(`/ura/:from/:to/:user/:domain`, (req, res) => {
  const { from, user, domain } = req.params;
  let { to } = req.params;

  let [detalhe] = lista.filter((item) => {
    item.from === from && item.domain === domain
  })

  console.log(from, user, domain, callid, method)
  console.log(to)
  console.log(detalhe)

  to = detalhe.to
  res.send()
})

app.get('status', (req, res) => {
  res.json(lista)
})

app.listen(port, () => {
  console.log(`App Running at port ${port}`)
})

const connector = require('./fs-connector')
const api = axios.create({
  baseURL: 'http://35.171.122.245:85'
})

let lista = {}

connector.on('create', chamada => {
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
})

connector.on('hangup', chamada => {
  setTimeout(() => {
    delete lista[chamada.callid]
  }, 5000)
})

// setInterval(() => {
//   console.log(lista)
// }, 5000)