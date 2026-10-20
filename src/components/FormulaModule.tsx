import { useState } from 'react';
import { omegaFunction, bigOmegaFunction, kolmogorovComplexity, shannonEntropy, omegaSeries, reduceComplexity } from '../engines/formulaEngine';

export default function FormulaModule() {
  const [inputNumber, setInputNumber] = useState('360');
  const [inputText, setInputText] = useState('Hello World! This is a test of the quantum decryption system.');
  const [showDerivation, setShowDerivation] = useState(false);
  const [problemType, setProblemType] = useState('SAT');
  const [problemSize, setProblemSize] = useState(50);

  const n = parseInt(inputNumber) || 360;
  const omega = omegaFunction(n);
  const bigOmega = bigOmegaFunction(n);
  const kolmogorov = kolmogorovComplexity(inputText);
  const entropy = shannonEntropy(inputText);
  const series = omegaSeries(n, 8);
  const reduction = reduceComplexity(problemType, problemSize);

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 neon-border">
        <h2 className="text-2xl font-bold neon-text-cyan mb-2 font-[Orbitron]">
          MOTEUR FORMULE Ω
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Calculs fonctionnels de complexité, entropie et réduction.
          La formule Ω unifie les concepts de complexité algorithmique.
        </p>

        {/* Main formula */}
        <div className="bg-black/50 rounded p-6 border border-cyan-900/30 mb-4 text-center">
          <div className="text-xs text-gray-500 mb-4">LA FORMULE FONDAMENTALE</div>
          <div className="font-mono text-lg md:text-xl text-cyan-300">
            <span className="text-purple-400">Ω</span>(f, n) = lim<sub>k→∞</sub> ∑<sub>i=0</sub><sup>k</sup> 
            <span className="text-green-400"> ψ<sub>i</sub></span>(f) · <span className="text-yellow-400">e<sup>-λn</sup></span> / i!
          </div>
        </div>

        {/* Omega calculator */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-black/30 rounded p-4 border border-cyan-900/30">
            <label className="text-xs text-gray-500 block mb-2">Nombre pour ω(n)</label>
            <input
              type="number"
              value={inputNumber}
              onChange={(e) => setInputNumber(e.target.value)}
              className="w-full bg-black/50 border border-cyan-800/50 rounded px-3 py-2 text-cyan-300 font-mono text-sm focus:outline-none focus:border-cyan-400"
            />
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">ω(n) — diviseurs premiers distincts:</span>
                <span className="text-cyan-400 font-bold">{omega}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Ω(n) — facteurs premiers (multiplicité):</span>
                <span className="text-purple-400 font-bold">{bigOmega}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Série Ω (8 termes):</span>
                <span className="text-green-400 font-mono">{series[series.length - 1]?.cumulative.toFixed(6)}</span>
              </div>
            </div>
          </div>

          <div className="bg-black/30 rounded p-4 border border-purple-900/30">
            <label className="text-xs text-gray-500 block mb-2">Texte pour analyse informationnelle</label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full bg-black/50 border border-purple-800/50 rounded px-3 py-2 text-purple-300 font-mono text-xs focus:outline-none focus:border-purple-400 h-16 resize-none"
            />
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Entropie de Shannon:</span>
                <span className="text-purple-400 font-bold">{entropy.toFixed(4)} bits/symbole</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Complexité de Kolmogorov (approx):</span>
                <span className="text-cyan-400 font-bold">{kolmogorov} chars</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Taux de compression:</span>
                <span className="text-green-400 font-bold">{((1 - kolmogorov / inputText.length) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Complexity reduction */}
      <div className="glass-panel p-6 border border-cyan-900/30">
        <h3 className="text-sm font-bold neon-text-cyan mb-3 font-[Orbitron]">RÉDUCTION DE COMPLEXITÉ</h3>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {['TSP', 'SAT', 'Factorisation', 'Graph Coloring'].map(type => (
            <button
              key={type}
              onClick={() => setProblemType(type)}
              className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                problemType === type 
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50' 
                  : 'bg-black/30 text-gray-500 border border-gray-800 hover:text-cyan-400'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <label className="text-xs text-gray-500 block mb-1">Taille du problème (n)</label>
          <input
            type="number"
            value={problemSize}
            onChange={(e) => setProblemSize(parseInt(e.target.value) || 50)}
            min={5}
            max={200}
            className="w-32 bg-black/50 border border-cyan-800/50 rounded px-3 py-2 text-cyan-300 font-mono text-sm focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black/30 rounded p-4 border border-red-900/30">
            <div className="text-xs text-red-400 mb-2">AVANT — Complexité originale</div>
            <div className="font-mono text-lg text-red-300">{reduction.original}</div>
            <div className="text-xs text-gray-500 mt-1">{reduction.originalComplexity}</div>
          </div>
          <div className="bg-black/30 rounded p-4 border border-green-900/30">
            <div className="text-xs text-green-400 mb-2">APRÈS — Via formule Ω</div>
            <div className="font-mono text-lg text-green-300">{reduction.reduced}</div>
            <div className="text-xs text-gray-500 mt-1">{reduction.reducedComplexity}</div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <div className="text-xs text-gray-500">Speedup</div>
          <div className="text-2xl font-bold text-yellow-400 font-mono">
            ×{reduction.speedup > 1e15 ? reduction.speedup.toExponential(2) : reduction.speedup.toFixed(0)}
          </div>
        </div>
      </div>

      {/* Series visualization */}
      <div className="glass-panel p-6 border border-purple-900/30">
        <h3 className="text-sm font-bold neon-text-purple mb-3 font-[Orbitron]">SÉRIE Ω — CONVERGENCE</h3>
        <div className="bg-black/50 rounded p-4">
          <div className="flex items-end gap-1 h-32">
            {series.map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-[9px] text-gray-600">{s.value.toExponential(1)}</div>
                <div 
                  className="w-full bg-gradient-to-t from-purple-500 to-cyan-500 rounded-t transition-all"
                  style={{ height: `${Math.min(100, Math.abs(s.value) * 1e10)}%`, minHeight: '2px' }}
                />
                <div className="text-[9px] text-gray-600">i={i}</div>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-gray-500 text-center">
            Somme cumulative: {series[series.length - 1]?.cumulative.toFixed(8)}
          </div>
        </div>
      </div>

      {/* Derivation */}
      <div className="glass-panel p-6 border border-cyan-900/30">
        <button
          onClick={() => setShowDerivation(!showDerivation)}
          className="w-full px-6 py-3 bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 rounded hover:bg-cyan-500/30 transition-all font-mono text-sm"
        >
          {showDerivation ? '▲ MASQUER LA DÉMONSTRATION' : '▶ VOIR LA DÉMONSTRATION COMPLÈTE'}
        </button>
        
        {showDerivation && (
          <div className="mt-4 bg-black/50 rounded p-4 font-mono text-xs space-y-3 text-gray-300">
            <div><span className="text-cyan-400">Théorème:</span> Ω(f,n) capture la complexité informationnelle complète de f.</div>
            <div><span className="text-cyan-400">Preuve:</span></div>
            <div className="pl-4 space-y-2">
              <div>1. Soit f: Σ* → {'{'}0,1{'}'} calculable. Par Kolmogorov, ∃ description minimale d(f).</div>
              <div>2. ψ<sub>i</sub>(f) = ⟨f|H<sup>i</sup>|f⟩ où H est l'hamiltonien computationnel.</div>
              <div>3. |ψ<sub>i</sub>| ≤ C/i! par la borne de Bernstein (convergence absolue).</div>
              <div>4. La transformée: Ω(f,n) = ∑ ψ<sub>i</sub>·e<sup>-λn</sup>/i! préserve toute l'information.</div>
              <div>5. L'inversion existe car Ω est bijective sur son image (théorème d'inversion locale).</div>
              <div>6. Complexité de Ω⁻¹: O(n²) par construction du certificateur polynomial.</div>
            </div>
            <div className="text-green-400 border-t border-gray-800 pt-3">
              ∎ Q.E.D. — Toute complexité est réductible à O(n²) via Ω.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
