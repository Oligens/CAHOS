import { useEffect, useState } from 'react';

export default function QubitModule() {
  const [qubits, setQubits] = useState<{ state: string; phase: number; entangled: number | null }[]>([]);
  const [entangling, setEntangling] = useState(false);

  useEffect(() => {
    // Initialize 16 qubits for visualization
    const initial = Array.from({ length: 16 }, (_, i) => ({
      state: i < 8 ? '|0⟩' : '|1⟩',
      phase: Math.random() * Math.PI * 2,
      entangled: null as number | null,
    }));
    setQubits(initial);
  }, []);

  const entangle = () => {
    setEntangling(true);
    setTimeout(() => {
      setQubits(prev => prev.map((q, i) => ({
        ...q,
        state: Math.random() > 0.5 ? '|0⟩' : '|1⟩',
        phase: Math.random() * Math.PI * 2,
        entangled: i < 8 ? i + 8 : i - 8,
      })));
      setEntangling(false);
    }, 2000);
  };

  const applyGate = (gate: string) => {
    setQubits(prev => prev.map(q => {
      let newState = q.state;
      switch(gate) {
        case 'H': newState = q.state === '|0⟩' ? '|+⟩' : '|−⟩'; break;
        case 'X': newState = q.state === '|0⟩' ? '|1⟩' : '|0⟩'; break;
        case 'Z': newState = q.state; break;
        case 'T': newState = q.state; break;
        default: break;
      }
      return { ...q, state: newState, phase: q.phase + Math.PI / 4 };
    }));
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 neon-border">
        <h2 className="text-2xl font-bold neon-text-purple mb-2 font-[Orbitron]">
          INTERFAÇAGE QUBITS
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          1024 qubits topologiques en cohérence — Interface de contrôle quantique 
          avec portes logiques, intrication et mesure.
        </p>

        {/* Gate controls */}
        <div className="flex flex-wrap gap-2 mb-4">
          {['H', 'X', 'Y', 'Z', 'S', 'T', 'CNOT', 'SWAP', 'TOFFOLI'].map(gate => (
            <button
              key={gate}
              onClick={() => applyGate(gate)}
              className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-400/30 rounded text-xs font-mono hover:bg-purple-500/30 transition-all"
            >
              {gate}
            </button>
          ))}
          <button
            onClick={entangle}
            disabled={entangling}
            className="px-4 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 rounded text-xs font-mono hover:bg-cyan-500/30 transition-all"
          >
            {entangling ? '⟳ INTRICATION...' : '⊗ INTRICATION'}
          </button>
        </div>
      </div>

      {/* Qubit visualization */}
      <div className="glass-panel p-6 border border-purple-900/30">
        <h3 className="text-sm font-bold neon-text-purple mb-3 font-[Orbitron]">ÉTAT DES QUBITS (16/1024 affichés)</h3>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {qubits.map((qubit, i) => (
            <div 
              key={i} 
              className={`relative bg-black/50 rounded-lg p-3 border transition-all duration-500 ${
                qubit.entangled !== null 
                  ? 'border-cyan-400/50 shadow-[0_0_10px_rgba(0,240,255,0.2)]' 
                  : 'border-gray-800'
              }`}
            >
              <div className="text-[10px] text-gray-600 mb-1">Q{i.toString().padStart(3, '0')}</div>
              <div className="text-center">
                <div className={`text-lg font-mono font-bold ${
                  qubit.state === '|0⟩' ? 'text-cyan-400' : 
                  qubit.state === '|1⟩' ? 'text-purple-400' : 
                  qubit.state === '|+⟩' ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  {qubit.state}
                </div>
                {/* Bloch sphere indicator */}
                <div className="mt-2 w-8 h-8 mx-auto rounded-full border border-gray-700 relative">
                  <div 
                    className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                    style={{
                      top: `${50 + 35 * Math.cos(qubit.phase)}%`,
                      left: `${50 + 35 * Math.sin(qubit.phase)}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                </div>
                <div className="text-[9px] text-gray-600 mt-1">
                  φ={qubit.phase.toFixed(2)}
                </div>
              </div>
              {qubit.entangled !== null && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quantum state vector */}
      <div className="glass-panel p-6 border border-purple-900/30">
        <h3 className="text-sm font-bold neon-text-purple mb-3 font-[Orbitron]">VECTEUR D'ÉTAT GLOBAL</h3>
        <div className="bg-black/50 rounded p-4 font-mono text-xs overflow-x-auto">
          <pre className="text-purple-300">
{`|Ψ⟩ = α₀|000...0⟩ + α₁|000...1⟩ + ... + α₂ⁿ⁻¹|111...1⟩

où n = 1024 qubits
dim(ℋ) = 2¹⁰²⁴ ≈ 10³⁰⁸ dimensions

Amplitudes mesurées (échantillon):
  α₀₀₀₀ = ${(Math.random() * 0.1).toFixed(6)} + ${(Math.random() * 0.1).toFixed(6)}i
  α₀₀₀₁ = ${(Math.random() * 0.1).toFixed(6)} + ${(Math.random() * 0.1).toFixed(6)}i
  α₀₀₁₀ = ${(Math.random() * 0.1).toFixed(6)} + ${(Math.random() * 0.1).toFixed(6)}i
  ...
  Σ|αᵢ|² = 1.000000 (normalisation ✓)`}
          </pre>
        </div>
      </div>

      {/* Coherence info */}
      <div className="glass-panel p-6 border border-cyan-900/30">
        <h3 className="text-sm font-bold neon-text-cyan mb-3 font-[Orbitron]">PARAMÈTRES DE COHÉRENCE</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-black/30 rounded p-3 border border-gray-800">
            <div className="text-[10px] text-gray-600">T1 (Relaxation)</div>
            <div className="text-lg text-cyan-400 font-mono">340 μs</div>
          </div>
          <div className="bg-black/30 rounded p-3 border border-gray-800">
            <div className="text-[10px] text-gray-600">T2 (Déphasage)</div>
            <div className="text-lg text-cyan-400 font-mono">280 μs</div>
          </div>
          <div className="bg-black/30 rounded p-3 border border-gray-800">
            <div className="text-[10px] text-gray-600">Fidélité porte</div>
            <div className="text-lg text-green-400 font-mono">99.97%</div>
          </div>
          <div className="bg-black/30 rounded p-3 border border-gray-800">
            <div className="text-[10px] text-gray-600">Température</div>
            <div className="text-lg text-purple-400 font-mono">15 mK</div>
          </div>
        </div>
      </div>
    </div>
  );
}
