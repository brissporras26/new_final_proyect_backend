$(function () {
  const socket = io();

  //obtaining DOM elments form the interface
  const sendButton = document.getElementById('send-button');
  const messageInput = document.getElementById('message-input');
  const $chat = $('#chat');

  //obtaining DOM elments form the nicknameform
  const $nickForm = $('#nickForm');
  const $nickError = $('#nickError');
  const $nickname = $('#nickname');

  const $users = $('#usernames');

  // TODO: IMPLEMENT NICK SUMBISSION
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
  sendButton.addEventListener('click', function () {
    const message = messageInput.value;
    socket.emit('send message', message);
    messageInput.value = '';
  });

  // Render new message
  socket.on('new message', function (data) {
    $chat.append(`<b>${data.nick}</b>: ${data.msg}</br>`);
  });

  // Render connected users
  socket.on('usernames', data => {
    let html = '';
    for (let i = 0; i < data.length; i++) {
      html += `<p>${data[i]}</p>`;
    }
    $users.html(html);
  });
});
