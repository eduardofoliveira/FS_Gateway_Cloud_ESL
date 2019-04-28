const esl = require("modesl");

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
