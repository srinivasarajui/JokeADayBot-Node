const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const JSON = require("JSON");
const nlp = require('./nlpControl');
const db = require('./database');

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 5000));

// Server index page
app.get("/", function (req, res) {
  
	/*nlp.query(1,'Hi',function(message){
		console.log(message)
	});*/
		db.insetData();
		db.selectData();
  res.send("Deployed!");
  
});

// Facebook Webhook

// All callbacks for Messenger will be POST-ed here
app.post("/webhook", function (req, res) {
	 console.log("webhook " +JSON.stringify( req.body));
  // Make sure this is a page subscription
  if (req.body.object == "page") {
    // Iterate over each entry
    // There may be multiple entries if batched
    req.body.entry.forEach(function(entry) {
      // Iterate over each messaging event
		 console.log("Inside Entry Loop" +entry);
      entry.messaging.forEach(function(event) {
		  console.log("Inside Entry Loop" + JSON.stringify( event));
		 
        if (event.postback) {
          processPostback(event);
        }else if(event.message) {
			console.log("In Message ");
			nlp.query(parseInt(event.sender.id),event.message.text,function(message){
				sendMessage(event.sender.id, {text: message});
			});
			
			//console.log("Working on call back");
        	//sendMessage(event.sender.id, {text: event.message.text});
        }
      });
    });

    res.sendStatus(200);
  }
});

function processPostback(event) {
  var senderId = event.sender.id;
  var payload = event.postback.payload;

console.log("senderId" +senderId);
console.log("payload" +payload);
  if (payload === "Greeting") {
    // Get user's first name from the User Profile API
    // and include it in the greeting
    request({
      url: "https://graph.facebook.com/v2.6/" + senderId,
      qs: {
        access_token: process.env.PAGE_ACCESS_TOKEN,
        fields: "first_name"
      },
      method: "GET"
    }, function(error, response, body) {
      var greeting = "";
      if (error) {
        console.log("Error getting user's name: " +  error);
      } else {
        var bodyObj = JSON.parse(body);
        name = bodyObj.first_name;
        greeting = "Hi " + name + ". ";
      }
      var message = greeting + "My name is SP Movie Bot. I can tell you various details regarding movies. What movie would you like to know about?";
      sendMessage(senderId, {text: message});
    });
  }
}

// sends message to user
function sendMessage(recipientId, message) {
  request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
    method: "POST",
    json: {
      recipient: {id: recipientId},
      message: message,
    }
  }, function(error, response, body) {
    if (error) {
      console.log("Error sending message: " + response.error);
    }
  });
}