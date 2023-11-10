module.exports = function functionName(io){
    io.on('connection', (socket) => {
        console.log('New user connected');
        
        socket.on('send message', function(data){
            io.sockets.emit('new message', data);
        });
    });
}
