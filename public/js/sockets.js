module.exports = function(io){

    let users = {};


    io.on('connection', socket => {
        
        console.log('new user connected');

        socket.on('new user', (data, cb) => {
            console.log(data);
            if (users[data] != undefined){
                cb(false);
            }else{
                cb(true);
                socket.nickname = data;
                users[socket.nickname]= socket;
                updateusers();
            }
        });

        socket.on('send message', (data, cb) => {
            var msg = (data && data.message && typeof data.message === 'string') ? data.message.trim() : '';
        
            if (msg.substr(0, 3) === '/w') {
                msg = msg.substr(3);
                const index = msg.indexOf(' ');
                if (index !== -1) {
                    var name = msg.substring(0, index);
                    var msgBody = msg.substring(index + 1);
                    if (name in users) {
                        users[name].emit('new message', {
                            msg: msgBody,
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
                io.emit('new message', {
                    msg: msg,
                    nick: socket.nickname,
                    time: data.time
                });
            }
        });

        socket.on('new message', function(data) {
            // Añadir clase 'right' si el mensaje es del propio usuario, de lo contrario, usar 'left'
            const alignmentClass = (data.nick === socket.nickname) ? 'right' : 'left';
            
            $chat.append(`<div class="message ${alignmentClass}"><b>${data.nick}</b>: ${data.msg}<span class="time">(${data.time})</span></div>`);

        });
        
        
        
            
        socket.on('disconnect', data => {
            if(!socket.nickname) return;
            delete users[socket.nickname];
            updateusers();
        });

        function updateusers(){
            io.sockets.emit('usernames',Object.keys(users));
        }
    });
}