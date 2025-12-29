import { Server } from "socket.io"

export default function handler(req: any, res: any) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on("connection", (socket: { id: any; on: (arg0: string, arg1: ({ conversationId, senderId }: { conversationId: any; senderId: any }) => void) => void; broadcast: { emit: (arg0: string, arg1: { conversationId: any; senderId: any }) => void } }) => {
      console.log("Socket connected:", socket.id)

      socket.on("typing", ({ conversationId, senderId }) => {
        // Broadcast cho tất cả client khác trong conversation
        socket.broadcast.emit("typing", { conversationId, senderId })
      })
    })
  }
  res.end()
}
