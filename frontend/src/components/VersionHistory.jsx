export function VersionHistory({ versions, onRestore }) {
  const sorted = [...versions].reverse();

  return (
    <section>
      <h2>Version History</h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: '260px', overflowY: 'auto' }}>
        {sorted.map((version) => (
          <li key={version.id} style={{ borderBottom: '1px solid #efefef', padding: '0.5rem 0' }}>
            <div>
              <strong>{version.author}</strong>
            </div>
            <div>{new Date(version.timestamp).toLocaleString()}</div>
            <button type="button" onClick={() => onRestore(version.id)}>
              Restore
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
