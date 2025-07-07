const http = require('http');

http.createServer(function(req,res){
	res.write('This rocks!');
	res.end();
 }
).listen(3000);

console.log('server started!')
