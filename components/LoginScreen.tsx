import React, { useState } from 'react';
import { User, Theme } from '../types';
import { login } from '../services/authService';
import { Lock, ArrowRight, Loader2, ShieldCheck, Briefcase, Eye } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: User) => void;
  theme?: Theme;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, theme = 'dark' }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isDark = theme === 'dark';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const user = await login(username);
      onLogin(user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = (name: string) => {
    setUsername(name);
  };

  const containerClass = isDark ? 'bg-slate-950 text-slate-200' : 'bg-gray-50 text-gray-900';
  const cardClass = isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/90 border-gray-200 shadow-xl';
  const inputClass = isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900';
  const quickLoginBtnClass = isDark ? 'bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900';

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden ${containerClass}`}>
      
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[100px]" />

      <div className={`w-full max-w-md backdrop-blur-xl p-8 rounded-2xl border relative z-10 ${cardClass}`}>
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-4 border border-indigo-500/20">
            <Lock className="w-8 h-8 text-indigo-500" />
          </div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Lumina Workspace</h1>
          <p className="text-slate-500 text-sm mt-1">Secure RAG Knowledge Base</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all ${inputClass}`}
              placeholder="Enter username..."
              autoFocus
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !username}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-indigo-500/20"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                Sign In <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className={`mt-8 pt-6 border-t ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
          <p className="text-xs text-center text-slate-500 mb-4">Or try a demo account:</p>
          <div className="grid grid-cols-3 gap-3">
            <button onClick={() => quickLogin('admin')} className={`flex flex-col items-center gap-2 p-2 rounded-lg border border-transparent transition-all group ${quickLoginBtnClass}`}>
              <ShieldCheck className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-medium">Admin</span>
            </button>
            <button onClick={() => quickLogin('manager_jane')} className={`flex flex-col items-center gap-2 p-2 rounded-lg border border-transparent transition-all group ${quickLoginBtnClass}`}>
              <Briefcase className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-medium">Manager</span>
            </button>
            <button onClick={() => quickLogin('viewer_bob')} className={`flex flex-col items-center gap-2 p-2 rounded-lg border border-transparent transition-all group ${quickLoginBtnClass}`}>
              <Eye className="w-5 h-5 text-green-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-medium">Viewer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;