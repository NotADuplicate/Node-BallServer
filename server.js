var dgram = require("dgram");

var server = dgram.createSocket("udp4")

console.log("UDP bitch")


server.on("message", function(msg, rinfo) {
	console.log(msg);
	console.log("Got smth");
	server.send("message received",rinfo.port,rinfo.address);
});

server.bind(3000);