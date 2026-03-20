export function EditorPane({ content, onChange }) {
  return (
    <section>
      <h2>Editor</h2>
      <textarea
        aria-label="Markdown editor"
        value={content}
        onChange={(event) => onChange(event.target.value)}
        style={{ width: '100%', minHeight: '320px', padding: '0.75rem', fontFamily: 'monospace' }}
      />
    </section>
  );
}
