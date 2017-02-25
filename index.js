'use strict';
// Reverie by Jonathon Orsi, February 25th, 2017

// imports
var express = require('express')();
var server = require('http').createServer(express);
var io = require('socket.io')(server);
var mongodb = require('mongodb').MongoClient;

// global variables
var url = 'mongodb://localhost:27017';

// setup the express server
express.use(require('express').static('./client'))

// setup socket.io
io.on('connection', function (socket) {
  console.log('connection made by: ', socket.conn.id);
  var messages;
  mongodb.connect(url, function(err, db) {
    var collection = db.collection('messages');
    collection.find().toArray(function(err, docs) {
      messages = docs;

      // Send
      socket.emit('messages', messages);
      db.close();
    });
  });


  // Listen
  socket.on('message', function (data) {
    console.log(data);

    mongodb.connect(url, function(err, db) {
      var collection = db.collection('messages');
      collection.insertOne({value: data});
      db.close();
    });

    socket.broadcast.emit('newMessage', {value : data});
  });

  socket.on('disconnect', function() {
        console.log('disconnection by ', socket.conn.id);
    });
});


// start the http server
server.listen(3000, function () {
  console.log('server listening on port 3000...');
});
