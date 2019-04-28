FS = require("esl");

const client = FS.client(function() {
  this.onceAsync("CHANNEL_ANSWER").then(function() {
    console.log("Call was answered");
  });

  this.onceAsync("CHANNEL_HANGUP").then(function() {
    console.log("Call hangup");
  });

  this.onceAsync("CHANNEL_HANGUP_COMPLETE").then(function() {
    console.log("Call was disconnected");
  });

  this.on("SOME_MESSAGE", function(call) {
    console.log("Got Some Message");
  });

  this.event_json(
    "CHANNEL_ANSWER",
    "CHANNEL_HANGUP",
    "CHANNEL_HANGUP_COMPLETE",
    "SOME_MESSAGE"
  );
});

client.connect(8021, "127.0.0.1");
