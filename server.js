/************************************************************************
 * Cluster Instances to run on all cores
 ***********************************************************************/

// var cluster = require('cluster');

// if (cluster.isMaster) {

//     // Count the machine's CPUs
//     var cpuCount = require('os').cpus().length;

//     // Create a worker for each CPU
//     for (var i = 0; i < cpuCount; i += 1) {
//         cluster.fork();
//     }

//      // Listen for dying workers
//     cluster.on('exit', function (worker) {

//         // Replace the dead worker, we're not sentimental
//         console.log('Worker ' + worker.process.pid + ' died...');
//         cluster.fork();

//     });

// } else {


/************************************************************************
 * External Dependencies
 ***********************************************************************/

var restify     = require('restify');
var redis       = require('redis');





/************************************************************************
 * Instantiate server
 ***********************************************************************/

// Create server
var server = restify.createServer({name: 'UpBite Consumer API'})

// Begin listening
server.listen(4001, function(error, response){
    
    // Handle errors
    if(error){
        console.error('Error starting server:\n\n');
        console.error(error);
        process.exit()
    }

    // Log successful connection
    console.log('%s listening at %s', server.name, server.url);

});


/************************************************************************
 * Connect to redis
 ***********************************************************************/
var client = redis.createClient('6379', 'redis')

client.on("connect", function () {
    console.log('Connected to Redis server listening at ' + process.env.REDIS_PORT_6379_TCP_ADDR + ':' + process.env.REDIS_PORT_6379_TCP_PORT);
});

client.on("error", function (error) {
    console.log("Error " + error);
});




/************************************************************************
 * Middleware
 ***********************************************************************/

// CORS requests
server.use(restify.CORS({
    origins: ['*']
}));

server.use(restify.bodyParser());


/************************************************************************
 * Storage
 ***********************************************************************/
// var Storage = function(){
//     this.store = {}
//     this.key = 0
// }

// Storage.prototype.insert = function(doc){
//     console.log(this.store)
//     doc._id = this.key
//     this.store[doc._id] = doc
//     this.key++
//     return doc
// }

// Storage.prototype.find = function(doc_id){
//     console.log(doc_id)
//     return this.store[doc_id]
// }

// Storage.prototype.index = function(){
//     console.log(this.store)
//     var index = []
//     for(var key in this.store){
//         index.push(this.store[key])
//     }
//     return index
// }

// var storage = new Storage()

/************************************************************************
 * API
 ***********************************************************************/

var i = 0
var increment = function(){
    i++
    return i.toString()
}

// Post tiles
server.post('/tiles', function(req, res, next) {
    client.set(increment(), JSON.stringify(req.body), function(error, response){
        res.send(200, response)
    });
});

// List tiles
server.get('/tiles/:doc_id', function(req, res, next) {
    client.get(req.params.doc_id.toString(), function(error, doc){
        res.send(200, JSON.parse(doc))
    });
});

// // List tiles
// server.get('/tiles', function(req, res, next) {
//     res.send(200, storage.index())
// });














// }
