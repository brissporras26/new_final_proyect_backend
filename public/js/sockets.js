module.exports = function(io) {
    let users = {};

    io.on('connection', socket => {
        console.log('new user connected');

        socket.on('new user', (data, cb) => {
            if (users[data]) {
                cb(false); // Usuario ya existe
            } else {
                cb(true); // Nuevo usuario
                socket.nickname = data;
                users[socket.nickname] = socket;
                updateUsers();
            }
        });

        socket.on('send message', (data, cb) => {
            var msg = data.message ? data.message.trim() : '';

            if (msg.startsWith('/w ')) {
                msg = msg.slice(3).trim();
                const spaceIndex = msg.indexOf(' ');

                if (spaceIndex > 0) {
                    var recipient = msg.substring(0, spaceIndex);
                    var msgBody = msg.substring(spaceIndex + 1);

                    if (users[recipient]) {
                        users[recipient].emit('whisper', {
                            msg: msgBody,
                            nick: socket.nickname,
                            time: data.time
                        });
                        cb(`Message sent to ${recipient}`);
                    } else {
                        cb('Error: please enter a valid user');
                    }
                } else {
                    cb('Error: please enter your message');
                }
            } else {
                io.emit('new message', {
                    msg: msg,
                    nick: socket.nickname,
                    time: data.time
                });
            }
        });

        socket.on('disconnect', () => {
            if (!socket.nickname) return;
            delete users[socket.nickname];
            updateUsers();
        });

        function updateUsers() {
            io.sockets.emit('usernames', Object.keys(users));
        }
    });
}
