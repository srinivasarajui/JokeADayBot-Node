var apiai = require('apiai');
var app = apiai(process.env.APIAI_CLIENT_ACCESS_TOKEN);
var query =function(sessionId,message,responseCallBack){

	 
	var apirequest = app.textRequest(message, {
	    sessionId: sessionId
	});

	apirequest.on('response', function(response) {
		responseCallBack(response.result.fulfillment.speech)
	    
	});

	apirequest.on('error', function(error) {
	    console.log(error);
	});
	apirequest.end();
}

exports.query = query;