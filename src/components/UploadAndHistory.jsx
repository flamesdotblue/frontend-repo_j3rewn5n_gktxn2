import React from 'react';
import { Image as ImageIcon, Trash2 } from 'lucide-react';

export default function UploadAndHistory({ image, onImageChange, onClearImage, gridSize, setGridSize }) {
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onImageChange({ file, url });
  };

  return (
    <section className="w-full">
      <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="text-sky-400" size={18} />
            <h2 className="text-slate-100 font-medium">Previous play snapshot</h2>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-500/10 text-sky-300 border border-sky-500/20 cursor-pointer hover:bg-sky-500/15">
              <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
              Upload
            </label>
            {image?.url && (
              <button onClick={onClearImage} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-300 border border-red-500/20 hover:bg-red-500/15">
                <Trash2 size={16} />
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-slate-800/40 flex items-center justify-center">
            {image?.url ? (
              <img src={image.url} alt="Previous play" className="w-full h-full object-contain" />
            ) : (
              <div className="text-slate-400 text-sm">No snapshot uploaded yet</div>
            )}
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-800/40 p-4">
            <label className="block text-sm text-slate-300 mb-2">Grid size</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={6}
                max={16}
                value={gridSize}
                onChange={(e) => setGridSize(parseInt(e.target.value, 10))}
                className="w-full"
              />
              <div className="px-3 py-1 rounded-md bg-slate-900/60 border border-white/10 text-slate-200 text-sm">
                {gridSize} x {gridSize}
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Adjust to match your current board before marking known safe/mine cells on the grid.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
