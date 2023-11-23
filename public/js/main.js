$(function () {
    const socket = io();

    // Obtaining DOM elements from the interface
    const $messageForm = $('#message-form');
    const $messageBox = $('#message');
    const $chat = $('#chat');

    // Obtaining DOM elements from the nickname form
    const $nickForm = $('#nickForm');
    const $nickError = $('#nickError');
    const $nickname = $('#nickname');

    const $users = $('#usernames');

    $nickForm.submit(e => {
        e.preventDefault();
        socket.emit('new user', $nickname.val(), data => {
            if (data) {
                $('#nickWrap').hide();
                $('#contentWrap').show();
            } else {
                $nickError.html('<div class="alert alert-danger">that username already exists</div>');
            }
            $nickname.val('');
        });
    });

    // Events
    $messageForm.submit(e => {
        e.preventDefault();
        const messageContent = $messageBox.val();
        const currentTime = new Date();
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        const formattedTime = `${hours}:${minutes}`;

        socket.emit('send message', { message: messageContent, time: formattedTime }, data => {
            if (data) {
                $chat.append(`<p class="error">${data}</p>`);
            }
        });

        $messageBox.val('');
    });

    socket.on('new message', function (data) {
        $chat.append(`<b>${data.nick}</b> (${data.time}): ${data.msg}</br>`);
    });

    // Manejo de mensajes privados
    socket.on('whisper', function(data) {
        $chat.append(`<p class="whisper"><b>${data.nick}</b> (whisper): ${data.msg}</p>`);
    });

    socket.on('usernames', data => {
        let html = '';
        for (let i = 0; i < data.length; i++) {
            html += `<p>${data[i]}</p>`;
        }
        $users.html(html);
    });
});
