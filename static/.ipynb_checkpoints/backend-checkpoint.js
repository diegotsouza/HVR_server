const express = require('express')
const request = require('request');

var Ant = require('ant-plus');

app = express();

const PORT = 3000;

const openStick = require('./openStick.js')

// app.get('/home', function(req, res) {
//     request('http://127.0.0.1:5000/flask', function (error, response, body) {
//         console.error('error:', error); // Print the error
//         console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//         console.log('body:', body); // Print the data received
//         res.send(body); //Display the response on the website
//       });      
// });

// app.listen(PORT, function (){ 
//     console.log('Listening on Port 3000');
// });  
var test = openStick.openStick(new Ant.GarminStick3(), 3);


request({
    method: 'POST',
    url: 'http://127.0.0.1:5000/flask',
    json: test.data
//     body: 'teste'    
}, (error, response, body) => {
    console.log(error);
    // console.log(response);
    console.log(body);
});