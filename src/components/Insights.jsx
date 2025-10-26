import React from 'react';
import { Lightbulb } from 'lucide-react';

export default function Insights({ insights }) {
  return (
    <section className="w-full">
      <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="text-amber-400" size={18} />
          <h2 className="text-slate-100 font-medium">Rationale</h2>
        </div>
        {insights.length === 0 ? (
          <p className="text-sm text-slate-400">Make a prediction to see insights about why these moves look safe.</p>
        ) : (
          <ul className="space-y-2 list-disc pl-5 text-sm text-slate-200/90">
            {insights.map((line, idx) => (
              <li key={idx}>{line}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
