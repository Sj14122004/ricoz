import { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';

interface Props {
  label: string;
  hint?: string;
  children: ReactNode;
}

export function Field({ label, hint, children }: Props) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

export function TextInput({ label, hint, ...rest }: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return <Field label={label} hint={hint}><input className="input" {...rest} /></Field>;
}

export function TextArea({ label, hint, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; hint?: string }) {
  return <Field label={label} hint={hint}><textarea className="input min-h-[88px]" {...rest} /></Field>;
}
