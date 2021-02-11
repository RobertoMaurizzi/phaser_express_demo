/* global process __dirname */
const express = require('express');
const { createPhaserAssets } = require('./create-phaser-assets.js')
let app = express();


createPhaserAssets()

app.use('/', express.static(__dirname + '/src'));

app.get('/',function(req, res){
    res.sendFile('index.html');
});

//port for heroku
let port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log('\nExample app listening on port 3000!');
});
