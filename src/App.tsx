import { useState, useEffect } from 'react';
import Header from './components/Header';
import ShorModule from './components/ShorModule';
import PvsNPModule from './components/PvsNPModule';
import BackdoorModule from './components/BackdoorModule';
import FormulaModule from './components/FormulaModule';
import QubitModule from './components/QubitModule';
import AIModule from './components/AIModule';
import MatrixRain from './components/MatrixRain';
import StatusPanel from './components/StatusPanel';

function App() {
  const [activeModule, setActiveModule] = useState<string>('overview');
  const [isDecoding, setIsDecoding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [systemTime, setSystemTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setSystemTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isDecoding) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsDecoding(false);
            return 100;
          }
          return prev + Math.random() * 3;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isDecoding]);

  const startDecryption = () => {
    setIsDecoding(true);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] grid-bg relative overflow-hidden">
      <MatrixRain />
      
      {/* Scan line effect */}
      <div className="fixed inset-0 pointer-events-none z-50 scan-line opacity-30" />
      
      {/* Main content */}
      <div className="relative z-10">
        <Header systemTime={systemTime} />
        
        {/* Progress bar */}
        {isDecoding && (
          <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-900">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-green-400 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Navigation */}
        <nav className="flex flex-wrap justify-center gap-2 p-4 border-b border-cyan-900/30">
          {[
            { id: 'overview', label: '⬡ VUE GLOBALE', icon: '◈' },
            { id: 'shor', label: '⟨ψ| SHOR', icon: '⟨ψ|' },
            { id: 'pvsnp', label: 'P≠NP', icon: '∑' },
            { id: 'backdoor', label: 'SILICIUM', icon: '⊡' },
            { id: 'formula', label: 'FORMULE Ω', icon: 'Ω' },
            { id: 'qubits', label: 'QUBITS', icon: '◉' },
            { id: 'ai', label: 'IA ENTROPIQUE', icon: '⟁' },
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
                  DISPOSITIF QUANTIQUE DE DÉCRYPAGE UNIVERSEL
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Système intégré combinant 6 modules de rupture technologique pour le décryptage 
                  et le décodage de toute donnée chiffrée, tout système protégé par mot de passe, 
                  et toute architecture cryptographique connue.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ModuleCard 
                  title="Algorithme de Shor" 
                  subtitle="Factorisation Quantique"
                  description="Factorise les grands nombres entiers exponentiellement plus vite"
                  color="cyan"
                  onClick={() => setActiveModule('shor')}
                />
                <ModuleCard 
                  title="Résolution P vs NP" 
                  subtitle="Le Saint Graal"
                  description="Résout les problèmes NP-complets en temps polynomial"
                  color="purple"
                  onClick={() => setActiveModule('pvsnp')}
                />
                <ModuleCard 
                  title="Backdoor Silicium" 
                  subtitle="Zero-Day Matériel"
                  description="Accès direct à la RAM avant chiffrement"
                  color="green"
                  onClick={() => setActiveModule('backdoor')}
                />
                <ModuleCard 
                  title="Formule Ω" 
                  subtitle="Simplification Révolutionnaire"
                  description="Réduit la complexité computationnelle"
                  color="cyan"
                  onClick={() => setActiveModule('formula')}
                />
                <ModuleCard 
                  title="Interfaçage Qubits" 
                  subtitle="Calcul Quantique"
                  description="1024 qubits topologiques en cohérence"
                  color="purple"
                  onClick={() => setActiveModule('qubits')}
                />
                <ModuleCard 
                  title="IA Entropique" 
                  subtitle="Prédiction Humaine"
                  description="Prédit les mots de passe avant qu'ils ne soient tapés"
                  color="green"
                  onClick={() => setActiveModule('ai')}
                />
              </div>

              {/* Decryption control */}
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
                    className={`px-8 py-3 rounded font-bold text-sm transition-all duration-300 font-[Orbitron] ${
                      isDecoding 
                        ? 'bg-red-500/20 text-red-400 border border-red-500/50 cursor-not-allowed'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 hover:bg-cyan-500/30 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] animate-pulse-glow'
                    }`}
                  >
                    {isDecoding ? '◼ ARRÊT' : '▶ DÉMARRER DÉCRYPAGE'}
                  </button>
                </div>
                {isDecoding && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progression du décryptage</span>
                      <span>{progress.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-green-500 rounded-full transition-all duration-100"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <StatusPanel systemTime={systemTime} />
            </div>
          )}

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

export default App;
