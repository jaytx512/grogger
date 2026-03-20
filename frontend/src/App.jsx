import { useEffect, useMemo, useRef, useState } from 'react';
import { EditorPane } from './components/EditorPane.jsx';
import { PreviewPane } from './components/PreviewPane.jsx';
import { VersionHistory } from './components/VersionHistory.jsx';
import { createSocketClient } from './lib/socketClient.js';

export default function App() {
  const roomId = 'default-room';
  const username = useMemo(() => `user-${Math.floor(Math.random() * 1000)}`, []);
  const [content, setContent] = useState('Connecting...');
  const [versions, setVersions] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = createSocketClient();
    socketRef.current = socket;

    socket.emit('document:join', { roomId, username });

    socket.on('document:state', (state) => {
      setContent(state.content);
      setVersions(state.versions);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [roomId, username]);

  const handleChange = (nextValue) => {
    setContent(nextValue);
    socketRef.current?.emit('document:update', { roomId, content: nextValue });
  };

  const handleRestore = (versionId) => {
    socketRef.current?.emit('document:restore', { roomId, versionId });
  };

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', padding: '1rem' }}>
      <h1>Real-time Collaborative Markdown Editor</h1>
      <p>
        Room: <code>{roomId}</code> | User: <code>{username}</code>
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 300px', gap: '1rem' }}>
        <EditorPane content={content} onChange={handleChange} />
        <PreviewPane content={content} />
        <VersionHistory versions={versions} onRestore={handleRestore} />
      </div>
    </main>
  );
}
