var client = require('./client')({
  service: 'vdb-busline',
  version: '1.0.0',
  port: 8080
});

client.on('new service', function(service){
  console.log(service);
});
