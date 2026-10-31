import type { ReactNode } from 'react';

interface NumberFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  /** Shown directly under the field, in place of the hint. */
  error?: string;
  hint?: ReactNode;
  prefix?: string;
  suffix?: string;
}

/**
 * A text input for numbers. It is deliberately not type="number": that type
 * silently drops letters and "e", so the field could show one value while
 * holding another. Here what the trader sees is exactly what is validated.
 */
export function NumberField({ id, label, value, onChange, onBlur, error, hint, prefix, suffix }: NumberFieldProps) {
  const messageId = `${id}-message`;
  return (
    <div className={`field${error ? ' field--error' : ''}`}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <div className={`field__control${prefix ? ' has-prefix' : ''}${suffix ? ' has-suffix' : ''}`}>
        {prefix && (
          <span className="field__affix field__affix--prefix" aria-hidden="true">
            {prefix}
          </span>
        )}
        <input
          id={id}
          name={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          maxLength={24}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? messageId : undefined}
        />
        {suffix && (
          <span className="field__affix field__affix--suffix" aria-hidden="true">
            {suffix}
          </span>
        )}
      </div>
      {error ? (
        <p className="field__error" id={messageId}>
          <ErrorIcon />
          {error}
        </p>
      ) : hint ? (
        <p className="field__hint" id={messageId}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function ErrorIcon() {
  return (
    <svg className="field__error-icon" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <circle cx="8" cy="8" r="7" fill="currentColor" />
      <rect x="7.1" y="3.6" width="1.8" height="5.6" rx="0.9" fill="var(--surface)" />
      <circle cx="8" cy="11.6" r="1.05" fill="var(--surface)" />
    </svg>
  );
}
