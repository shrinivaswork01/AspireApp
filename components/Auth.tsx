import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Loader2, Mail, Lock, UserPlus, LogIn, AlertCircle } from 'lucide-react';

export const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isSignUp) {
        // Sign up with metadata for the Trigger
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              full_name: fullName
            }
          }
        });

        if (error) throw error;
        
        setMessage({ 
          type: 'success', 
          text: 'Registration successful! If your account requires verification, check your email. Otherwise, you can log in now.' 
        });
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full -mr-40 -mt-40"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full -ml-40 -mb-40"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-200 mb-6">
            <span className="text-3xl font-black">A</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Aspire Studios</h1>
          <p className="text-slate-400 mt-3 font-bold uppercase tracking-widest text-[10px]">Studio Orchestration Platform</p>
        </div>

        <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
          <h2 className="text-2xl font-black text-slate-900 mb-8 text-center tracking-tight">
            {isSignUp ? 'Join the Studio' : 'Member Login'}
          </h2>

          <form onSubmit={handleAuth} className="space-y-5">
            {isSignUp && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">
                   Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-slate-900 font-bold focus:ring-4 focus:ring-indigo-50 transition-all"
                  placeholder="Shirinivas Kandkoor"
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest flex items-center gap-2">
                <Mail size={14} /> Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-slate-900 font-bold focus:ring-4 focus:ring-indigo-50 transition-all"
                placeholder="shirinivas@studio.com"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest flex items-center gap-2">
                <Lock size={14} /> Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-slate-900 font-bold focus:ring-4 focus:ring-indigo-50 transition-all"
                placeholder="••••••••"
              />
            </div>

            {message && (
              <div className={`p-4 rounded-2xl flex items-start gap-3 text-xs font-bold animate-in zoom-in-95 ${
                message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
              }`}>
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <p>{message.text}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black shadow-2xl shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : isSignUp ? (
                <><UserPlus size={24} /> Create Account</>
              ) : (
                <><LogIn size={24} /> Access Dashboard</>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <button
              onClick={() => { setIsSignUp(!isSignUp); setMessage(null); }}
              className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors"
            >
              {isSignUp ? 'Already a member? Sign In' : "New to Aspire? Sign Up"}
            </button>
          </div>
        </div>
        
        <p className="text-center mt-10 text-slate-300 text-[10px] font-black uppercase tracking-[0.2em]">
          &copy; 2025 Aspire Design Systems
        </p>
      </div>
    </div>
  );
};