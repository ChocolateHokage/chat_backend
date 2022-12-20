import { Server } from "socket.io"

export default (http) => {
    const io = new Server(http)
    io.on("connection", function (socket) {
        socket.on("CHAT:JOIN", (chatId) => {
            socket.chatId = chatId
            socket.join(chatId)
        })
        socket.on('CHAT:TYPING', (obj) => {
            socket.broadcast.emit('CHAT:TYPING', obj)
        })
    })
    return io;
}
