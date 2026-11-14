'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const { error } = await createClient().auth.signInWithPassword({ email, password });
    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    router.replace('/admin');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-[#C2C7D0]">Email</span>
        <input
          required
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-lg border border-[#31353C] bg-[#10141A] px-3 py-2.5 text-sm outline-none focus:border-[#B9C9D5]"
        />
      </label>
      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-[#C2C7D0]">Password</span>
        <input
          required
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-lg border border-[#31353C] bg-[#10141A] px-3 py-2.5 text-sm outline-none focus:border-[#B9C9D5]"
        />
      </label>
      {errorMessage && (
        <p role="alert" className="text-sm text-red-400">
          {errorMessage}
        </p>
      )}
      <button
        disabled={isSubmitting}
        className="w-full rounded-lg bg-[#B9C9D5] px-4 py-2.5 text-sm font-semibold text-[#10141A] disabled:opacity-60"
      >
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
