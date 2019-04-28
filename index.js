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

  conn.on("esl::event::CHANNEL_CREATE::*", function(call) {
    console.log(call);
  });

  conn.on("esl::event::CHANNEL_HANGUP_COMPLETE::*", function(call) {
    console.log(call);
  });
});
