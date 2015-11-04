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

docker1.createContainer({
  Image: imagename
//  Cmd: ['/bin/bash']
}, function(err, container) {
  container.start({}, function(err, data) {
  	console.log('Container started : ' + data);
    runExec(container);
  });
});

