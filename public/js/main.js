console.log("Briss <3 es la más hermosa");

$(function (){
    const socket= io();

    //obtaining DOM elments form the interface
    const $messageForm = $('#message-form');
    const $messageBox = $('#message');
    const $chat = $('#chat');

    //obtaining DOM elments form the nicknameform

    const $nickForm =  $('#nickForm');
    const $nickError =  $('#nickError');
    const $nickname =  $('#nickname');


    const $users = $('usernames');

    $nickForm.submit8(e => {
        e.preventDefault();
        socket.emit('new user', $nickname.val(), data => {
            

        });
    });


    //events
    $messageForm.submit( e => {
        e.preventDefault();
        socket.emit('send message', $messageBox.val());
        $messageBox.val('');
    });


    socket.on('new message', function(data) {
        $chat.append(data + '<br/>');
    });
});
