var Docker = require('dockerode');
var fs = require('fs');
var cfg = require('./config');

//var docker1 = Docker();
var docker1 = new Docker({
						host: cfg.host_ip, 
						port: 2376,
						protocol: 'https',
						ca: fs.readFileSync(process.env.DOCKER_CERT_PATH + '/ca.pem'),
	  					cert: fs.readFileSync(process.env.DOCKER_CERT_PATH + '/cert.pem'),
	  					key: fs.readFileSync(process.env.DOCKER_CERT_PATH + '/key.pem')
					}); //defaults to http

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

var HostPort = 5033; //use for testing

docker1.createContainer({
  Image: cfg.imagename,
  "Env": ["APP_NAME=" + cfg.appname, "HOST_PORT=" + HostPort]
}, function(err, container) {
	console.log("Host port : " + HostPort);
	  container.start({
	  	"ExposedPorts": {"3000/tcp": {}},
	  	//uncomment if we want to provide host port instead of dynamically allocate
		"PortBindings": {"3000/tcp":   [{}]}  //[{"HostPort": HostPort.toString()}]} //
	  }, function(err, data) {
	  	console.log('Container started : ' + data);
	    runExec(container);
	  });
});

