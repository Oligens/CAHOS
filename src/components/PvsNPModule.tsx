import { useState } from 'react';
import { generateSAT, solveDPLL, generateReductionProof, type SATProblem, type SolveResult } from '../engines/satEngine';

export default function PvsNPModule() {
  const [solving, setSolving] = useState(false);
  const [result, setResult] = useState<SolveResult | null>(null);
  const [problem, setProblem] = useState<SATProblem | null>(null);
  const [proof, setProof] = useState<string[]>([]);
  const [numVars, setNumVars] = useState(10);
  const [numClauses, setNumClauses] = useState(30);

  const solve = () => {
    setSolving(true);
    setResult(null);
    setProof([]);
    
    // Générer un problème SAT
    const sat = generateSAT(numVars, numClauses);
    setProblem(sat);
    
    // Résoudre avec un délai pour l'effet visuel
    setTimeout(() => {
      const solveResult = solveDPLL(sat);
      setResult(solveResult);
      
      // Générer la preuve de réduction
      const proofSteps = generateReductionProof();
      let i = 0;
      const interval = setInterval(() => {
        if (i < proofSteps.length) {
          setProof(prev => [...prev, proofSteps[i]]);
          i++;
        } else {
          clearInterval(interval);
          setSolving(false);
        }
      }, 800);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 neon-border">
        <h2 className="text-2xl font-bold neon-text-purple mb-2 font-[Orbitron]">
          MOTEUR P vs NP — SOLVEUR SAT
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Solveur DPLL fonctionnel pour le problème de satisfiabilité booléenne (NP-complet).
          Génère et résout des instances 3-SAT avec backtracking et propagation unitaire.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Nombre de variables</label>
            <input
              type="number"
              value={numVars}
              onChange={(e) => setNumVars(parseInt(e.target.value) || 10)}
              min={3}
              max={25}
              className="w-full bg-black/50 border border-purple-800/50 rounded px-4 py-2 text-purple-300 focus:outline-none focus:border-purple-400 font-mono text-sm"
              disabled={solving}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Nombre de clauses</label>
            <input
              type="number"
              value={numClauses}
              onChange={(e) => setNumClauses(parseInt(e.target.value) || 30)}
              min={5}
              max={100}
              className="w-full bg-black/50 border border-purple-800/50 rounded px-4 py-2 text-purple-300 focus:outline-none focus:border-purple-400 font-mono text-sm"
              disabled={solving}
            />
          </div>
        </div>

        <button
          onClick={solve}
          disabled={solving}
          className="w-full px-6 py-3 bg-purple-500/20 text-purple-300 border border-purple-400/50 rounded hover:bg-purple-500/30 transition-all font-mono text-sm disabled:opacity-50"
        >
          {solving ? '⟳ RÉSOLUTION EN COURS...' : '▶ GÉNÉRER ET RÉSUDRE'}
        </button>
      </div>

      {/* Problem display */}
      {problem && (
        <div className="glass-panel p-6 border border-purple-900/30">
          <h3 className="text-sm font-bold neon-text-purple mb-3 font-[Orbitron]">
            PROBLÈME 3-SAT GÉNÉRÉ
          </h3>
          <div className="bg-black/50 rounded p-4 font-mono text-xs max-h-48 overflow-y-auto">
            <div className="text-gray-500 mb-2">
              Variables: x₁...x{problem.numVars} | Clauses: {problem.clauses.length}
            </div>
            {problem.clauses.slice(0, 15).map((clause, i) => (
              <div key={i} className="text-purple-300">
                C{i+1}: ({clause.literals.map(l => l > 0 ? `x${l}` : `¬x${Math.abs(l)}`).join(' ∨ ')})
              </div>
            ))}
            {problem.clauses.length > 15 && (
              <div className="text-gray-600">... et {problem.clauses.length - 15} autres clauses</div>
            )}
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className={`glass-panel p-6 border ${result.satisfiable ? 'border-green-500/30' : 'border-red-500/30'}`}>
          <h3 className={`text-sm font-bold mb-3 font-[Orbitron] ${result.satisfiable ? 'neon-text-green' : 'neon-text-cyan'}`}>
            RÉSULTAT
          </h3>
          <div className="space-y-3">
            <div className="text-center">
              <div className={`text-3xl font-bold font-[Orbitron] ${result.satisfiable ? 'text-green-400' : 'text-red-400'}`}>
                {result.satisfiable ? 'SATISFIABLE ✓' : 'NON SATISFIABLE ✗'}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-black/30 rounded p-2 border border-gray-800">
                <div className="text-gray-500">États explorés</div>
                <div className="text-purple-400 font-mono">{result.stepsExplored.toLocaleString()}</div>
              </div>
              <div className="bg-black/30 rounded p-2 border border-gray-800">
                <div className="text-gray-500">Temps de résolution</div>
                <div className="text-cyan-400 font-mono">{result.time.toFixed(3)} ms</div>
              </div>
              <div className="bg-black/30 rounded p-2 border border-gray-800">
                <div className="text-gray-500">Complexité effective</div>
                <div className="text-green-400 font-mono">O(2^{`{${Math.log2(result.stepsExplored + 1).toFixed(1)}}`})</div>
              </div>
            </div>

            {result.assignment && (
              <div className="bg-black/30 rounded p-3 border border-gray-800">
                <div className="text-xs text-gray-500 mb-2">Assignation satisfaisante:</div>
                <div className="font-mono text-xs text-green-300 flex flex-wrap gap-1">
                  {result.assignment.map((val, i) => (
                    <span key={i} className={`px-1 rounded ${val ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                      x{i+1}={val ? 'T' : 'F'}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Proof */}
      {proof.length > 0 && (
        <div className="glass-panel p-6 border border-purple-900/30">
          <h3 className="text-sm font-bold neon-text-purple mb-3 font-[Orbitron]">PREUVE DE RÉDUCTION POLYNOMIALE</h3>
          <div className="space-y-2 font-mono text-xs">
            {proof.map((step, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-purple-600">[{String(i+1).padStart(2, '0')}]</span>
                <span className="text-gray-300">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Implications */}
      <div className="glass-panel p-6 border border-purple-900/30">
        <h3 className="text-sm font-bold neon-text-purple mb-3 font-[Orbitron]">IMPLICATIONS SI P = NP</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { title: "Cryptographie", desc: "RSA, AES, ECC → tous cassables en polynomial", icon: "🔓" },
            { title: "Optimisation", desc: "Logistique, planification → solutions optimales instantanées", icon: "📊" },
            { title: "IA & Apprentissage", desc: "Entraînement optimal de tout modèle en polynomial", icon: "🧠" },
            { title: "Biologie", desc: "Repliement des protéines → résolu exactement", icon: "🧬" },
            { title: "Mathématiques", desc: "Preuves automatisées de tout théorème vérifiable", icon: "📐" },
            { title: "Décryptage", desc: "Tout mot de passe → deviné en temps polynomial", icon: "🗝️" },
          ].map((item, i) => (
            <div key={i} className="bg-black/30 rounded p-3 border border-purple-900/20">
              <div className="flex items-center gap-2 mb-1">
                <span>{item.icon}</span>
                <span className="text-xs text-purple-300 font-bold">{item.title}</span>
              </div>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
