const { createServer } = require("http")
const { Server } = require("socket.io")

const httpServer = createServer()
const io = new Server(httpServer, { cors: { origin: "*" } })

io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  socket.on("typing", ({ conversationId, senderId }) => {
    socket.broadcast.emit("typing", { conversationId, senderId })
  })

  socket.on("disconnect", () => console.log("User disconnected:", socket.id))
})

const PORT = 4000
httpServer.listen(PORT, () => {
  console.log(`Socket.io server running on http://localhost:${PORT}`)
})
