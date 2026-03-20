import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';

export function PreviewPane({ content }) {
  return (
    <section>
      <h2>Live Preview</h2>
      <div aria-label="Markdown preview" style={{ border: '1px solid #ddd', minHeight: '320px', padding: '1rem' }}>
        <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{content}</ReactMarkdown>
      </div>
    </section>
  );
}
