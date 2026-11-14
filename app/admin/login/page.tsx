import Link from 'next/link';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';

interface AdminLoginPageProps {
  searchParams: Promise<{ reason?: string }>;
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const { reason } = await searchParams;

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#B9C9D5]">Showroom management</p>
        <h1 className="mt-2 text-2xl font-bold">Admin sign in</h1>
        <p className="mt-2 text-sm text-[#C2C7D0]">Use an administrator account to manage categories, catalog items, and images.</p>
      </div>
      {reason === 'not-admin' && (
        <p role="alert" className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
          This account is not authorized as an admin. Ask the project owner to add it to the admin list.
        </p>
      )}
      <div className="rounded-xl border border-[#31353C] bg-[#181C22] p-5">
        <AdminLoginForm />
      </div>
      <Link href="/" className="text-sm text-[#C2C7D0] hover:text-white">← Return to showroom</Link>
    </div>
  );
}
