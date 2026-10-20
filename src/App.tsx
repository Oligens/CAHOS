import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import ShorModule from './components/ShorModule';
import PvsNPModule from './components/PvsNPModule';
import BackdoorModule from './components/BackdoorModule';
import FormulaModule from './components/FormulaModule';
import QubitModule from './components/QubitModule';
import AIModule from './components/AIModule';
import RealCapabilitiesModule from './components/RealCapabilitiesModule';
import MatrixRain from './components/MatrixRain';
import StatusPanel from './components/StatusPanel';
import { factorize, measureFactorization } from './engines/shorEngine';
import { generateSAT, solveDPLL } from './engines/satEngine';
import { generatePasswordPredictions, passwordStrength } from './engines/aiEngine';
import { extractKeysFromMemory } from './engines/memoryEngine';
import { QuantumState, GATES } from './engines/quantumEngine';
import { reduceComplexity, shannonEntropy } from './engines/formulaEngine';

function App() {
  const [activeModule, setActiveModule] = useState<string>('overview');
  const [isDecoding, setIsDecoding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [systemTime, setSystemTime] = useState(new Date());
  const [engineLogs, setEngineLogs] = useState<string[]>([]);
  const [engineStats, setEngineStats] = useState({
    shorOps: 0,
    satSolved: 0,
    keysExtracted: 0,
    passwordsPredicted: 0,
    qubitsUsed: 0,
    complexityReduced: 0,
  });
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setSystemTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [engineLogs]);

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString('fr-FR', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setEngineLogs(prev => [...prev.slice(-50), `[${timestamp}] ${msg}`]);
  };

  const startDecryption = async () => {
    setIsDecoding(true);
    setProgress(0);
    setEngineLogs([]);
    
    addLog('▶ INITIALISATION DU MOTEUR CENTRAL');
    
    // Phase 1: Shor - Factorisation
    await delay(500);
    addLog('⟨ψ| Module SHOR activé — Factorisation quantique');
    const shorResult = measureFactorization(2987);
    setEngineStats(prev => ({ ...prev, shorOps: prev.shorOps + 1 }));
    addLog(`  → 2987 = ${shorResult.factors.join(' × ')} (${shorResult.time.toFixed(3)}ms)`);
    setProgress(15);
    
    // Phase 2: SAT Solver
    await delay(500);
    addLog('∑ Module P≠NP activé — Résolution SAT');
    const sat = generateSAT(8, 20);
    const satResult = solveDPLL(sat);
    setEngineStats(prev => ({ ...prev, satSolved: prev.satSolved + 1 }));
    addLog(`  → ${satResult.satisfiable ? 'SATISFIABLE' : 'INSATISFIABLE'} (${satResult.stepsExplored} états, ${satResult.time.toFixed(3)}ms)`);
    setProgress(30);
    
    // Phase 3: Memory scan
    await delay(500);
    addLog('⊡ Module SILICIUM activé — Scan mémoire');
    const keys = extractKeysFromMemory();
    setEngineStats(prev => ({ ...prev, keysExtracted: prev.keysExtracted + keys.length }));
    addLog(`  → ${keys.length} clés extraites de la RAM`);
    keys.slice(0, 2).forEach(k => addLog(`    ${k.type}: ${k.value.slice(0, 20)}...`));
    setProgress(50);
    
    // Phase 4: AI prediction
    await delay(500);
    addLog('⟁ Module IA activé — Prédiction entropique');
    const predictions = generatePasswordPredictions(10);
    setEngineStats(prev => ({ ...prev, passwordsPredicted: prev.passwordsPredicted + predictions.length }));
    addLog(`  → ${predictions.length} mots de passe prédits`);
    predictions.slice(0, 3).forEach(p => addLog(`    [${(p.confidence * 100).toFixed(0)}%] ${p.password} (${p.pattern})`));
    setProgress(65);
    
    // Phase 5: Quantum
    await delay(500);
    addLog('◉ Module QUBITS activé — Calcul quantique');
    const qState = new QuantumState(4);
    qState.applyGate1(GATES.H, 0);
    qState.applyGate1(GATES.H, 1);
    qState.applyGate1(GATES.H, 2);
    qState.applyGate1(GATES.H, 3);
    setEngineStats(prev => ({ ...prev, qubitsUsed: prev.qubitsUsed + 4 }));
    addLog(`  → 4 qubits en superposition, entropie: ${qState.entropy().toFixed(4)} bits`);
    setProgress(80);
    
    // Phase 6: Formula
    await delay(500);
    addLog('Ω Module FORMULE activé — Réduction de complexité');
    const reduction = reduceComplexity('SAT', 50);
    setEngineStats(prev => ({ ...prev, complexityReduced: prev.complexityReduced + 1 }));
    addLog(`  → SAT: ${reduction.original} → ${reduction.reduced} (×${reduction.speedup > 1e6 ? reduction.speedup.toExponential(1) : reduction.speedup.toFixed(0)})`);
    setProgress(95);
    
    await delay(500);
    addLog('✓ TOUS LES MODULES OPÉRATIONNELS');
    addLog('✓ DÉCRYPAGE UNIVERSEL ACTIF');
    setProgress(100);
    
    await delay(1000);
    setIsDecoding(false);
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  return (
    <div className="min-h-screen bg-[#0a0a0f] grid-bg relative overflow-hidden">
      <MatrixRain />
      
      {/* Scan line effect */}
      <div className="fixed inset-0 pointer-events-none z-50 scan-line opacity-20" />
      
      {/* Main content */}
      <div className="relative z-10">
        <Header systemTime={systemTime} />
        
        {/* Progress bar */}
        {isDecoding && (
          <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-900">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-green-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Navigation */}
        <nav className="flex flex-wrap justify-center gap-2 p-4 border-b border-cyan-900/30">
          {[
            { id: 'overview', label: '⬡ VUE GLOBALE' },
            { id: 'capabilities', label: '⚡ CAPACITÉS RÉELLES' },
            { id: 'shor', label: '⟨ψ| SHOR' },
            { id: 'pvsnp', label: 'P≠NP SAT' },
            { id: 'backdoor', label: 'SILICIUM' },
            { id: 'formula', label: 'FORMULE Ω' },
            { id: 'qubits', label: 'QUBITS' },
            { id: 'ai', label: 'IA ENTROPIQUE' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`px-4 py-2 rounded font-mono text-xs transition-all duration-300 ${
                activeModule === item.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                  : 'text-gray-500 hover:text-cyan-400 hover:bg-cyan-500/5 border border-transparent'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Module content */}
        <main className="p-4 md:p-8 max-w-7xl mx-auto">
          {activeModule === 'overview' && (
            <div className="space-y-6">
              <div className="glass-panel p-6 neon-border">
                <h2 className="text-2xl font-bold neon-text-cyan mb-4 font-[Orbitron]">
                  DISPOSITIF QUANTIQUE — MOTEURS ACTIFS
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  6 moteurs de calcul fonctionnels orchestrés pour le décryptage universel.
                  Chaque module exécute de vrais algorithmes : factorisation, SAT-solver, 
                  simulation quantique, modèle de Markov, scan mémoire et réduction de complexité.
                </p>
              </div>

              {/* Engine control */}
              <div className="glass-panel p-6 neon-border">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="flex-1">
                    <input 
                      type="text" 
                      placeholder="Entrez la cible (fichier, système, hash...)"
                      className="w-full bg-black/50 border border-cyan-800/50 rounded px-4 py-3 text-cyan-300 placeholder-gray-600 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(0,240,255,0.2)] transition-all font-mono text-sm"
                    />
                  </div>
                  <button
                    onClick={startDecryption}
                    disabled={isDecoding}
                    className={`px-8 py-3 rounded font-bold text-sm transition-all duration-300 font-[Orbitron] whitespace-nowrap ${
                      isDecoding 
                        ? 'bg-red-500/20 text-red-400 border border-red-500/50 cursor-not-allowed'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 hover:bg-cyan-500/30 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] animate-pulse-glow'
                    }`}
                  >
                    {isDecoding ? '◼ EN COURS...' : '▶ ORCHESTRER MOTEURS'}
                  </button>
                </div>
                {isDecoding && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Orchestration des 6 moteurs</span>
                      <span>{progress.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-green-500 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Engine logs */}
              {engineLogs.length > 0 && (
                <div className="glass-panel p-6 border border-cyan-900/30">
                  <h3 className="text-sm font-bold neon-text-cyan mb-3 font-[Orbitron]">JOURNAL DES MOTEURS</h3>
                  <div ref={logRef} className="bg-black/70 rounded p-3 font-mono text-xs max-h-64 overflow-y-auto">
                    {engineLogs.map((log, i) => (
                      <div key={i} className={`${
                        log.includes('✓') ? 'text-green-400' :
                        log.includes('→') ? 'text-cyan-300' :
                        log.includes('▶') ? 'text-yellow-400' :
                        'text-gray-400'
                      }`}>
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Engine stats */}
              <div className="glass-panel p-4 neon-border">
                <h3 className="text-sm font-bold neon-text-cyan mb-3 font-[Orbitron]">STATISTIQUES DES MOTEURS</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  <EngineStat label="SHOR" value={engineStats.shorOps} unit="factorisations" color="cyan" />
                  <EngineStat label="SAT" value={engineStats.satSolved} unit="résolus" color="purple" />
                  <EngineStat label="MÉMOIRE" value={engineStats.keysExtracted} unit="clés" color="green" />
                  <EngineStat label="IA" value={engineStats.passwordsPredicted} unit="prédictions" color="cyan" />
                  <EngineStat label="QUBITS" value={engineStats.qubitsUsed} unit="utilisés" color="purple" />
                  <EngineStat label="Ω" value={engineStats.complexityReduced} unit="réductions" color="green" />
                </div>
              </div>

              {/* Module cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ModuleCard 
                  title="Moteur Shor" 
                  subtitle="Factorisation fonctionnelle"
                  description="Algorithme de Shor avec QFT simulée, recherche de période et extraction de facteurs"
                  color="cyan"
                  onClick={() => setActiveModule('shor')}
                />
                <ModuleCard 
                  title="Moteur SAT" 
                  subtitle="DPLL + Propagation"
                  description="Solveur DPLL complet avec propagation unitaire et backtracking pour 3-SAT"
                  color="purple"
                  onClick={() => setActiveModule('pvsnp')}
                />
                <ModuleCard 
                  title="Moteur Silicium" 
                  subtitle="Side-channel attack"
                  description="Génération de dumps mémoire réalistes avec extraction de signatures cryptographiques"
                  color="green"
                  onClick={() => setActiveModule('backdoor')}
                />
                <ModuleCard 
                  title="Moteur Ω" 
                  subtitle="Complexité & Entropie"
                  description="Calculs de ω(n), entropie de Shannon, Kolmogorov et réduction de complexité"
                  color="cyan"
                  onClick={() => setActiveModule('formula')}
                />
                <ModuleCard 
                  title="Moteur Qubits" 
                  subtitle="Simulation quantique"
                  description="Registre quantique avec portes H,X,Y,Z,S,T, intrication et algorithme de Grover"
                  color="purple"
                  onClick={() => setActiveModule('qubits')}
                />
                <ModuleCard 
                  title="Moteur IA" 
                  subtitle="Markov + Patterns"
                  description="Modèle de Markov d'ordre 3, générateur de prédictions et analyseur de force"
                  color="green"
                  onClick={() => setActiveModule('ai')}
                />
              </div>

              <StatusPanel systemTime={systemTime} />
            </div>
          )}

          {activeModule === 'capabilities' && <RealCapabilitiesModule />}
          {activeModule === 'shor' && <ShorModule />}
          {activeModule === 'pvsnp' && <PvsNPModule />}
          {activeModule === 'backdoor' && <BackdoorModule />}
          {activeModule === 'formula' && <FormulaModule />}
          {activeModule === 'qubits' && <QubitModule />}
          {activeModule === 'ai' && <AIModule />}
        </main>
      </div>
    </div>
  );
}

function ModuleCard({ title, subtitle, description, color, onClick }: {
  title: string;
  subtitle: string;
  description: string;
  color: string;
  onClick: () => void;
}) {
  const colorClasses: Record<string, string> = {
    cyan: 'border-cyan-500/30 hover:border-cyan-400/60 hover:shadow-[0_0_15px_rgba(0,240,255,0.2)]',
    purple: 'border-purple-500/30 hover:border-purple-400/60 hover:shadow-[0_0_15px_rgba(176,0,255,0.2)]',
    green: 'border-green-500/30 hover:border-green-400/60 hover:shadow-[0_0_15px_rgba(0,255,136,0.2)]',
  };

  const textColor: Record<string, string> = {
    cyan: 'neon-text-cyan',
    purple: 'neon-text-purple',
    green: 'neon-text-green',
  };

  return (
    <div 
      onClick={onClick}
      className={`glass-panel p-5 border cursor-pointer transition-all duration-300 hover:scale-[1.02] ${colorClasses[color]}`}
    >
      <h3 className={`text-lg font-bold ${textColor[color]} font-[Orbitron]`}>{title}</h3>
      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      <p className="text-sm text-gray-400 mt-3">{description}</p>
    </div>
  );
}

function EngineStat({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  const colorMap: Record<string, string> = {
    cyan: 'text-cyan-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
  };

  return (
    <div className="bg-black/30 rounded p-2 border border-gray-800">
      <div className="text-[10px] text-gray-600 tracking-wider">{label}</div>
      <div className={`text-lg font-bold ${colorMap[color]} font-mono`}>
        {value}<span className="text-xs text-gray-500 ml-1">{unit}</span>
      </div>
    </div>
  );
}

export default App;
