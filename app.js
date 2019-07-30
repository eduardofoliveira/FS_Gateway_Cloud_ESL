const express = require("express");
const axios = require("axios");
const app = express();

const api = axios.create({
  baseURL: "http://35.171.122.245:83"
});

let navegacaoUra = [];

app.get(`/identificacao/:from/:to/:username/:domain/:call_id/:method`, (req, res) => {
  res.send();
  let { from, to, username, domain, call_id, method } = req.params;

  if (method === "RINGING") {
    let existe = navegacaoUra.filter(item => {
      return item.from === from && item.to === to;
    });

    console.log(existe);

    if (existe.length > 0) {
      api.get(`/chamada/${from}/${to}/${username}/${domain}/${call_id}/${method}/${existe[0].opcao.join(".")}`);
    } else {
      api.get(`/chamada/${from}/${to}/${username}/${domain}/${call_id}/${method}`);
    }
  }

  if (method === "DISCONNECTED") {
    navegacaoUra = navegacaoUra.filter(item => {
      return item.from !== from && item.to !== to;
    });
  }
});

app.get(`/ura/:from/:to/:opcao/:domain`, (req, res) => {
  res.send();
  let { from, to, opcao, domain } = req.params;

  let existe = navegacaoUra.filter(item => {
    return item.from === from && item.to === to;
  });

  if (existe.length > 0) {
    navegacaoUra = navegacaoUra.map(item => {
      if (item.from === from && item.to === to) {
        item.opcao = [...item.opcao, opcao];
      }
      return item;
    });
  } else {
    navegacaoUra.push({
      from,
      to,
      opcao: [opcao],
      domain
    });
  }
});

app.get("/status", (req, res) => {
  res.status(200).json({ navegacaoUra });
});

app.listen(81, () => {
  console.log("Running at port 81");
});
