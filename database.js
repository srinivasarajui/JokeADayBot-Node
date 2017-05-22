const pg = require('pg');
const JSON = require("JSON");
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/srinivasa';

const client = new pg.Client(connectionString);
client.connect();

exports.insetData=function(){

	client.query('insert into userProfiles(username,isActive) values($1,$2);', ['Sri', true], function (err, result) {
		//done() ;//this done callback signals the pg driver that the connection can be closed or returned to the connection pool

	      console.log('Inserted');
	    
	    });

}

exports.selectData=function(){
client
    .query('select * from userProfiles;')
    .on('row', function(row) {
      console.log(JSON.stringify(row));
    }); 
}