import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PreviewPane } from '../frontend/src/components/PreviewPane.jsx';

describe('PreviewPane security', () => {
  it('sanitizes unsafe HTML/script content to reduce XSS risk', () => {
    render(<PreviewPane content={'<script>alert("xss")</script><img src=x onerror=alert(1) />'} />);

    const preview = screen.getByLabelText('Markdown preview');

    expect(preview.innerHTML).not.toContain('<script>');
    expect(preview.innerHTML).not.toContain('onerror=');
  });
});
