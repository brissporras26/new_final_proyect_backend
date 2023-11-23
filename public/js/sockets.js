const crypto = require('crypto');

module.exports = function (io) {
  const key = Buffer.from('1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 'hex');
  const iv = Buffer.from('fedcba0987654321fedcba0987654321', 'hex');

  let users = {};

  function encrypt(text) {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
  }

  io.on('connection', socket => {
    console.log('new user connected');

    socket.on('new user', (data, cb) => {
      console.log(data);
      if (users[data] != undefined) {
        cb(false);
      } else {
        cb(true);
        socket.nickname = data;
        users[socket.nickname] = socket;
        updateusers();
      }
    });

    socket.on('send message', (data, cb) => {
      let msg = (data && data.message && typeof data.message === 'string') ? data.message.trim() : '';

      if (msg.substr(0, 3) === '/w') {
        msg = msg.substr(3);
        const index = msg.indexOf(' ');
        if (index !== -1) {
          var name = msg.substring(0, index);
          const msgBody = msg.substring(index + 1);
          const encryptedMessage = encrypt(msgBody);
          console.log('[NAVA] encryptedMessage', encryptedMessage);
          if (name in users) {
            users[name].emit('new message', {
              msg: encryptedMessage,
              nick: socket.nickname,
              time: data.time
            });
          } else {
            cb('Error, please enter a valid user');
          }
        } else {
          cb('Error, please enter your message');
        }
      } else {
        const encryptedMessage = encrypt(msg);
        console.log('[NAVA] encryptedMessage', encryptedMessage);

        io.emit('new message', {
          encryptedData: encryptedMessage.encryptedData,
          iv: encryptedMessage.iv,
          nick: socket.nickname,
          time: data.time
        });
      }
    });

    socket.on('disconnect', data => {
      if (!socket.nickname) return;
      delete users[socket.nickname];
      updateusers();
    });

    function updateusers() {
      io.sockets.emit('usernames', Object.keys(users));
    }
  });
}