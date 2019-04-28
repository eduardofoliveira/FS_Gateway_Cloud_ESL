const esl = require("modesl");

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
    const chamada = {
      callid: evento.getHeader("Channel-Call-UUID"),
      from: evento.getHeader("Caller-Caller-ID-Number"),
      to: evento.getHeader("Caller-Destination-Number")
    };

    console.log("Chamada iniciada: ");
    console.log(chamada);
    console.log("");
  });

  conn.on("esl::event::CHANNEL_HANGUP_COMPLETE::*", evento => {
    const chamada = {
      callid: evento.getHeader("Channel-Call-UUID"),
      from: evento.getHeader("Caller-Caller-ID-Number"),
      to: evento.getHeader("Caller-Destination-Number")
    };

    console.log("Chamada finalizada: ");
    console.log(chamada);
    console.log("");
  });
});
