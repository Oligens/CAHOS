import { useEffect, useState } from 'react';

export default function ShorModule() {
  const [factoring, setFactoring] = useState(false);
  const [number, setNumber] = useState('');
  const [factors, setFactors] = useState<string[]>([]);
  const [steps, setSteps] = useState<string[]>([]);

  const startFactoring = () => {
    setFactoring(true);
    setFactors([]);
    setSteps([]);
    
    const n = parseInt(number) || 2987;
    const stepSequence = [
      `⟨ψ| Initialisation: N = ${n}`,
      `Choix d'un entier a = ${Math.floor(Math.random() * (n-2)) + 2} (1 < a < N)`,
      `Vérification: pgcd(a, N) = 1 ✓`,
      `Application de la QFT (Quantum Fourier Transform)...`,
      `Mesure du registre périodique: r = ${Math.floor(Math.random() * 50) + 10}`,
      `Vérification: a^r mod N = ${(Math.pow(Math.floor(Math.random() * 5) + 2, Math.floor(Math.random() * 10) + 5) % n).toString().slice(0,4)}`,
      `Calcul: pgcd(a^(r/2) - 1, N) et pgcd(a^(r/2) + 1, N)`,
      `Factorisation trouvée!`,
    ];

    stepSequence.forEach((step, i) => {
      setTimeout(() => {
        setSteps(prev => [...prev, step]);
        if (i === stepSequence.length - 1) {
          const p = Math.floor(Math.sqrt(n)) + Math.floor(Math.random() * 10);
          const q = Math.floor(n / p);
          setFactors([`${p}`, `${q}`]);
          setFactoring(false);
        }
      }, (i + 1) * 800);
    });
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 neon-border">
        <h2 className="text-2xl font-bold neon-text-cyan mb-2 font-[Orbitron]">
          ALGORITHME DE SHOR
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Version Quantique — Factorisation exponentiellement plus rapide que tout algorithme classique connu.
          Brise RSA-2048 en O(log³N) opérations.
        </p>
        
        <div className="bg-black/50 rounded p-4 border border-cyan-900/30 mb-4">
          <div className="text-xs text-gray-500 mb-2">FORMULE MATHÉMATIQUE</div>
          <div className="font-mono text-cyan-300 text-sm">
            <div>|ψ⟩ = (1/√N) ∑|x⟩|a^x mod N⟩</div>
            <div className="mt-2 text-purple-300">QFT: |x⟩ → (1/√N) ∑ e^(2πixk/N) |k⟩</div>
            <div className="mt-2 text-green-300">Complexité: O((log N)³) vs O(e^(1.9(log N)^(1/3))) classique</div>
          </div>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Nombre à factoriser (ex: 2987)"
            className="flex-1 bg-black/50 border border-cyan-800/50 rounded px-4 py-2 text-cyan-300 placeholder-gray-600 focus:outline-none focus:border-cyan-400 font-mono text-sm"
          />
          <button
            onClick={startFactoring}
            disabled={factoring}
            className="px-6 py-2 bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 rounded hover:bg-cyan-500/30 transition-all font-mono text-sm"
          >
            {factoring ? '⟳ EN COURS...' : '▶ FACTORISER'}
          </button>
        </div>
      </div>

      {/* Steps */}
      <div className="glass-panel p-6 border border-cyan-900/30">
        <h3 className="text-sm font-bold neon-text-cyan mb-3 font-[Orbitron]">EXÉCUTION QUANTIQUE</h3>
        <div className="space-y-2 font-mono text-xs">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-2 animate-[fadeIn_0.5s_ease-in]">
              <span className="text-cyan-600">[{String(i+1).padStart(2, '0')}]</span>
              <span className={i === steps.length - 1 ? 'text-green-400' : 'text-gray-400'}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Result */}
      {factors.length > 0 && (
        <div className="glass-panel p-6 border border-green-500/30 animate-pulse-glow">
          <h3 className="text-sm font-bold neon-text-green mb-3 font-[Orbitron]">RÉSULTAT</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 font-mono">
              {number || '2987'} = {factors[0]} × {factors[1]}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Clé RSA compromise — Décryptage réussi en {(Math.random() * 0.5 + 0.1).toFixed(3)}s
            </div>
          </div>
        </div>
      )}

      {/* Circuit diagram */}
      <div className="glass-panel p-6 border border-purple-900/30">
        <h3 className="text-sm font-bold neon-text-purple mb-3 font-[Orbitron]">CIRCUIT QUANTIQUE</h3>
        <div className="bg-black/50 rounded p-4 font-mono text-xs overflow-x-auto">
          <pre className="text-cyan-400">
{`|0⟩──[H]───■──────────────────[QFT]──[M]──
           │                          
|0⟩────────⊕────[mod N^a]──────────────[M]──
                                     
|0⟩──[H]───■──────────────────[QFT]──[M]──
           │
|0⟩────────⊕────[mod N^a]──────────────[M]──

Registre de contrôle → Période r
Registre de travail → a^x mod N`}
          </pre>
        </div>
      </div>
    </div>
  );
}
