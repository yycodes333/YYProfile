'use client';

import { useState } from 'react';

const FIELDS = [
  { name: 'name', label: '你的姓名', type: 'text', autoComplete: 'name' },
  { name: 'email', label: '你的邮箱', type: 'email', autoComplete: 'email' },
  { name: 'subject', label: '主题', type: 'text', autoComplete: 'off' },
] as const;

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get('name') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      subject: String(data.get('subject') ?? '').trim(),
      message: String(data.get('message') ?? '').trim(),
    };

    setStatus('sending');
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result: { ok?: boolean; error?: string } = await response.json();

      if (!response.ok || !result.ok) {
        setStatus('error');
        setError(result.error ?? '发送失败，请稍后再试。');
        return;
      }

      setStatus('sent');
      form.reset();
    } catch {
      setStatus('error');
      setError('网络异常，请检查连接后重试。');
    }
  }

  const sending = status === 'sending';

  return (
    <form id="contact-form" className="contact-form" onSubmit={handleSubmit}>
      {FIELDS.map((field) => (
        <div className="contact-field" key={field.name}>
          <label className="visually-hidden" htmlFor={`contact-${field.name}`}>
            {field.label}
          </label>
          <input
            id={`contact-${field.name}`}
            name={field.name}
            type={field.type}
            placeholder={field.label}
            autoComplete={field.autoComplete}
            required
            disabled={sending}
          />
        </div>
      ))}

      <div className="contact-field">
        <label className="visually-hidden" htmlFor="contact-message">
          留言内容
        </label>
        <textarea
          id="contact-message"
          name="message"
          placeholder="留言内容"
          rows={6}
          required
          disabled={sending}
        />
      </div>

      <button className="button contact-submit" type="submit" disabled={sending}>
        {sending ? '发送中…' : '发送留言'}
      </button>

      <p className="contact-status" role="status" aria-live="polite">
        {status === 'sent' && '留言已发送，感谢你的来信，我会尽快回复。'}
        {status === 'error' && error}
      </p>
    </form>
  );
}
