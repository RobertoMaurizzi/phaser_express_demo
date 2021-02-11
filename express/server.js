/* global process __dirname */
const path = require( "path" );
const express = require('express');
const { createPhaserAssets } = require('./create-phaser-assets.js')
let app = express()
let basepath = path.resolve(__dirname, '../dist')

createPhaserAssets()

console.log(basepath)
app.use('/', express.static(basepath))

app.get('/',function(req, res){
    res.sendFile('index.html');
});

//port for heroku
let port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log('\nExample app listening on port 3000!');
});
