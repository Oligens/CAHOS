import { useEffect, useState } from 'react';

export default function Header({ systemTime }: { systemTime: Date }) {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-cyan-900/30 p-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-cyan-400 flex items-center justify-center animate-pulse-glow">
              <div className="w-8 h-8 rounded-full border border-purple-400 animate-qubit-spin flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-cyan-400" />
              </div>
            </div>
          </div>
          <div>
            <h1 className={`text-xl md:text-2xl font-bold font-[Orbitron] tracking-wider ${glitch ? 'animate-glitch' : ''}`}>
              <span className="neon-text-cyan">QUANTUM</span>
              <span className="neon-text-purple ml-2">DECRYPT</span>
              <span className="text-gray-600 text-sm ml-2">v4.2.0</span>
            </h1>
            <p className="text-xs text-gray-600 tracking-widest">
              DISPOSITIF UNIVERSEL DE DÉCRYPAGE QUANTIQUE
            </p>
          </div>
        </div>

        {/* Status indicators */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400">QUANTUM LINK</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-400">1024 QUBITS</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-purple-400">IA ACTIVE</span>
          </div>
          <div className="text-gray-500">
            {systemTime.toLocaleTimeString('fr-FR', { hour12: false })}
          </div>
        </div>
      </div>
    </header>
  );
}
