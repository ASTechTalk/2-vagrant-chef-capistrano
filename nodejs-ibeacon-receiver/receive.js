var redis = require('redis');
var redisClient = redis.createClient(6379, 'redis-server-ip');
var _ = require("underscore");

Bleacon = require('bleacon');
Bleacon.startScanning();

var receivedBeacons = {};
var tempBeacons = {};
var threshold = 10;

Bleacon.on('discover', function(beacon) {
    console.log(beacon);
    var id = beacon.uuid + ',' + beacon.major + ',' + beacon.minor;
    if( tempBeacons[id] === undefined){
        tempBeacons[id] = {};
        tempBeacons[id]['proximityCount'] =  {};
        tempBeacons[id]['proximityCount'][beacon.proximity] =  0;
    }
    if( tempBeacons[id]['proximityCount'][beacon.proximity] == undefined){
        tempBeacons[id]['proximityCount'][beacon.proximity] =  0;
    }
    tempBeacons[id].proximityCount[beacon.proximity] += 1;
    var totalBeaconNum = 0;
    var candidateProximity = '';
    var count = 0;
    Object.keys(tempBeacons[id].proximityCount).forEach(function(proximity){
        totalBeaconNum += tempBeacons[id].proximityCount[proximity]; 
        if(count < tempBeacons[id].proximityCount[proximity] ){
            count = tempBeacons[id].proximityCount[proximity];
            candidateProximity = proximity;
        }
    });

    if(totalBeaconNum >= threshold) {
        if( receivedBeacons[id] === undefined){
            receivedBeacons[id] = {};
        }

        receivedBeacons[id].timeStamp =  new Date();

        if( receivedBeacons[id].proximity !== candidateProximity ){
            receivedBeacons[id].proximity =  candidateProximity;

            beacon.id = id;
            beacon.proximity = candidateProximity
            beaconInfo = JSON.stringify(beacon);
            redisClient.publish("discover beacon", beaconInfo); 
              console.log('publish');
        }

        delete tempBeacons[id]
    }
});

setInterval(function(){
  _.each(receivedBeacons, function(beacon, key){
      if((new Date() - beacon.timeStamp) > 5000){
          beacon = key.split(',');
          var data = {
              id: key,
              uuid: beacon[0],
              major: beacon[1],
              minor: beacon[2],
              proximity: 'notfound'
          };
          redisClient.publish("discover beacon", JSON.stringify(data)); 
          delete receivedBeacons[key];
      }
  });
}, 5000);
