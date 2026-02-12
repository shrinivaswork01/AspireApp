
import React, { useState } from 'react';
import { Sparkles, MessageSquare, Instagram, FileText, Send, Loader2, TrendingUp, BarChart3, Lightbulb, Copy, Check } from 'lucide-react';
import { generateProposal, generateWhatsAppReply, generateInstagramCaption, generateBusinessInsights } from '../services/geminiService';
import { Insight } from '../types';

export const AIStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'proposal' | 'whatsapp' | 'social' | 'insights'>('proposal');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [insights, setInsights] = useState<Insight[]>([]);

  // Form States
  const [proposalData, setProposalData] = useState({ client: '', event: '', package: '', price: '' });
  const [query, setQuery] = useState('');
  const [socialPrompt, setSocialPrompt] = useState('');

  const handleTabChange = (tab: 'proposal' | 'whatsapp' | 'social' | 'insights') => {
    setActiveTab(tab);
    setOutput('');
    setInsights([]);
    setCopied(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateProposal = async () => {
    if (!proposalData.client || !proposalData.event) return;
    setLoading(true);
    try {
      const result = await generateProposal(proposalData.client, proposalData.event, proposalData.package, parseFloat(proposalData.price) || 0);
      setOutput(result || '');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateWhatsApp = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const result = await generateWhatsAppReply(query);
      setOutput(result || '');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSocial = async () => {
    if (!socialPrompt) return;
    setLoading(true);
    try {
      const result = await generateInstagramCaption(socialPrompt);
      setOutput(result || '');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInsights = async () => {
    setLoading(true);
    try {
      const summary = "Bookings: 24, Revenue: $12k, Conversion: 85%, Cancellation: 5%";
      const result = await generateBusinessInsights(summary);
      setInsights(result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="p-4 bg-indigo-600 text-white rounded-[2rem] shadow-xl shadow-indigo-100 ring-8 ring-indigo-50">
          <Sparkles size={32} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">AI Content Studio</h1>
        <p className="text-slate-500 max-w-lg font-medium">Elevate your studio's client experience with intelligent automation.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="flex bg-slate-50/50 p-2 border-b border-slate-100">
          <button 
            onClick={() => handleTabChange('proposal')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'proposal' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <FileText size={18} /> Proposal
          </button>
          <button 
            onClick={() => handleTabChange('whatsapp')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'whatsapp' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <MessageSquare size={18} /> WhatsApp
          </button>
          <button 
            onClick={() => handleTabChange('social')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'social' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <Instagram size={18} /> Social
          </button>
          <button 
            onClick={() => handleTabChange('insights')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'insights' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <TrendingUp size={18} /> Insights
          </button>
        </div>

        <div className="p-10">
          {activeTab === 'proposal' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-5">
                <div>
                  <label className="block text-[11px] font-bold text-black uppercase tracking-[0.2em] mb-2">Client Name</label>
                  <input value={proposalData.client} onChange={e => setProposalData({...proposalData, client: e.target.value})} type="text" placeholder="e.g. Sarah Johnson" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-black font-semibold focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-black uppercase tracking-[0.2em] mb-2">Event Type</label>
                  <input value={proposalData.event} onChange={e => setProposalData({...proposalData, event: e.target.value})} type="text" placeholder="e.g. Destination Wedding" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-black font-semibold focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 outline-none transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-black uppercase tracking-[0.2em] mb-2">Package</label>
                    <input value={proposalData.package} onChange={e => setProposalData({...proposalData, package: e.target.value})} type="text" placeholder="e.g. Platinum" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-black font-semibold focus:ring-4 focus:ring-indigo-50 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-black uppercase tracking-[0.2em] mb-2">Price ($)</label>
                    <input value={proposalData.price} onChange={e => setProposalData({...proposalData, price: e.target.value})} type="number" placeholder="2400" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-black font-semibold focus:ring-4 focus:ring-indigo-50 outline-none transition-all" />
                  </div>
                </div>
                <button onClick={handleGenerateProposal} disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-[0.98] disabled:opacity-50">
                  {loading ? <Loader2 className="animate-spin" /> : <><Sparkles size={20} /> Generate Luxury Proposal</>}
                </button>
              </div>
              <div className="bg-slate-50/80 rounded-[2rem] p-8 border border-slate-100 min-h-[400px] flex flex-col relative group">
                {output ? (
                  <>
                    <div className="flex-1 text-slate-700 font-medium leading-relaxed whitespace-pre-wrap text-sm">{output}</div>
                    <button 
                      onClick={() => copyToClipboard(output)} 
                      className="absolute bottom-6 right-6 p-3 bg-white border border-slate-200 rounded-xl text-indigo-600 shadow-sm hover:shadow-md transition-all active:scale-90"
                    >
                      {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                    </button>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-300 space-y-4">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm">
                      <FileText size={32} className="opacity-40" />
                    </div>
                    <p className="text-sm font-bold tracking-tight">Your proposal will appear here</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'whatsapp' && (
            <div className="space-y-8">
              <div>
                <label className="block text-[11px] font-bold text-black uppercase tracking-[0.2em] mb-3">Paste Inquiry Message</label>
                <textarea 
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="w-full px-6 py-6 bg-slate-50 border border-slate-200 rounded-[2rem] text-black font-semibold focus:ring-4 focus:ring-indigo-50 outline-none transition-all h-40 resize-none"
                  placeholder="Hey, can you send your price list for a birthday shoot next week?"
                />
              </div>
              <button onClick={handleGenerateWhatsApp} disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-700 shadow-lg disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin" /> : <><MessageSquare size={20} /> Draft Response</>}
              </button>
              {output && (
                <div className="bg-indigo-50/50 border border-indigo-100 rounded-[2rem] p-8 relative animate-in fade-in zoom-in-95">
                  <p className="text-indigo-900 font-semibold leading-relaxed">"{output}"</p>
                  <button onClick={() => copyToClipboard(output)} className="mt-6 flex items-center gap-2 text-xs font-bold text-indigo-600 bg-white px-4 py-2 rounded-xl shadow-sm hover:bg-indigo-50 transition-colors">
                    {copied ? <><Check size={14} /> Copied</> : <><Send size={14} /> Copy to WhatsApp</>}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-8">
              <div>
                <label className="block text-[11px] font-bold text-black uppercase tracking-[0.2em] mb-3">What's the Story Behind the Shot?</label>
                <textarea 
                  value={socialPrompt}
                  onChange={e => setSocialPrompt(e.target.value)}
                  className="w-full px-6 py-6 bg-slate-50 border border-slate-200 rounded-[2rem] text-black font-semibold focus:ring-4 focus:ring-indigo-50 outline-none transition-all h-40 resize-none"
                  placeholder="A cinematic shot of a couple walking through a rainy Parisian street at dusk..."
                />
              </div>
              <button onClick={handleGenerateSocial} disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-700 shadow-lg disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin" /> : <><Instagram size={20} /> Create Viral Caption</>}
              </button>
              {output && (
                <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-8 relative animate-in fade-in">
                  <p className="text-slate-800 font-medium whitespace-pre-wrap">{output}</p>
                  <button 
                    onClick={() => copyToClipboard(output)} 
                    className="mt-6 p-2 bg-white border border-slate-200 rounded-lg text-indigo-600"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-center p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 gap-6">
                <div className="flex gap-5">
                  <div className="p-4 bg-white rounded-2xl shadow-sm text-indigo-600"><BarChart3 size={28} /></div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Business Snapshot</h4>
                    <p className="text-sm text-indigo-600 font-bold">Performance & Growth Trends</p>
                  </div>
                </div>
                <button onClick={handleGenerateInsights} disabled={loading} className="w-full md:w-auto px-10 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-100">
                   {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />} Analyze Studio Data
                </button>
              </div>

              {insights.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4">
                  {insights.map((insight, idx) => (
                    <div key={idx} className={`p-6 rounded-3xl border ${
                      insight.type === 'positive' ? 'bg-emerald-50/50 border-emerald-100' : 
                      insight.type === 'action' ? 'bg-amber-50/50 border-amber-100' : 'bg-indigo-50/30 border-indigo-100'
                    }`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${
                           insight.type === 'positive' ? 'bg-emerald-100 text-emerald-600' : 
                           insight.type === 'action' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'
                        }`}>
                          {insight.type === 'positive' ? <TrendingUp size={16} /> : <Lightbulb size={16} />}
                        </div>
                        <h5 className="font-bold text-black text-sm">{insight.title}</h5>
                      </div>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">{insight.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
