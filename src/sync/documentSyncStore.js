const DEFAULT_CONTENT = '# Collaborative Markdown\n\nStart editing together!';

export class DocumentSyncStore {
  constructor(maxVersions = 50) {
    this.maxVersions = maxVersions;
    this.rooms = new Map();
  }

  ensureRoom(roomId) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, {
        content: DEFAULT_CONTENT,
        versions: [this.createVersion(DEFAULT_CONTENT)]
      });
    }

    return this.rooms.get(roomId);
  }

  getState(roomId) {
    const room = this.ensureRoom(roomId);
    return {
      content: room.content,
      versions: [...room.versions]
    };
  }

  applyUpdate(roomId, content, author = 'anonymous') {
    const room = this.ensureRoom(roomId);
    room.content = content;
    room.versions.push(this.createVersion(content, author));

    if (room.versions.length > this.maxVersions) {
      room.versions = room.versions.slice(room.versions.length - this.maxVersions);
    }

    return this.getState(roomId);
  }

  restoreVersion(roomId, versionId, author = 'anonymous') {
    const room = this.ensureRoom(roomId);
    const found = room.versions.find((version) => version.id === versionId);

    if (!found) {
      return null;
    }

    return this.applyUpdate(roomId, found.content, `${author} (restore)`);
  }

  createVersion(content, author = 'system') {
    return {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      content,
      author,
      timestamp: new Date().toISOString()
    };
  }
}

export { DEFAULT_CONTENT };
