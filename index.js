FS = require("esl");

const client = FS.client(function() {
  this.onceAsync("CHANNEL_ANSWER").then(function(call) {
    console.log("Call was answered");
    console.log(call);
  });

  this.onceAsync("CHANNEL_HANGUP").then(function(call) {
    console.log("Call hangup");
    console.log(call);
  });

  this.onceAsync("CHANNEL_HANGUP_COMPLETE").then(function(call) {
    console.log("Call was disconnected");
    console.log(call);
  });

  this.on("SOME_MESSAGE", function(call) {
    console.log("Got Some Message");
    console.log(call);
  });

  this.event_json(
    "CHANNEL_ANSWER",
    "CHANNEL_HANGUP",
    "CHANNEL_HANGUP_COMPLETE",
    "SOME_MESSAGE"
  );
});

client.connect(8021, "127.0.0.1");
