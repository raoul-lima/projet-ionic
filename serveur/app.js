var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
// var bodyParser = require('body-parser');
// var logger = require('morgan');
// var methodOverride = require('method-override');
// var cors = require('cors');
// var io = require('socket.io').listen(server);

// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(methodOverride());
// app.use(cors());

// app.get('/aty/:name', function(req, res) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     var name = req.params.name;
//     res.json(name);
//     console.log('GET de aty : ' + name);
// });

// app.post('/aty', function(req, res) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     var nom = req.body.name;
//     console.log('POST de aty : ' + nom);
//     res.send({ message: nom });
// });

io.sockets.on('connection', function(socket) {
    socket.on('new_user', function(pseudo) {
        //socket.pseudo = pseudo;
        console.log(pseudo + ' est en ligne');
        socket.broadcast.emit('new_user', pseudo);
    });

    // socket.on('new_user_anonyme', function(pseudo) {
    //     console.log(pseudo + ' est en connexion dans new_user_anonyme');
    // });

    socket.on('mon_pseudo', function(pseudo) {
        socket.pseudo = pseudo;
    });

    socket.on('message', function(msg) {
        console.log('message de ' + socket.pseudo + ' => ' + msg);
        socket.broadcast.emit('message', socket.pseudo);
    });

    socket.on('request', function(pseudo) {
        console.log('requete amis de :' + pseudo);
        socket.broadcast.emit('request', pseudo);
    });

    socket.on('deconnect', function(pseudo) {
        console.log('Deconnexion de ' + pseudo);
        socket.broadcast.emit('deconnect', pseudo);
    });

    socket.on('notification', function(who) {
        console.log('Notification pour ' + who);
        socket.broadcast.emit('notification', who);
    });
});

server.listen(8888);
console.log('Serveur démarré avec socket');

// var app = require('express')(),
//     server = require('http').createServer(app),
//     io = require('socket.io').listen(server),
//     bodyParser = require('body-parser');

// //ent = require('ent'); // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
// // Chargement de la page index.html

// app.use(bodyParser.json());
// app.post('/checkname', function(req, res) {
//     console.log('post de checkname');
// });
// app.get('/', function(req, res) {
//     res.sendFile(__dirname + '/index.html');

// });



// io.sockets.on('connection', function(socket, pseudo) {
//     // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
//     socket.on('new_client', function(pseudo) {
//         //pseudo = ent.encode(pseudo);
//         socket.pseudo = pseudo;
//         socket.broadcast.emit('new_client', pseudo);
//         console.log(pseudo);
//     });

//     // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
//     socket.on('message', function(message) {
//         //message = ent.encode(message);
//         console.log(message);
//         socket.broadcast.emit('message', { pseudo: socket.pseudo, message: message });
//     });
// });

// server.listen(8080);