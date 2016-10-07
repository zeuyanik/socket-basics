var socket = io();
socket.on("connect", function(){
    console.log("connected to socket.io");
});

socket.on("message", function(message){
    console.log(message.text);
    var momentTimestamp  = moment.utc(message.timestamp);
    jQuery('.messages').append('<p><strong>' + momentTimestamp.local().format("HH:mma") + ": </strong>" + message.text +'</p>')

});

//handles submitting of new message
var $form = jQuery('#message-form');
$form.on('submit', function(event){
    event.preventDefault();
    var message = $form.find('input[name=message]');
    socket.emit('message' , {text: message.val()});

    message.val("");
});