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
    lista[detalhe].callid_basix = callid
  }

  if(!detalhe){
    return res.send()
  }

  if(user.indexOf('IVR') >= 0){
    return res.send()
  }

  // console.log(from, user, domain, callid, method)
  // console.log(to)
  // console.log(detalhe)
  // console.log(lista[detalhe])

  if(detalhe && lista[detalhe] && lista[detalhe].opcao.length > 0){
    console.log('Enviando com opções da ura')
    console.log(from, to, user, domain, callid, method, lista[detalhe].opcao.join('.'))
    console.log('')
    axios.get(`http://35.171.122.245:83/chamada/${from}/${lista[detalhe].to}/${user}/${domain}/${callid}/${method}/${lista[detalhe].opcao.join('.')}`)
  }else{
    console.log('Enviando normal')
    console.log(from, to, user, domain, callid, method)
    console.log('')
    axios.get(`http://35.171.122.245:83/chamada/${from}/${to}/${user}/${domain}/${callid}/${method}`)
  }

  res.send()
})

app.get(`/ura/:from/:to/:opcao/:domain`, (req, res) => {
  const { from, opcao, domain } = req.params;
  let { to } = req.params;

  let [detalhe] = Object.keys(lista).filter(item => {
    if(lista[item].from === from && lista[item].domain === domain){
      return true
    }
    return false
  })

  if(detalhe){
    lista[detalhe].opcao.push(opcao)
  }
  
  // console.log(lista[detalhe])

  res.send()
})

app.get('/status', (req, res) => {
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
      opcao: []
    }

    const result = api.get(`/api/basix/domain/${chamada.to}`)
    result
    .then(data => {
      if(lista[chamada.callid]){
        lista[chamada.callid].domain = data.data.domain
      }
    })
    .catch(erro => {
      console.error(`erro ao adicionar dominio no callid: ${chamada.callid}`)
    })
})

connector.on('hangup', chamada => {
  // if(lista[chamada.callid]){
  //   delete lista[chamada.callid]
  // }
})