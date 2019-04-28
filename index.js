const esl = require("modesl");

let chamadas_ativas = [];

const removerChamadaDaLista = id => {
  for (let index = 0; index < chamadas_ativas.length; index++) {
    if (chamadas_ativas[index].callid === id) {
      chamadas_ativas.splice(index, 1);
    }
  }
};

const contemNaLista = id => {
  for (let index = 0; index < chamadas_ativas.length; index++) {
    if (chamadas_ativas[index].callid === id) {
      return true;
    }
  }
};

conn = new esl.Connection("127.0.0.1", 8021, "ClueCon", function() {
  conn.events("json", "all");

  conn.subscribe([
    "CHANNEL_CREATE",
    "CHANNEL_CALLSTATE",
    "CHANNEL_STATE",
    "CHANNEL_EXECUTE",
    "CHANNEL_EXECUTE_COMPLETE",
    "CHANNEL_DESTROY"
  ]);

  conn.on("esl::event::CHANNEL_CREATE::*", evento => {
    if (evento.getHeader("Call-Direction") === "outbound") {
      const chamada = {
        callid: evento.getHeader("Channel-Call-UUID"),
        from: evento.getHeader("Caller-Caller-ID-Number"),
        to: evento.getHeader("Caller-Destination-Number")
      };

      if (!contemNaLista(chamada.callid)) {
        chamadas_ativas.push(chamada);
      }

      console.log("Chamada iniciada: ");
      console.log(chamada);
      console.log("");
    }
  });

  conn.on("esl::event::CHANNEL_HANGUP_COMPLETE::*", evento => {
    if (evento.getHeader("Call-Direction") === "outbound") {
      const chamada = {
        callid: evento.getHeader("Channel-Call-UUID"),
        from: evento.getHeader("Caller-Caller-ID-Number"),
        to: evento.getHeader("Caller-Destination-Number")
      };

      removerChamadaDaLista(chamada.callid);

      console.log("Chamada finalizada: ");
      console.log(chamada);
      console.log("");
    }
  });
});

setInterval(() => {
  console.log(chamadas_ativas);
}, 10000);
