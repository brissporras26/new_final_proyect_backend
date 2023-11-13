module.exports = function(io){

    let nicknames = [];


    io.on('connection', socket => {
        
        console.log('new user connected');

        socket.on('new user', (data, cb) => {
            console.log(data);
            if (nicknames.indexOf(data) != -1){
                cb(false);
            }else{
                cb(true);
                socket.nickname = data;
                nicknames.push(socket.nickname);
                io.emit('usernames', nicknames);
            }
        });

        socket.on('send message', function (data){
            io.emit('new message', data);
        });

    });
}