import React, { useMemo } from 'react';
import { ShieldCheck } from 'lucide-react';

const CellState = {
  UNKNOWN: 'unknown',
  SAFE: 'safe',
  MINE: 'mine',
};

export default function PredictionGrid({
  gridSize,
  cellStates,
  setCellStates,
  predicted,
  brush,
  setBrush,
}) {
  const handleCellClick = (r, c) => {
    setCellStates((prev) => {
      const next = prev.map((row) => row.slice());
      next[r][c] = brush;
      return next;
    });
  };

  const counts = useMemo(() => {
    let safe = 0, mine = 0;
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (cellStates[r][c] === CellState.SAFE) safe++;
        if (cellStates[r][c] === CellState.MINE) mine++;
      }
    }
    return { safe, mine };
  }, [cellStates, gridSize]);

  return (
    <section className="w-full">
      <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
            <h2 className="text-slate-100 font-medium">Mark known cells and review predictions</h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="px-2 py-1 rounded bg-slate-800/60 border border-white/10">Safe: {counts.safe}</span>
            <span className="px-2 py-1 rounded bg-slate-800/60 border border-white/10">Mines: {counts.mine}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-slate-400">Brush:</span>
          {[
            { key: CellState.SAFE, label: 'Safe', cls: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' },
            { key: CellState.MINE, label: 'Mine', cls: 'bg-rose-500/15 border-rose-500/40 text-rose-300' },
            { key: CellState.UNKNOWN, label: 'Unknown', cls: 'bg-slate-800/60 border-white/10 text-slate-300' },
          ].map((b) => (
            <button
              key={b.key}
              onClick={() => setBrush(b.key)}
              className={`px-3 py-1.5 rounded-md border text-xs ${brush === b.key ? b.cls : 'bg-slate-900/60 border-white/10 text-slate-300'}`}
            >
              {b.label}
            </button>
          ))}
        </div>

        <div
          className="grid rounded-xl overflow-hidden border border-white/10 bg-slate-800/40"
          style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: gridSize }).map((_, r) =>
            Array.from({ length: gridSize }).map((_, c) => {
              const key = `${r}-${c}`;
              const st = cellStates[r][c];
              const isPred = predicted?.has(key);
              let bg = 'bg-slate-900/50';
              let border = 'border-white/10';
              let text = 'text-slate-300';

              if (st === CellState.SAFE) {
                bg = 'bg-emerald-600/15';
                border = 'border-emerald-500/40';
                text = 'text-emerald-200';
              } else if (st === CellState.MINE) {
                bg = 'bg-rose-600/15';
                border = 'border-rose-500/40';
                text = 'text-rose-200';
              }

              const ring = isPred ? 'ring-2 ring-emerald-400/70' : '';

              return (
                <button
                  key={key}
                  onClick={() => handleCellClick(r, c)}
                  className={`aspect-square border ${border} ${bg} ${ring} hover:bg-slate-700/40 transition-colors flex items-center justify-center text-xs ${text}`}
                  title={isPred ? 'Suggested safe move' : 'Mark cell'}
                >
                  {isPred ? '✓' : ''}
                </button>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

export { CellState };
