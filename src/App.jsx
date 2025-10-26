import React, { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import UploadAndHistory from './components/UploadAndHistory';
import StrategyControls from './components/StrategyControls';
import PredictionGrid, { CellState } from './components/PredictionGrid';
import Insights from './components/Insights';

function makeGrid(n) {
  return Array.from({ length: n }, () => Array.from({ length: n }, () => CellState.UNKNOWN));
}

export default function App() {
  const [gridSize, setGridSize] = useState(8);
  const [cellStates, setCellStates] = useState(makeGrid(8));
  const [brush, setBrush] = useState(CellState.SAFE);
  const [image, setImage] = useState(null);

  const [options, setOptions] = useState({
    reversePsychology: 0.35,
    riskTolerance: 0.25,
    patternBias: 'balanced', // 'recent' | 'balanced' | 'explore'
  });

  useEffect(() => {
    setCellStates(makeGrid(gridSize));
  }, [gridSize]);

  const { safeCount, mineCount } = useMemo(() => {
    let safe = 0, mine = 0;
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (cellStates[r][c] === CellState.SAFE) safe++;
        if (cellStates[r][c] === CellState.MINE) mine++;
      }
    }
    return { safeCount: safe, mineCount: mine };
  }, [cellStates, gridSize]);

  const [predicted, setPredicted] = useState(new Set());
  const [insights, setInsights] = useState([]);

  const predict = () => {
    // Scoring grid: higher is safer
    const scores = Array.from({ length: gridSize }, () => Array.from({ length: gridSize }, () => 0));

    // Heuristic 1: Adjacent to confirmed safe increases score (local continuity)
    const dirs = [
      [1, 0], [-1, 0], [0, 1], [0, -1],
      [1, 1], [1, -1], [-1, 1], [-1, -1],
    ];

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (cellStates[r][c] !== CellState.UNKNOWN) continue;
        let safeAdj = 0, mineAdj = 0;
        for (const [dr, dc] of dirs) {
          const nr = r + dr, nc = c + dc;
          if (nr < 0 || nc < 0 || nr >= gridSize || nc >= gridSize) continue;
          if (cellStates[nr][nc] === CellState.SAFE) safeAdj++;
          if (cellStates[nr][nc] === CellState.MINE) mineAdj++;
        }
        // Base score
        scores[r][c] += safeAdj * 2 - mineAdj * 2.5;

        // Reverse psychology: prefer cells not surrounded by obvious clusters
        const clusterObviousness = Math.abs(safeAdj - mineAdj);
        const reverseBoost = (1 - Math.tanh(clusterObviousness)) * options.reversePsychology * 4;
        scores[r][c] += reverseBoost;

        // Risk tolerance: penalize adjacency to mines based on tolerance
        const riskPenalty = mineAdj * (1 + (1 - options.riskTolerance) * 2);
        scores[r][c] -= riskPenalty;
      }
    }

    // Heuristic 2: Pattern bias
    // Track recent streak (last 20 markings)
    const history = [];
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (cellStates[r][c] === CellState.SAFE) history.push('S');
        else if (cellStates[r][c] === CellState.MINE) history.push('M');
      }
    }
    const last = history.slice(-20);
    const sRatio = last.length ? last.filter((x) => x === 'S').length / last.length : 0.5;

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (cellStates[r][c] !== CellState.UNKNOWN) continue;
        if (options.patternBias === 'recent') {
          // If you've been hitting mines, boost conservative adjacency to safes
          scores[r][c] += (0.5 - sRatio) * 2;
        } else if (options.patternBias === 'explore') {
          // Encourage exploring cells with fewer known neighbors
          let knownAdj = 0;
          for (const [dr, dc] of dirs) {
            const nr = r + dr, nc = c + dc;
            if (nr < 0 || nc < 0 || nr >= gridSize || nc >= gridSize) continue;
            if (cellStates[nr][nc] !== CellState.UNKNOWN) knownAdj++;
          }
          scores[r][c] += (8 - knownAdj) * 0.15;
        }
      }
    }

    // Produce ranked list
    const candidates = [];
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (cellStates[r][c] !== CellState.UNKNOWN) continue;
        candidates.push({ key: `${r}-${c}`, r, c, score: scores[r][c] + Math.random() * 0.0001 });
      }
    }
    candidates.sort((a, b) => b.score - a.score);

    const suggestCount = Math.min(5, candidates.length);
    const top = new Set(candidates.slice(0, suggestCount).map((x) => x.key));
    setPredicted(top);

    const topAvg = candidates.slice(0, suggestCount).reduce((s, x) => s + x.score, 0) / (suggestCount || 1);
    const mineAdjAvg = candidates.slice(0, suggestCount).reduce((s, x) => {
      const [r, c] = x.key.split('-').map(Number);
      let m = 0;
      const dirs2 = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
      for (const [dr, dc] of dirs2) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= gridSize || nc >= gridSize) continue;
        if (cellStates[nr][nc] === CellState.MINE) m++;
      }
      return s + m;
    }, 0) / (suggestCount || 1);

    const lines = [];
    lines.push(`Suggested ${suggestCount} move${suggestCount === 1 ? '' : 's'} with an average safety score of ${topAvg.toFixed(2)}.`);
    if (options.reversePsychology > 0.4) lines.push('We leaned into reverse psychology, avoiding overly obvious clusters.');
    if (options.riskTolerance < 0.3) lines.push('Risk tolerance is low: heavily penalized tiles near confirmed mines.');
    if (options.patternBias === 'recent') lines.push('Adapted to your recent streak to counteract mine hits.');
    if (options.patternBias === 'explore') lines.push('Encouraged exploration into less-charted areas of the board.');
    lines.push(`On average, these picks have ${mineAdjAvg.toFixed(1)} adjacent confirmed mines.`);

    setInsights(lines);
  };

  const clearImage = () => setImage(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <UploadAndHistory
          image={image}
          onImageChange={setImage}
          onClearImage={clearImage}
          gridSize={gridSize}
          setGridSize={setGridSize}
        />

        <StrategyControls
          options={options}
          setOptions={setOptions}
          onPredict={predict}
          disabled={safeCount + mineCount === 0}
        />

        <PredictionGrid
          gridSize={gridSize}
          cellStates={cellStates}
          setCellStates={setCellStates}
          predicted={predicted}
          brush={brush}
          setBrush={setBrush}
        />

        <Insights insights={insights} />

        <div className="text-xs text-slate-400/80 pt-2">
          Note: This app offers heuristic guidance and does not guarantee safety. Combine with your own judgment.
        </div>
      </main>
    </div>
  );
}
