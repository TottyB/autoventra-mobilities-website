import React, { useState } from 'react';
import { adminSignIn, isSupabaseConfigured } from '../../lib/supabase';
import { BRAND_INFO } from '../../data/autoventraData';
import { Lock, Mail, Key, ShieldCheck, AlertCircle, ArrowLeft, Loader2, ShieldAlert } from 'lucide-react';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onBackToSite: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onBackToSite,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await adminSignIn(email, password);

    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else if (res.user) {
      onLoginSuccess();
    }
  };

  const isConfigured = isSupabaseConfigured();

  return (
    <div className="min-h-screen bg-[#070707] text-white flex flex-col justify-center items-center px-4 py-12 select-none relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#e24b4a]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-zinc-800/20 rounded-full blur-3xl pointer-events-none" />

      {/* Return to Public Website */}
      <div className="w-full max-w-md mb-6 flex justify-between items-center z-10">
        <button
          onClick={onBackToSite}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#e24b4a]" />
          <span>Back to AutoVentraMotors</span>
        </button>

        <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">
          Authorized Staff Only
        </span>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#111111] border border-white/10 p-8 sm:p-10 shadow-2xl relative z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 border-b border-white/10 pb-6">
          <div className="w-12 h-12 bg-[#e24b4a]/10 border border-[#e24b4a]/30 text-[#e24b4a] mx-auto flex items-center justify-center mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold uppercase tracking-wider font-heading text-white">
            AutoVentraMotors Admin Portal
          </h1>
          <p className="text-xs text-white/50 font-mono">
            Secure Management Console & Inventory Control
          </p>
        </div>

        {!isConfigured && (
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Supabase Keys Required</strong>
              <p className="text-[11px] text-amber-300/80 mt-0.5">
                Please ensure <code className="bg-black/40 px-1 py-0.5 font-mono">VITE_SUPABASE_URL</code> and <code className="bg-black/40 px-1 py-0.5 font-mono">VITE_SUPABASE_ANON_KEY</code> are configured.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3.5 bg-red-950/50 border border-red-800/60 text-red-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#e24b4a]" />
            <div className="leading-relaxed">
              <strong className="block font-semibold text-white">Authentication Failed</strong>
              <span className="text-[11px] text-red-300">{error}</span>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/70 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <input
                id="admin-login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@autoventra.com"
                className="w-full pl-10 pr-4 py-3 bg-[#070707] border border-white/10 text-white placeholder-white/20 text-xs focus:outline-none focus:border-[#e24b4a] transition-colors"
              />
              <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/70 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="admin-login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#070707] border border-white/10 text-white placeholder-white/20 text-xs focus:outline-none focus:border-[#e24b4a] transition-colors"
              />
              <Key className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <button
            id="admin-login-submit-btn"
            type="submit"
            disabled={loading || !isConfigured}
            className="w-full py-3.5 px-4 bg-[#e24b4a] hover:bg-[#c53736] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer mt-2 shadow-lg shadow-red-950/50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Sign In to Admin</span>
              </>
            )}
          </button>
        </form>

        {/* Security Disclaimers */}
        <div className="pt-4 border-t border-white/10 text-[11px] text-white/40 space-y-1.5 text-center font-mono">
          <p>Protected by Supabase Auth with standard rate limiting.</p>
          <p className="text-[10px] text-white/30">
            Strict Row-Level Security active on database operations.
          </p>
        </div>
      </div>
    </div>
  );
};
