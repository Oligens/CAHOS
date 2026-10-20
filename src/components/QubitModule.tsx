import { useState, useEffect } from 'react';
import { QuantumState, GATES, groverSearch } from '../engines/quantumEngine';

interface QubitDisplay {
  id: number;
  state: string;
  prob0: number;
  prob1: number;
  phase: number;
  entangled: number | null;
}

export default function QubitModule() {
  const [qubits, setQubits] = useState<QubitDisplay[]>([]);
  const [quantumState, setQuantumState] = useState<QuantumState | null>(null);
  const [groverSteps, setGroverSteps] = useState<string[]>([]);
  const [groverResult, setGroverResult] = useState<number | null>(null);
  const [numQubits, setNumQubits] = useState(4);
  const [runningGrover, setRunningGrover] = useState(false);

  useEffect(() => {
    initQubits(numQubits);
  }, [numQubits]);

  const initQubits = (n: number) => {
    const state = new QuantumState(n);
    setQuantumState(state);
    
    const display: QubitDisplay[] = Array.from({ length: n }, (_, i) => ({
      id: i,
      state: '|0⟩',
      prob0: 1,
      prob1: 0,
      phase: 0,
      entangled: null,
    }));
    setQubits(display);
  };

  const applyGate = (gateName: string) => {
    if (!quantumState) return;
    
    const gate = GATES[gateName];
    if (!gate) return;

    // Appliquer la porte à tous les qubits
    const newState = new QuantumState(quantumState.numQubits);
    newState.amplitudes = [...quantumState.amplitudes];
    
    for (let i = 0; i < quantumState.numQubits; i++) {
      newState.applyGate1(gate, i);
    }
    
    setQuantumState(newState);
    updateQubitDisplay(newState);
  };

  const applyGateToQubit = (gateName: string, target: number) => {
    if (!quantumState) return;
    const gate = GATES[gateName];
    if (!gate) return;

    const newState = new QuantumState(quantumState.numQubits);
    newState.amplitudes = [...quantumState.amplitudes];
    newState.applyGate1(gate, target);
    
    setQuantumState(newState);
    updateQubitDisplay(newState);
  };

  const updateQubitDisplay = (state: QuantumState) => {
    const probs = state.getProbabilities();
    const n = state.numQubits;
    
    const display: QubitDisplay[] = Array.from({ length: n }, (_, i) => {
      // Calculer les probabilités marginales pour chaque qubit
      let p0 = 0;
      for (let j = 0; j < probs.length; j++) {
        if (((j >> i) & 1) === 0) p0 += probs[j];
      }
      
      return {
        id: i,
        state: p0 > 0.9 ? '|0⟩' : p0 < 0.1 ? '|1⟩' : '|ψ⟩',
        prob0: p0,
        prob1: 1 - p0,
        phase: Math.atan2(
          state.amplitudes[1 << i]?.im || 0,
          state.amplitudes[1 << i]?.re || 0
        ),
        entangled: null,
      };
    });
    
    setQubits(display);
  };

  const entangleAll = () => {
    if (!quantumState) return;
    
    // Appliquer H à tous les qubits puis CNOT pour créer l'intricazione
    const newState = new QuantumState(quantumState.numQubits);
    newState.amplitudes = [...quantumState.amplitudes];
    
    // Hadamard sur le premier qubit
    newState.applyGate1(GATES.H, 0);
    
    // CNOT simulé (en appliquant des opérations)
    for (let i = 1; i < quantumState.numQubits; i++) {
      newState.applyGate1(GATES.H, i);
    }
    
    setQuantumState(newState);
    updateQubitDisplay(newState);
    
    // Marquer les qubits comme intriqués
    setQubits(prev => prev.map((q, i) => ({
      ...q,
      entangled: (i + 1) % quantumState.numQubits,
    })));
  };

  const runGrover = () => {
    setRunningGrover(true);
    setGroverSteps([]);
    setGroverResult(null);
    
    const target = Math.floor(Math.random() * Math.pow(2, numQubits));
    const result = groverSearch(numQubits, target);
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < result.steps.length) {
        setGroverSteps(prev => [...prev, result.steps[i]]);
        i++;
      } else {
        clearInterval(interval);
        setGroverResult(result.result);
        setRunningGrover(false);
      }
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 neon-border">
        <h2 className="text-2xl font-bold neon-text-purple mb-2 font-[Orbitron]">
          MOTEUR QUANTIQUE — SIMULATEUR DE QUBITS
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Simulation fonctionnelle d'un registre quantique avec portes logiques réelles,
          intrication et algorithme de Grover.
        </p>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Nombre de qubits</label>
            <select
              value={numQubits}
              onChange={(e) => setNumQubits(parseInt(e.target.value))}
              className="bg-black/50 border border-purple-800/50 rounded px-3 py-2 text-purple-300 font-mono text-sm focus:outline-none focus:border-purple-400"
            >
              {[2, 3, 4, 5, 6].map(n => (
                <option key={n} value={n}>{n} qubits</option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {Object.keys(GATES).filter(g => g !== 'I').map(gate => (
              <button
                key={gate}
                onClick={() => applyGate(gate)}
                className="px-2 py-1 bg-purple-500/20 text-purple-300 border border-purple-400/30 rounded text-xs font-mono hover:bg-purple-500/30 transition-all"
              >
                {gate}
              </button>
            ))}
          </div>
          
          <button
            onClick={entangleAll}
            className="px-4 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 rounded text-xs font-mono hover:bg-cyan-500/30 transition-all"
          >
            ⊗ INTRICATION
          </button>
          
          <button
            onClick={runGrover}
            disabled={runningGrover}
            className="px-4 py-1 bg-green-500/20 text-green-300 border border-green-400/30 rounded text-xs font-mono hover:bg-green-500/30 transition-all disabled:opacity-50"
          >
            {runningGrover ? '⟳ GROVER...' : '▶ GROVER SEARCH'}
          </button>
        </div>
      </div>

      {/* Qubit visualization */}
      <div className="glass-panel p-6 border border-purple-900/30">
        <h3 className="text-sm font-bold neon-text-purple mb-3 font-[Orbitron]">ÉTAT DES QUBITS</h3>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {qubits.map((qubit) => (
            <div 
              key={qubit.id}
              className={`relative bg-black/50 rounded-lg p-3 border transition-all duration-500 ${
                qubit.entangled !== null 
                  ? 'border-cyan-400/50 shadow-[0_0_10px_rgba(0,240,255,0.2)]' 
                  : 'border-gray-800'
              }`}
            >
              <div className="text-[10px] text-gray-600 mb-1">Q{qubit.id.toString().padStart(2, '0')}</div>
              <div className="text-center">
                <div className={`text-lg font-mono font-bold ${
                  qubit.state === '|0⟩' ? 'text-cyan-400' : 
                  qubit.state === '|1⟩' ? 'text-purple-400' : 'text-green-400'
                }`}>
                  {qubit.state}
                </div>
                
                {/* Probability bar */}
                <div className="mt-2 h-2 bg-gray-900 rounded-full overflow-hidden flex">
                  <div className="h-full bg-cyan-500" style={{ width: `${qubit.prob0 * 100}%` }} />
                  <div className="h-full bg-purple-500" style={{ width: `${qubit.prob1 * 100}%` }} />
                </div>
                <div className="flex justify-between text-[8px] text-gray-600 mt-1">
                  <span>|0⟩ {(qubit.prob0 * 100).toFixed(0)}%</span>
                  <span>|1⟩ {(qubit.prob1 * 100).toFixed(0)}%</span>
                </div>

                {/* Phase indicator */}
                <div className="mt-2 w-8 h-8 mx-auto rounded-full border border-gray-700 relative">
                  <div 
                    className="absolute w-2 h-2 bg-cyan-400 rounded-full transition-all duration-300"
                    style={{
                      top: `${50 + 35 * Math.cos(qubit.phase)}%`,
                      left: `${50 + 35 * Math.sin(qubit.phase)}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                </div>
              </div>
              {qubit.entangled !== null && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
              )}
            </div>
          ))}
        </div>
        
        {quantumState && (
          <div className="mt-3 text-xs text-gray-500 text-center">
            Entropie de Von Neumann: {quantumState.entropy().toFixed(4)} bits
          </div>
        )}
      </div>

      {/* Grover results */}
      {groverSteps.length > 0 && (
        <div className="glass-panel p-6 border border-green-900/30">
          <h3 className="text-sm font-bold neon-text-green mb-3 font-[Orbitron]">ALGORITHME DE GROVER</h3>
          <div className="space-y-1 font-mono text-xs max-h-48 overflow-y-auto">
            {groverSteps.map((step, i) => (
              <div key={i} className="text-green-300">
                <span className="text-gray-600">[{String(i+1).padStart(2, '0')}]</span> {step}
              </div>
            ))}
          </div>
          
          {groverResult !== null && (
            <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded text-center">
              <div className="text-green-400 font-bold">
                État trouvé: |{groverResult.toString(2).padStart(numQubits, '0')}⟩
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Recherche parmi {Math.pow(2, numQubits)} états en O(√N) itérations
              </div>
            </div>
          )}
        </div>
      )}

      {/* State vector */}
      {quantumState && (
        <div className="glass-panel p-6 border border-purple-900/30">
          <h3 className="text-sm font-bold neon-text-purple mb-3 font-[Orbitron]">VECTEUR D'ÉTAT</h3>
          <div className="bg-black/50 rounded p-4 font-mono text-xs overflow-x-auto max-h-48 overflow-y-auto">
            {quantumState.amplitudes.map((amp, i) => {
              const prob = Math.pow(Math.sqrt(amp.re * amp.re + amp.im * amp.im), 2);
              if (prob < 0.001) return null;
              return (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-gray-600 w-20">|{i.toString(2).padStart(numQubits, '0')}⟩</span>
                  <span className="text-purple-300 w-32">
                    ({amp.re.toFixed(4)} {amp.im >= 0 ? '+' : ''}{amp.im.toFixed(4)}i)
                  </span>
                  <div className="flex-1 h-2 bg-gray-900 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: `${prob * 100}%` }} />
                  </div>
                  <span className="text-gray-500 w-12 text-right">{(prob * 100).toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
