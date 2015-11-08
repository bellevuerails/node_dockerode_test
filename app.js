var Docker = require('dockerode');
var fs = require('fs');
var cfg = require('./config');

var express = require('express');

var app = express();


app.get ('/', function(req, res){

	res.send('<H1>hello! would you like to launch some container?</H1>')
})

app.post ('/launch', function(req,resp){
	launchContainer();
	resp.send('All good');
})

var server = app.listen(3000, function(){


	console.log('listen to port 3000')
})

function launchContainer(){
	//var docker1 = Docker();
	var docker1 = new Docker({
							host: cfg.host_ip, 
							port: 2376,
							protocol: 'https',
							ca: fs.readFileSync(process.env.DOCKER_CERT_PATH + '/ca.pem'),
		  					cert: fs.readFileSync(process.env.DOCKER_CERT_PATH + '/cert.pem'),
		  					key: fs.readFileSync(process.env.DOCKER_CERT_PATH + '/key.pem')
						}); //defaults to http

	var HostPort = 5033; //use for testing

	var appname = getRandomArbitrary(10001, 50000);

	docker1.createContainer({
	  Image: cfg.imagename,
	  "Env": ["APPNAME=dockerize_app" + appname.toString(), "HOST_PORT=" + HostPort]
	}, function(err, container) {
		console.log("Host port : " + HostPort);
		  container.start({
		  	"ExposedPorts": {"3000/tcp": {}},
		  	//uncomment if we want to provide host port instead of dynamically allocate
			"PortBindings": {"3000/tcp":   [{}]}  //[{"HostPort": HostPort.toString()}]} //
		  }, function(err, data) {
		  	console.log('Container started : ' + data);
//TODO: print out container number
		   // runExec(container);
		  });
	});
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Get env list from running container
 * @param container
 */
function runExec(container) {
  options = {
    AttachStdout: true,
    AttachStderr: true,
    Tty: false,
    Cmd: ['env']
  };
  container.exec(options, function(err, exec) {
    if (err) return;

    exec.start(function(err, stream) {
      if (err) return;

      stream.setEncoding('utf8');
      stream.pipe(process.stdout);
    });
  });
}



