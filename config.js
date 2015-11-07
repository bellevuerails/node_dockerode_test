
var cfg = {};

cfg.host_ip = "192.168.99.100";
cfg.imagename = "bellevuerails/centos-node-hello";
cfg.appname = process.env.APP_NAME || "BIG MAC";


module.exports = cfg;