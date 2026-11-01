import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { Lock, Mail, User, Phone, CheckCircle, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';

interface AuthPagesProps {
  initialMode?: 'login' | 'signup' | 'forgot';
  onSuccess: (role: string) => void;
  onNavigatePolicy: (policy: 'privacy' | 'terms') => void;
}

export const AuthPages: React.FC<AuthPagesProps> = ({
  initialMode = 'login',
  onSuccess,
  onNavigatePolicy,
}) => {
  const { login, signup, isLoading } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'reset'>(initialMode);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+1 ');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'astrologer'>('customer');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Recovery states
  const [recoveryCode, setRecoveryCode] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Status
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email.trim(), password);
      const user = api.auth.getStoredUser();
      onSuccess(user?.role || 'customer');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (!agreeTerms) {
      setError('You must accept the Terms and Conditions to create an account.');
      return;
    }

    try {
      await signup({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        role,
      });
      const user = api.auth.getStoredUser();
      onSuccess(user?.role || role);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    }
  };

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await api.auth.recoverPassword(email.trim());
      setSuccessMsg(res.message);
      if (res.recoveryCode) {
        setRecoveryCode(res.recoveryCode);
        setTokenInput(res.recoveryCode);
      }
      setMode('reset');
    } catch (err: any) {
      setError(err.message || 'No account found with this email.');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    try {
      await api.auth.resetPassword(email.trim(), tokenInput.trim(), newPassword);
      setSuccessMsg('Your password has been reset successfully. Please log in.');
      setMode('login');
      setPassword(newPassword);
    } catch (err: any) {
      setError(err.message || 'Invalid or expired token.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 text-left">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-md">
        {/* Brand header */}
        <div className="text-center mb-6">
          <span className="text-2xl font-serif font-bold text-[#38243F] tracking-wide">
            LUMSIC
          </span>
          <p className="text-xs text-gray-500 mt-1">
            {mode === 'login'
              ? 'Sign in to access your consultations and wallet'
              : mode === 'signup'
              ? 'Create your confidential seeker or reader account'
              : mode === 'forgot'
              ? 'Password Recovery Verification'
              : 'Set Your New Secure Password'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1. LOGIN MODE */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF7F2] border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#38243F]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-gray-700">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setMode('forgot');
                  }}
                  className="text-[11px] text-[#38243F] hover:text-[#C6A66B] font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF7F2] border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#38243F]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-600">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded text-[#38243F]"
                />
                <span>Remember session</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#38243F] text-[#FAF7F2] font-semibold text-xs rounded-xl hover:bg-[#38243F]/90 transition-colors shadow-sm disabled:opacity-50"
            >
              {isLoading ? 'Verifying Credentials...' : 'Sign In to LUMSIC'}
            </button>

            <div className="text-center pt-3 border-t border-gray-100 text-xs text-gray-600">
              New to LUMSIC?{' '}
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setMode('signup');
                }}
                className="font-semibold text-[#38243F] hover:text-[#C6A66B]"
              >
                Create an Account
              </button>
            </div>
          </form>
        )}

        {/* 2. SIGNUP MODE */}
        {mode === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`py-2 text-xs font-semibold rounded-lg border text-center transition-colors ${
                    role === 'customer'
                      ? 'bg-[#38243F] text-white border-[#38243F]'
                      : 'bg-[#FAF7F2] text-gray-700 border-gray-300 hover:border-[#C6A66B]'
                  }`}
                >
                  Seeker / Client
                </button>
                <button
                  type="button"
                  onClick={() => setRole('astrologer')}
                  className={`py-2 text-xs font-semibold rounded-lg border text-center transition-colors ${
                    role === 'astrologer'
                      ? 'bg-[#38243F] text-white border-[#38243F]'
                      : 'bg-[#FAF7F2] text-gray-700 border-gray-300 hover:border-[#C6A66B]'
                  }`}
                >
                  Astrologer / Reader
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Full Legal Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF7F2] border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#38243F]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF7F2] border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#38243F]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                International Phone (with country code)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  placeholder="+1 415 555 0142"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF7F2] border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#38243F]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#38243F]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Confirm
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#38243F]"
                />
              </div>
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded text-[#38243F]"
                />
                <span>
                  I accept the{' '}
                  <button
                    type="button"
                    onClick={() => onNavigatePolicy('terms')}
                    className="text-[#38243F] font-semibold underline"
                  >
                    Terms
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    onClick={() => onNavigatePolicy('privacy')}
                    className="text-[#38243F] font-semibold underline"
                  >
                    Privacy Policy
                  </button>
                  .
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#38243F] text-[#FAF7F2] font-semibold text-xs rounded-xl hover:bg-[#38243F]/90 transition-colors shadow-sm disabled:opacity-50 mt-2"
            >
              {isLoading ? 'Creating Account...' : 'Complete Registration'}
            </button>

            <div className="text-center pt-2 border-t border-gray-100 text-xs text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setMode('login');
                }}
                className="font-semibold text-[#38243F] hover:text-[#C6A66B]"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* 3. FORGOT PASSWORD MODE */}
        {mode === 'forgot' && (
          <form onSubmit={handleRecover} className="space-y-4">
            <p className="text-xs text-gray-600">
              Enter your registered email address and we will dispatch a secure 6-digit recovery verification token.
            </p>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF7F2] border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#38243F]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-[#38243F] text-[#FAF7F2] font-semibold text-xs rounded-xl hover:bg-[#38243F]/90 transition-colors"
            >
              {isLoading ? 'Dispatching Token...' : 'Send Recovery Code'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-gray-500 hover:text-[#38243F] flex items-center justify-center gap-1 mx-auto"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Login</span>
              </button>
            </div>
          </form>
        )}

        {/* 4. RESET PASSWORD MODE */}
        {mode === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Verification Token / Code
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. 849201"
                  value={tokenInput}
                  onChange={e => setTokenInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF7F2] border border-gray-300 rounded-xl focus:outline-none font-mono tracking-widest text-center"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                New Secure Password
              </label>
              <input
                type="password"
                required
                placeholder="Minimum 6 characters"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#38243F]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-[#38243F] text-[#FAF7F2] font-semibold text-xs rounded-xl hover:bg-[#38243F]/90 transition-colors"
            >
              Update Password & Sign In
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-gray-500 hover:text-[#38243F]"
              >
                Cancel and return to login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
