import React from 'react';
import { Brain, Shuffle, Target } from 'lucide-react';

export default function StrategyControls({ options, setOptions, onPredict, disabled }) {
  const update = (patch) => setOptions((prev) => ({ ...prev, ...patch }));

  return (
    <section className="w-full">
      <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="text-violet-400" size={18} />
            <h2 className="text-slate-100 font-medium">Strategy</h2>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-white/10 bg-slate-800/40 p-4">
            <label className="text-sm text-slate-300">Reverse psychology</label>
            <p className="text-xs text-slate-400 mb-3">Favor less obvious moves to avoid traps.</p>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(options.reversePsychology * 100)}
              onChange={(e) => update({ reversePsychology: parseInt(e.target.value, 10) / 100 })}
              className="w-full"
            />
            <div className="text-xs text-slate-300 mt-2">{Math.round(options.reversePsychology * 100)}%</div>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-800/40 p-4">
            <label className="text-sm text-slate-300">Risk tolerance</label>
            <p className="text-xs text-slate-400 mb-3">Lower prefers safer but potentially slower options.</p>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(options.riskTolerance * 100)}
              onChange={(e) => update({ riskTolerance: parseInt(e.target.value, 10) / 100 })}
              className="w-full"
            />
            <div className="text-xs text-slate-300 mt-2">{Math.round(options.riskTolerance * 100)}%</div>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-800/40 p-4">
            <label className="text-sm text-slate-300">Pattern bias</label>
            <p className="text-xs text-slate-400 mb-3">Learn from your recent safe/mine pattern.</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => update({ patternBias: 'recent' })}
                className={`px-3 py-1.5 rounded-md border text-sm ${options.patternBias === 'recent' ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' : 'bg-slate-900/60 border-white/10 text-slate-300'}`}
              >Recent</button>
              <button
                onClick={() => update({ patternBias: 'balanced' })}
                className={`px-3 py-1.5 rounded-md border text-sm ${options.patternBias === 'balanced' ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' : 'bg-slate-900/60 border-white/10 text-slate-300'}`}
              >Balanced</button>
              <button
                onClick={() => update({ patternBias: 'explore' })}
                className={`px-3 py-1.5 rounded-md border text-sm ${options.patternBias === 'explore' ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' : 'bg-slate-900/60 border-white/10 text-slate-300'}`}
              >Explore</button>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-3">
          <button
            onClick={onPredict}
            disabled={disabled}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-800/60 border-white/10 text-slate-400' : 'bg-violet-600/20 border-violet-500/40 text-violet-200 hover:bg-violet-600/25'}`}
          >
            <Target size={16} />
            Predict next safe plays
          </button>
          <button
            onClick={() => setOptions({ reversePsychology: 0.35, riskTolerance: 0.25, patternBias: 'balanced' })}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium bg-slate-800/60 border-white/10 text-slate-300 hover:bg-slate-800"
          >
            <Shuffle size={16} />
            Reset
          </button>
        </div>
      </div>
    </section>
  );
}
