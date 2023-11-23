$(function () {
  const key = Buffer.from('1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 'hex');
  const iv = Buffer.from('fedcba0987654321fedcba0987654321', 'hex');
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
      $chat.append(`<p class="error">${data}</p>`);
    });

    $messageBox.val(''); ƒ
  });

  socket.on('new message', function (data) {

    const decryptedMessage = decrypt(data);
    console.log('[NAVA] decryptedMessage', decryptedMessage);
    
    $chat.append(`<b>${data.nick}</b> (${data.time}): ${decryptedMessage}</br>`);
  });

  socket.on('usernames', data => {
    let html = '';
    for (let i = 0; i < data.length; i++) {
      html += `<p>${data[i]}</p>`;
    }
    $users.html(html);
  });

  function decrypt(text) {
    console.log('[NAVA] text', text);
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
});
