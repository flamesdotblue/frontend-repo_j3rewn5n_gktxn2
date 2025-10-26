import React from 'react';
import { Brain, ShieldCheck, Grid as GridIcon } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full border-b border-white/10 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center">
            <Brain size={22} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white tracking-tight">Mine Predictor</h1>
            <p className="text-xs text-slate-300/70">Reverse-psychology powered next-move advisor</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-slate-300/80 text-sm">
          <ShieldCheck size={16} className="text-emerald-400" />
          <span>Focus: safer plays</span>
          <GridIcon size={16} className="ml-3 text-sky-400" />
          <span>Adaptive grid</span>
        </div>
      </div>
    </header>
  );
}
