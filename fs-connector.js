const esl = require("modesl");
const { EventEmitter } = require('events')
const em = new EventEmitter

let waitTime = 20000;

let doConnect = () => {
  conn = new esl.Connection("127.0.0.1", 8021, "ClueCon", function() {
    conn.events("json", "all");

    conn.subscribe(["CHANNEL_CREATE", "CHANNEL_HANGUP_COMPLETE", "disconnect"]);

    conn.on("esl::event::CHANNEL_CREATE::*", evento => {
      if (
        evento.getHeader("Call-Direction") === "outbound" &&
        evento.getHeader("Caller-Network-Addr") == "54.233.223.179"
        ) {
        const chamada = {
          callid: evento.getHeader("Channel-Call-UUID"),
          from: evento.getHeader("Caller-Caller-ID-Number"),
          to: evento.getHeader("Caller-Destination-Number")
        };

        em.emit('create', chamada)
      }
    });

    conn.on("esl::event::CHANNEL_HANGUP_COMPLETE::*", evento => {
      const chamada = {
        callid: evento.getHeader("Channel-Call-UUID"),
        from: evento.getHeader("Caller-Caller-ID-Number"),
        to: evento.getHeader("Caller-Destination-Number")
      };

      em.emit('hangup', chamada)
    });

    conn.on("error", error => {
      console.log("caiu");
      let data = new Date();
      console.log(`${error.code} - ${data.toLocaleString()}`);
      setTimeout(doConnect, waitTime);
    });

    conn.on("esl::event::disconnect::notice", () => {
      let data = new Date();
      console.log(`desconectou - ${data.toLocaleString()}`);
      setTimeout(doConnect, waitTime);
    });
  });
}

doConnect();

process.on("uncaughtException", function(err) {
  let data = new Date();
  console.log(`${err.code} - ${data.toLocaleString()}`);
  setTimeout(doConnect, waitTime);
});

module.exports = em