var unirest = require("unirest");

var req = unirest("GET","http://api.icndb.com/jokes/random");
req.end(function (res){
	console.log(res.body.value.joke);
}
);