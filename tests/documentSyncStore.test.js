import { describe, expect, it } from 'vitest';
import { DocumentSyncStore } from '../src/sync/documentSyncStore.js';

describe('DocumentSyncStore synchronization', () => {
  it('keeps room content in sync and appends history entries', () => {
    const store = new DocumentSyncStore(10);

    const initial = store.getState('room-1');
    expect(initial.versions).toHaveLength(1);

    const updated = store.applyUpdate('room-1', '# Title', 'alice');
    expect(updated.content).toBe('# Title');
    expect(updated.versions).toHaveLength(2);
    expect(updated.versions.at(-1)?.author).toBe('alice');
  });

  it('restores a previous version by id', () => {
    const store = new DocumentSyncStore(10);

    const first = store.applyUpdate('room-2', 'first edit', 'bob');
    const second = store.applyUpdate('room-2', 'second edit', 'bob');
    const targetVersionId = first.versions.at(-1)?.id;

    const restored = store.restoreVersion('room-2', targetVersionId, 'bob');

    expect(second.content).toBe('second edit');
    expect(restored?.content).toBe('first edit');
    expect(restored?.versions.at(-1)?.author).toContain('restore');
  });
});
