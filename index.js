const http = require("http");
const esl = require("modesl");
const axios = require("axios");

const api = axios.create({
  baseURL: "http://contact.cloudcom.com.br"
});

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("");

  //chamada/11999683333/551137115000/Eduardo/cloud.cloudcom.com.br/gfjdghkd55dkjhfd/RINGING

  const padrao = /\/(.*)\/(.*)\/(.*)\/(.*)\/(.*)\/(.*)\/(.*)/;
  const retorno = padrao.exec(req.url);
  if (retorno) {
    let [, , from, to, username, domain, call_id, method] = retorno;

    to = getDestinationCall(from);

    api.get(
      `/chamada/${from}/${to}/${username}/${domain}/${call_id}/${method}`
    );
  }
});

server.listen(80);

let chamadas_ativas = [];

const removerChamadaDaLista = id => {
  for (let index = 0; index < chamadas_ativas.length; index++) {
    if (chamadas_ativas[index].callid === id) {
      chamadas_ativas.splice(index, 1);
    }
  }
  console.log(`Chamada com ID: ${id} removida`);
};

const contemNaLista = id => {
  for (let index = 0; index < chamadas_ativas.length; index++) {
    if (chamadas_ativas[index].callid === id) {
      console.log(`Chamada com ID: ${id} já esta na lista`);
      return true;
    }
  }
};

const getDestinationCall = from => {
  for (let index = 0; index < chamadas_ativas.length; index++) {
    if (chamadas_ativas[index].from === from) {
      return chamadas_ativas[index].to;
    }
  }
};

conn = new esl.Connection("127.0.0.1", 8021, "ClueCon", function() {
  conn.events("json", "all");

  conn.subscribe(["CHANNEL_CREATE", "CHANNEL_HANGUP_COMPLETE"]);

  conn.on("esl::event::CHANNEL_CREATE::*", evento => {
    if (evento.getHeader("Call-Direction") === "outbound") {
      const chamada = {
        callid: evento.getHeader("Channel-Call-UUID"),
        from: evento.getHeader("Caller-Caller-ID-Number"),
        to: evento.getHeader("Caller-Destination-Number")
      };

      if (!contemNaLista(chamada.callid)) {
        chamadas_ativas.push(chamada);

        console.log("Chamada Adicionada");
        console.log(chamada);
        console.log("");
      }
    }
  });

  conn.on("esl::event::CHANNEL_HANGUP_COMPLETE::*", evento => {
    const chamada = {
      callid: evento.getHeader("Channel-Call-UUID"),
      from: evento.getHeader("Caller-Caller-ID-Number"),
      to: evento.getHeader("Caller-Destination-Number")
    };

    removerChamadaDaLista(chamada.callid);
  });
});

setInterval(() => {
  console.log("Chamadas Ativas");
  console.log(chamadas_ativas);
}, 10000);
