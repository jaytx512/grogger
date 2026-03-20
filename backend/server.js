import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { DocumentSyncStore } from '../src/sync/documentSyncStore.js';

const PORT = process.env.PORT || 3001;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
});
const store = new DocumentSyncStore();

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

io.on('connection', (socket) => {
  socket.on('document:join', ({ roomId = 'default-room', username = 'anonymous' } = {}) => {
    socket.join(roomId);
    socket.data.roomId = roomId;
    socket.data.username = username;

    socket.emit('document:state', store.getState(roomId));
  });

  socket.on('document:update', ({ roomId, content } = {}) => {
    if (typeof content !== 'string' || !roomId) {
      return;
    }

    const username = socket.data.username || 'anonymous';
    const nextState = store.applyUpdate(roomId, content, username);

    io.to(roomId).emit('document:state', nextState);
  });

  socket.on('document:restore', ({ roomId, versionId } = {}) => {
    if (!roomId || !versionId) {
      return;
    }

    const username = socket.data.username || 'anonymous';
    const nextState = store.restoreVersion(roomId, versionId, username);

    if (nextState) {
      io.to(roomId).emit('document:state', nextState);
    }
  });
});

httpServer.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Socket.io server listening on http://localhost:${PORT}`);
});
