var name = getQueryVariable("name") || "anonymous";
var room = getQueryVariable("room");
var socket = io();

console.log( name + " wants to join to room:" + room);

socket.on("connect", function(){
    console.log("connected to socket.io");
});

socket.on("message", function(message){
    console.log(message.text);
    var momentTimestamp  = moment.utc(message.timestamp);
    var $message = jQuery(".messages");

    $message.append('<p> <strong>' + message.name + " " + momentTimestamp.local().format("HH:mma") +'</strong></p>');
    $message.append(" " + message.text +'</p>')

});

//handles submitting of new message
var $form = jQuery('#message-form');
$form.on('submit', function(event){
    event.preventDefault();
    var message = $form.find('input[name=message]');
    socket.emit('message' , {name: name, text: message.val()});

    message.val("");
});