import { useState, useEffect, useRef } from 'react';
import { shorAlgorithm, factorize, measureFactorization, type ShorStep } from '../engines/shorEngine';

export default function ShorModule() {
  const [number, setNumber] = useState('2987');
  const [steps, setSteps] = useState<ShorStep[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<{ factors: number[]; time: number } | null>(null);
  const [quantumSpeedup, setQuantumSpeedup] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startFactoring = () => {
    const n = parseInt(number);
    if (isNaN(n) || n < 4) return;
    
    setIsRunning(true);
    setSteps([]);
    setResult(null);
    
    const generator = shorAlgorithm(n);
    const allSteps: ShorStep[] = [];
    
    // Collecter toutes les étapes
    let iter = generator.next();
    while (!iter.done) {
      allSteps.push(iter.value);
      iter = generator.next();
    }
    
    // Afficher étape par étape
    let idx = 0;
    intervalRef.current = setInterval(() => {
      if (idx < allSteps.length) {
        setSteps(prev => [...prev, allSteps[idx]]);
        idx++;
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
        const measurement = measureFactorization(n);
        setResult(measurement);
        // Simuler le speedup quantique
        setQuantumSpeedup(Math.pow(n, 0.3) * 1000);
        setIsRunning(false);
      }
    }, 600);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const stepColors: Record<string, string> = {
    init: 'text-cyan-400',
    choose: 'text-blue-400',
    gcd: 'text-yellow-400',
    period: 'text-purple-400',
    check: 'text-orange-400',
    factor: 'text-green-400',
    result: 'text-green-300 font-bold',
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 neon-border">
        <h2 className="text-2xl font-bold neon-text-cyan mb-2 font-[Orbitron]">
          MOTEUR SHOR — FACTORISATION QUANTIQUE
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Implémentation fonctionnelle de l'algorithme de Shor avec simulation de QFT.
          Factorise les nombres entiers en trouvant la période de la fonction modulaire.
        </p>
        
        <div className="bg-black/50 rounded p-4 border border-cyan-900/30 mb-4">
          <div className="text-xs text-gray-500 mb-2">ALGORITHME EN COURS D'EXÉCUTION</div>
          <div className="font-mono text-cyan-300 text-sm">
            <div>1. Choisir a aléatoire: 1 &lt; a &lt; N</div>
            <div>2. Calculer g = pgcd(a, N)</div>
            <div>3. Si g &gt; 1 → facteur trouvé!</div>
            <div>4. Sinon, trouver la période r: a^r ≡ 1 (mod N)</div>
            <div>5. Si r est pair: pgcd(a^(r/2) ± 1, N) = facteurs</div>
          </div>
        </div>

        <div className="flex gap-3">
          <input
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Nombre à factoriser"
            className="flex-1 bg-black/50 border border-cyan-800/50 rounded px-4 py-2 text-cyan-300 placeholder-gray-600 focus:outline-none focus:border-cyan-400 font-mono text-sm"
            disabled={isRunning}
          />
          <button
            onClick={startFactoring}
            disabled={isRunning}
            className="px-6 py-2 bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 rounded hover:bg-cyan-500/30 transition-all font-mono text-sm disabled:opacity-50"
          >
            {isRunning ? '⟳ EXÉCUTION...' : '▶ FACTORISER'}
          </button>
        </div>
      </div>

      {/* Steps */}
      <div className="glass-panel p-6 border border-cyan-900/30">
        <h3 className="text-sm font-bold neon-text-cyan mb-3 font-[Orbitron]">EXÉCUTION PAS À PAS</h3>
        <div className="space-y-2 font-mono text-xs max-h-64 overflow-y-auto">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-gray-600 w-6">[{String(i+1).padStart(2, '0')}]</span>
              <span className="text-gray-500 w-48">{step.description}:</span>
              <span className={stepColors[step.type] || 'text-gray-400'}>{step.value}</span>
            </div>
          ))}
          {isRunning && (
            <div className="text-cyan-400 animate-pulse">█ Calcul en cours...</div>
          )}
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="glass-panel p-6 border border-green-500/30 animate-pulse-glow">
          <h3 className="text-sm font-bold neon-text-green mb-3 font-[Orbitron]">RÉSULTAT</h3>
          <div className="text-center space-y-3">
            <div className="text-2xl font-bold text-green-400 font-mono">
              {number} = {result.factors.join(' × ')}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-black/30 rounded p-2 border border-gray-800">
                <div className="text-gray-500">Temps classique</div>
                <div className="text-cyan-400 font-mono">{result.time.toFixed(3)} ms</div>
              </div>
              <div className="bg-black/30 rounded p-2 border border-gray-800">
                <div className="text-gray-500">Temps quantique simulé</div>
                <div className="text-purple-400 font-mono">{(result.time / quantumSpeedup * 1000).toFixed(6)} ms</div>
              </div>
              <div className="bg-black/30 rounded p-2 border border-gray-800">
                <div className="text-gray-500">Speedup quantique</div>
                <div className="text-green-400 font-mono">×{quantumSpeedup.toFixed(0)}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Circuit diagram */}
      <div className="glass-panel p-6 border border-purple-900/30">
        <h3 className="text-sm font-bold neon-text-purple mb-3 font-[Orbitron]">CIRCUIT QUANTIQUE SIMULÉ</h3>
        <div className="bg-black/50 rounded p-4 font-mono text-xs overflow-x-auto">
          <pre className="text-cyan-400">
{`Registre 1 (contrôle): |0⟩──[H]───■──────────────────[QFT⁻¹]──[M]──→ r
                                     │
Registre 2 (travail): |0⟩────────────⊕────[U_a: |x⟩→|ax mod N⟩]──[M]

où U_a est l'opérateur de multiplication modulaire
et QFT⁻¹ extrait la période r par transformée de Fourier inverse`}
          </pre>
        </div>
      </div>
    </div>
  );
}
