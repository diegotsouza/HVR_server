const express = require('express')
const request = require('request');
var Ant = require('ant-plus');
var performanceNow = require("performance-now")

// Important
// Make sure that Garmin Express is not running, because it will attach to the ANT+ stick and prevent ant-plus from doing so.

function openStick(stick, stickid) {
    var sensor1 = new Ant.HeartRateSensor(stick);

    var dev_id = 0;

    sensor1.on('hbdata', function(data) {
        console.log  (stickid, 'sensor 1: ', data.DeviceID, data.ComputedHeartRate, data);
        
        if (data.DeviceID !== 0 && dev_id === 0) {
            dev_id = data.DeviceID;
            console.log(stickid, 'detaching...');
            sensor1.detach();
            sensor1.once('detached', function() {
                sensor1.attach(0, dev_id);
            });
            
        }
    });

    sensor1.on('attached', function() { 
        console.log(stickid, 'sensor1 attached');
                                      });
    sensor1.on('detached', function() { 
        console.log(stickid, 'sensor1 detached');
    });

//     var sensor2 = new Ant.StrideSpeedDistanceSensor(stick);

//     sensor2.on('ssddata', function(data) {
// //         console.log(stickid, 'sensor 2: ', data.DeviceID, data);
//     });

//     sensor2.on('attached', function() { 
// //         console.log(stickid, 'sensor2 attached'); 
//     });
//     sensor2.on('detached', function() { 
// //         console.log(stickid, 'sensor2 detached');
//     });

    var scanner = new Ant.HeartRateScanner(stick);

    scanner.on('hbdata', function(data) {
        let date_ob = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        data["datatype"] = 0;
        data["datetime"] = date_ob;
        var loadTimeInMS = Date.now(); 
        let timems = (loadTimeInMS + performanceNow()) * 1000;
        data["ticksTime"] = timems;
        
//         console.log (stickid, 'scanner: ', data.DeviceID, data.ComputedHeartRate, data.Rssi, data);
        request({
            method: 'POST',
            //url: 'http://127.0.0.1:5000/flask',
            url: 'http://192.168.0.103:5000/flask',
            json: data
//             body: 'teste'
        }, (error, response, body) => {
            if (error) {
                console.log(error);
            }
//             console.log(response);
//             console.log(body);
        });
    });

    scanner.on('attached', function() { 
        console.log(stickid, 'scanner attached'); 
    });
    scanner.on('detached', function() { 
        console.log(stickid, 'scanner detached'); 
    });

    stick.on('startup', function() {
//         console.log(stickid, 'startup');

//         console.log(stickid, 'Max channels:', stick.maxChannels);

//         sensor1.attach(0, 0);
        
        scanner.scan();
//         setTimeout(function(data) {
//             sensor2.attach(1, 0);
//         }, 2000);

//         setTimeout(function() {
//             sensor1.once('detached', function() { sensor2.detach(); });
//             sensor2.once('detached', function() {
//                 scanner.scan();
//             });
//             sensor1.detach();
//         }, 5000);
    });

    stick.on('shutdown', function() { 
        console.log(stickid, 'shutdown'); 
    });

    function tryOpen(stick) {
        let token = stick.openAsync((err) => {
            token = null;
            if (err) {
                console.error(stickid, err);
            } else {
                console.log(stickid, 'Stick found');
                setTimeout(function() { stick.close(); }, 60000000);
            }
        });

        setTimeout(function() { token && token.cancel(); }, 60000000);

        return token;
    }

    tryOpen(stick);
   
}
// module.exports = { openStick };
// openStick(new Ant.GarminStick2(), 1);
// openStick(new Ant.GarminStick2(), 2);
openStick(new Ant.GarminStick3(), 3);

// openStick(new Ant.GarminStick2(), 4);
// openStick(new Ant.GarminStick2(), 5);
// openStick(new Ant.GarminStick3(), 6);
