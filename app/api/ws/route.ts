// npm i ws
import { WebSocketServer } from 'ws';
import { prisma } from '@/lib/prisma';

let wss: WebSocketServer;

export const GET = async (req: Request) => {
  // Tạo server chỉ 1 lần
  if (!wss) {
    wss = new WebSocketServer({ noServer: true });

    wss.on('connection', ws => {
      ws.on('message', async (data) => {
        const parsed = JSON.parse(data.toString());
        const { type, payload } = parsed;

        if (type === 'send_message') {
          const { conversationId, senderId, content } = payload;

          // Lưu tin nhắn vào DB
          const message = await prisma.message.create({
            data: { conversationId, senderId, content },
            include: { sender: true }
          });

          // Broadcast cho tất cả client trong server
          wss.clients.forEach(client => {
            if (client.readyState === client.OPEN) {
              client.send(JSON.stringify({ type: 'new_message', payload: message }));
            }
          });
        }
      });
    });
  }

  return new Response('WebSocket endpoint');
};
