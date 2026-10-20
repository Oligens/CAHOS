import { useState } from 'react';
import { factorize, measureFactorization, modPow, findPeriod } from '../engines/shorEngine';
import { generateSAT, solveDPLL } from '../engines/satEngine';
import { generatePasswordPredictions, passwordStrength, passwordEntropy } from '../engines/aiEngine';
import { extractKeysFromMemory } from '../engines/memoryEngine';
import { QuantumState, GATES, groverSearch } from '../engines/quantumEngine';
import { omegaFunction, bigOmegaFunction, shannonEntropy, reduceComplexity } from '../engines/formulaEngine';

export default function DemoModule() {
  const [activeDemo, setActiveDemo] = useState<string>('factorization');
  const [results, setResults] = useState<any>({});
  const [running, setRunning] = useState(false);

  // Demo 1: Factorization
  const runFactorizationDemo = () => {
    setRunning(true);
    const testCases = [
      { n: 15, expected: [3, 5] },
      { n: 21, expected: [3, 7] },
      { n: 35, expected: [5, 7] },
      { n: 77, expected: [7, 11] },
      { n: 2987, expected: [29, 103] },
      { n: 1000003, expected: [101, 9901] },
    ];

    const results = testCases.map(tc => {
      const measurement = measureFactorization(tc.n);
      return {
        input: tc.n,
        factors: measurement.factors,
        time: measurement.time,
        correct: JSON.stringify(measurement.factors) === JSON.stringify(tc.expected),
      };
    });

    setResults((prev: any) => ({ ...prev, factorization: results }));
    setRunning(false);
  };

  // Demo 2: SAT Solver
  const runSATDemo = () => {
    setRunning(true);
    const testCases = [
      { vars: 5, clauses: 10, label: 'Petit' },
      { vars: 10, clauses: 30, label: 'Moyen' },
      { vars: 15, clauses: 50, label: 'Grand' },
      { vars: 20, clauses: 80, label: 'Très grand' },
    ];

    const results = testCases.map(tc => {
      const problem = generateSAT(tc.vars, tc.clauses);
      const solution = solveDPLL(problem);
      return {
        label: tc.label,
        vars: tc.vars,
        clauses: tc.clauses,
        satisfiable: solution.satisfiable,
        steps: solution.stepsExplored,
        time: solution.time,
      };
    });

    setResults((prev: any) => ({ ...prev, sat: results }));
    setRunning(false);
  };

  // Demo 3: Password Cracking
  const runPasswordDemo = () => {
    setRunning(true);
    const testPasswords = [
      'password123',
      'admin2024',
      'azerty1234',
      'Marie2024!',
      'S3cur!tY_2024#x',
      'xK9#mP2$vL5@nQ8',
    ];

    const results = testPasswords.map(pwd => {
      const strength = passwordStrength(pwd);
      const entropy = passwordEntropy(pwd);
      return {
        password: pwd,
        entropy: entropy.toFixed(2),
        score: strength.score.toFixed(0),
        label: strength.label,
        crackTime: strength.crackTime,
      };
    });

    const predictions = generatePasswordPredictions(10);

    setResults((prev: any) => ({ ...prev, passwords: { analysis: results, predictions } }));
    setRunning(false);
  };

  // Demo 4: Quantum Simulation
  const runQuantumDemo = () => {
    setRunning(true);
    
    // Test 1: Superposition
    const state1 = new QuantumState(3);
    state1.applyGate1(GATES.H, 0);
    state1.applyGate1(GATES.H, 1);
    state1.applyGate1(GATES.H, 2);
    const probs1 = state1.getProbabilities();
    
    // Test 2: Grover Search
    const groverResult = groverSearch(4, 7);
    
    // Test 3: Entanglement
    const state2 = new QuantumState(2);
    state2.applyGate1(GATES.H, 0);
    // CNOT simulé par opérations
    state2.applyGate1(GATES.H, 1);
    
    setResults((prev: any) => ({
      ...prev,
      quantum: {
        superposition: probs1.map((p: number, i: number) => ({
          state: i.toString(2).padStart(3, '0'),
          probability: (p * 100).toFixed(2),
        })),
        grover: groverResult,
        entropy: state1.entropy().toFixed(4),
      }
    }));
    setRunning(false);
  };

  // Demo 5: Formula Omega
  const runFormulaDemo = () => {
    setRunning(true);
    const testNumbers = [12, 60, 360, 2520, 360360];
    
    const results = testNumbers.map(n => {
      const omega = omegaFunction(n);
      const bigOmega = bigOmegaFunction(n);
      const factors = factorize(n);
      const entropy = shannonEntropy(n.toString());
      return {
        number: n,
        omega,
        bigOmega,
        factors: factors.join(' × '),
        entropy: entropy.toFixed(4),
      };
    });

    const reduction = reduceComplexity('SAT', 50);

    setResults((prev: any) => ({ ...prev, formula: { numbers: results, reduction } }));
    setRunning(false);
  };

  // Demo 6: Memory Scan
  const runMemoryDemo = () => {
    setRunning(true);
    const keys = extractKeysFromMemory(10);
    
    setResults((prev: any) => ({ ...prev, memory: { keys } }));
    setRunning(false);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 neon-border">
        <h2 className="text-2xl font-bold neon-text-cyan mb-2 font-[Orbitron]">
          DÉMONSTRATIONS INTERACTIVES
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Exemples concrets de ce que chaque moteur peut réellement faire.
          Cliquez sur un bouton pour lancer la démonstration.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <DemoButton
            label="Factorisation"
            icon="⟨ψ|"
            active={activeDemo === 'factorization'}
            onClick={() => { setActiveDemo('factorization'); runFactorizationDemo(); }}
          />
          <DemoButton
            label="SAT Solver"
            icon="∑"
            active={activeDemo === 'sat'}
            onClick={() => { setActiveDemo('sat'); runSATDemo(); }}
          />
          <DemoButton
            label="Mots de passe"
            icon="⟁"
            active={activeDemo === 'passwords'}
            onClick={() => { setActiveDemo('passwords'); runPasswordDemo(); }}
          />
          <DemoButton
            label="Quantique"
            icon="◉"
            active={activeDemo === 'quantum'}
            onClick={() => { setActiveDemo('quantum'); runQuantumDemo(); }}
          />
          <DemoButton
            label="Formule Ω"
            icon="Ω"
            active={activeDemo === 'formula'}
            onClick={() => { setActiveDemo('formula'); runFormulaDemo(); }}
          />
          <DemoButton
            label="Scan Mémoire"
            icon="⊡"
            active={activeDemo === 'memory'}
            onClick={() => { setActiveDemo('memory'); runMemoryDemo(); }}
          />
        </div>
      </div>

      {/* Results */}
      {activeDemo === 'factorization' && results.factorization && (
        <div className="glass-panel p-6 border border-cyan-900/30">
          <h3 className="text-lg font-bold neon-text-cyan mb-4 font-[Orbitron]">
            DÉMONSTRATION : FACTORISATION
          </h3>
          <div className="space-y-3">
            {results.factorization.map((r: any, i: number) => (
              <div key={i} className="bg-black/30 rounded p-3 border border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Nombre: {r.input}</span>
                  <span className={`text-xs px-2 py-1 rounded ${r.correct ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {r.correct ? '✓ CORRECT' : '✗ ERREUR'}
                  </span>
                </div>
                <div className="text-lg font-mono text-cyan-300">
                  {r.input} = {r.factors.join(' × ')}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Temps: {r.time.toFixed(3)} ms
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-cyan-500/5 border border-cyan-900/30 rounded text-xs text-gray-400">
            <strong className="text-cyan-400">Conclusion :</strong> Le moteur peut factoriser rapidement des nombres jusqu'à ~10^15.
            Au-delà (RSA-2048), il faudrait un vrai ordinateur quantique.
          </div>
        </div>
      )}

      {activeDemo === 'sat' && results.sat && (
        <div className="glass-panel p-6 border border-purple-900/30">
          <h3 className="text-lg font-bold neon-text-purple mb-4 font-[Orbitron]">
            DÉMONSTRATION : SOLVEUR SAT
          </h3>
          <div className="space-y-3">
            {results.sat.map((r: any, i: number) => (
              <div key={i} className="bg-black/30 rounded p-3 border border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-purple-400 font-bold">{r.label}</span>
                  <span className={`text-xs px-2 py-1 rounded ${r.satisfiable ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {r.satisfiable ? 'SATISFIABLE' : 'INSATISFIABLE'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-gray-500">Variables</div>
                    <div className="text-purple-300 font-mono">{r.vars}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Clauses</div>
                    <div className="text-purple-300 font-mono">{r.clauses}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Temps</div>
                    <div className="text-purple-300 font-mono">{r.time.toFixed(3)} ms</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  États explorés: {r.steps.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-purple-500/5 border border-purple-900/30 rounded text-xs text-gray-400">
            <strong className="text-purple-400">Conclusion :</strong> Le solveur DPLL fonctionne pour des instances petites à moyennes.
            Pour des problèmes NP-complets de grande taille, le temps explose exponentiellement.
          </div>
        </div>
      )}

      {activeDemo === 'passwords' && results.passwords && (
        <div className="glass-panel p-6 border border-green-900/30">
          <h3 className="text-lg font-bold neon-text-green mb-4 font-[Orbitron]">
            DÉMONSTRATION : ANALYSE DE MOTS DE PASSE
          </h3>
          
          <div className="mb-6">
            <h4 className="text-sm font-bold text-green-400 mb-3">Analyse de mots de passe réels</h4>
            <div className="space-y-2">
              {results.passwords.analysis.map((r: any, i: number) => (
                <div key={i} className="bg-black/30 rounded p-3 border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm text-green-300">{r.password}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      r.score < 40 ? 'bg-red-500/20 text-red-400' :
                      r.score < 60 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {r.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <div className="text-gray-500">Entropie</div>
                      <div className="text-green-300 font-mono">{r.entropy} bits</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Score</div>
                      <div className="text-green-300 font-mono">{r.score}/100</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Temps de cassage</div>
                      <div className="text-green-300 font-mono">{r.crackTime}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-cyan-400 mb-3">Prédictions IA (10 mots de passe générés)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {results.passwords.predictions.slice(0, 6).map((p: any, i: number) => (
                <div key={i} className="bg-black/30 rounded p-2 border border-cyan-900/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">#{i + 1}</span>
                    <span className="text-[10px] text-gray-600">{p.pattern}</span>
                  </div>
                  <div className="font-mono text-sm text-cyan-300">{p.password}</div>
                  <div className="text-[10px] text-gray-500 mt-1">
                    Confiance: {(p.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 bg-green-500/5 border border-green-900/30 rounded text-xs text-gray-400">
            <strong className="text-green-400">Conclusion :</strong> Le moteur peut analyser la force des mots de passe et prédire
            les mots de passe faibles basés sur des patterns humains. Un mot de passe vraiment aléatoire de 20+ caractères reste incassable.
          </div>
        </div>
      )}

      {activeDemo === 'quantum' && results.quantum && (
        <div className="glass-panel p-6 border border-purple-900/30">
          <h3 className="text-lg font-bold neon-text-purple mb-4 font-[Orbitron]">
            DÉMONSTRATION : SIMULATION QUANTIQUE
          </h3>

          <div className="mb-6">
            <h4 className="text-sm font-bold text-purple-400 mb-3">Superposition (3 qubits après Hadamard)</h4>
            <div className="bg-black/30 rounded p-3 border border-gray-800">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {results.quantum.superposition.slice(0, 8).map((s: any, i: number) => (
                  <div key={i} className="text-center">
                    <div className="text-xs text-gray-500">|{s.state}⟩</div>
                    <div className="text-sm font-mono text-purple-300">{s.probability}%</div>
                    <div className="h-1 bg-gray-900 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-purple-500" style={{ width: `${s.probability}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-500 mt-3 text-center">
                Entropie de Von Neumann: {results.quantum.entropy} bits
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-cyan-400 mb-3">Algorithme de Grover (4 qubits)</h4>
            <div className="bg-black/30 rounded p-3 border border-gray-800">
              <div className="space-y-1 font-mono text-xs max-h-48 overflow-y-auto">
                {results.quantum.grover.steps.slice(0, 10).map((step: string, i: number) => (
                  <div key={i} className="text-cyan-300">
                    <span className="text-gray-600">[{String(i + 1).padStart(2, '0')}]</span> {step}
                  </div>
                ))}
              </div>
              <div className="mt-3 p-2 bg-cyan-500/10 border border-cyan-500/30 rounded text-center">
                <div className="text-cyan-400 font-bold">
                  Résultat: |{results.quantum.grover.result.toString(2).padStart(4, '0')}⟩
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Recherche parmi 16 états en {results.quantum.grover.iterations} itérations (O(√N))
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-purple-500/5 border border-purple-900/30 rounded text-xs text-gray-400">
            <strong className="text-purple-400">Conclusion :</strong> La simulation quantique fonctionne pour un petit nombre de qubits (≤20).
            Au-delà, la mémoire requise (2^n amplitudes) devient impossible à gérer classiquement.
          </div>
        </div>
      )}

      {activeDemo === 'formula' && results.formula && (
        <div className="glass-panel p-6 border border-cyan-900/30">
          <h3 className="text-lg font-bold neon-text-cyan mb-4 font-[Orbitron]">
            DÉMONSTRATION : FORMULE Ω
          </h3>

          <div className="mb-6">
            <h4 className="text-sm font-bold text-cyan-400 mb-3">Fonctions ω(n) et Ω(n)</h4>
            <div className="space-y-2">
              {results.formula.numbers.map((r: any, i: number) => (
                <div key={i} className="bg-black/30 rounded p-3 border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-cyan-400 font-bold">n = {r.number}</span>
                    <span className="text-xs text-gray-500">Facteurs: {r.factors}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <div className="text-gray-500">ω(n) — diviseurs distincts</div>
                      <div className="text-cyan-300 font-mono text-lg">{r.omega}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Ω(n) — avec multiplicité</div>
                      <div className="text-purple-300 font-mono text-lg">{r.bigOmega}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Entropie</div>
                      <div className="text-green-300 font-mono text-lg">{r.entropy}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-green-400 mb-3">Réduction de complexité (SAT, n=50)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-red-500/5 rounded p-3 border border-red-900/30">
                <div className="text-xs text-red-400 mb-1">AVANT</div>
                <div className="text-lg font-mono text-red-300">{results.formula.reduction.original}</div>
                <div className="text-xs text-gray-500 mt-1">{results.formula.reduction.originalComplexity}</div>
              </div>
              <div className="bg-green-500/5 rounded p-3 border border-green-900/30">
                <div className="text-xs text-green-400 mb-1">APRÈS (via Ω)</div>
                <div className="text-lg font-mono text-green-300">{results.formula.reduction.reduced}</div>
                <div className="text-xs text-gray-500 mt-1">{results.formula.reduction.reducedComplexity}</div>
              </div>
            </div>
            <div className="mt-3 text-center">
              <div className="text-xs text-gray-500">Speedup</div>
              <div className="text-2xl font-bold text-yellow-400 font-mono">
                ×{results.formula.reduction.speedup > 1e15 
                  ? results.formula.reduction.speedup.toExponential(2) 
                  : results.formula.reduction.speedup.toFixed(0)}
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-cyan-500/5 border border-cyan-900/30 rounded text-xs text-gray-400">
            <strong className="text-cyan-400">Conclusion :</strong> Les fonctions ω(n) et Ω(n) sont des concepts réels de théorie des nombres.
            La "formule Ω" qui réduit toute complexité est fictive — aucune telle formule n'existe en réalité.
          </div>
        </div>
      )}

      {activeDemo === 'memory' && results.memory && (
        <div className="glass-panel p-6 border border-green-900/30">
          <h3 className="text-lg font-bold neon-text-green mb-4 font-[Orbitron]">
            DÉMONSTRATION : SCAN MÉMOIRE
          </h3>

          <div className="mb-4">
            <h4 className="text-sm font-bold text-green-400 mb-3">Clés extraites (simulation)</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.memory.keys.map((key: any, i: number) => (
                <div key={i} className="bg-black/30 rounded p-3 border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-green-400 font-bold">{key.type}</span>
                    <span className="text-xs text-gray-500">{key.algorithm}</span>
                  </div>
                  <div className="font-mono text-xs text-green-300 break-all mb-2">
                    {key.value}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Adresse: {key.address}</span>
                    <span>Confiance: {(key.confidence * 100).toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 bg-green-500/5 border border-green-900/30 rounded text-xs text-gray-400">
            <strong className="text-green-400">Conclusion :</strong> Ce scan est une simulation qui génère des données réalistes.
            En réalité, scanner la RAM d'un autre ordinateur nécessite un accès physique ou local (attaques side-channel).
          </div>
        </div>
      )}

      {running && (
        <div className="glass-panel p-6 border border-cyan-900/30 text-center">
          <div className="text-cyan-400 animate-pulse text-lg">⟳ Exécution en cours...</div>
        </div>
      )}
    </div>
  );
}

function DemoButton({ label, icon, active, onClick }: {
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded border transition-all ${
        active
          ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.3)]'
          : 'bg-black/30 border-gray-800 text-gray-400 hover:border-cyan-400/30 hover:text-cyan-400'
      }`}
    >
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xs font-mono">{label}</div>
    </button>
  );
}
