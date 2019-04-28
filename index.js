FS = require("esl");

const client = FS.client({ all_events: false }, function() {
  this.onceAsync("CHANNEL_ANSWER", call => {
    console.log("Call was answered \r\n");
    console.log(call);
  });

  /*this.onceAsync("CHANNEL_HANGUP").then(function(call) {
    console.log("Call hangup \r\n");
    console.log(call);
  });

  this.onceAsync("CHANNEL_CREATE").then(function(call) {
    console.log("Channel Create \r\n");

    console.log(call.body["Call-Direction"]);

    //if (call.body["Call-Direction"] === "inbound") {
    //  console.log(call);
    //}
  });

  this.onceAsync("CHANNEL_HANGUP_COMPLETE").then(function(call) {
    console.log("Call was disconnected \r\n");
    console.log(call);
  });

  this.on("SOME_MESSAGE", function(call) {
    console.log("Got Some Message");
    console.log(call);
  });*/

  this.event_json(
    "CHANNEL_ANSWER",
    "CHANNEL_CREATE",
    "CHANNEL_HANGUP",
    "CHANNEL_HANGUP_COMPLETE",
    "SOME_MESSAGE"
  );
});

client.connect(8021, "127.0.0.1");
