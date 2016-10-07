var moment = require('moment');
var now = moment();

console.log(now.format());
now.subtract(1, 'year');

//console.log(now.format('X'));
//console.log(now.format('x'));

console.log(now.valueOf());

console.log(now.format("MMM Do YY, HH:mm A"));


var timestamp = 1444213208852;
var timestampMoment = moment.utc(timestamp);

console.log("moment" + timestampMoment.local().format('HH:mm A'));