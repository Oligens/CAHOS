import { useEffect, useState } from 'react';

export default function StatusPanel({ systemTime }: { systemTime: Date }) {
  const [stats, setStats] = useState({
    qubits: 1024,
    coherence: 99.7,
    entropy: 0,
    keysBroken: 0,
    memoryUsed: 0,
    temperature: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        qubits: 1024 - Math.floor(Math.random() * 3),
        coherence: 99.5 + Math.random() * 0.5,
        entropy: Math.random() * 100,
        keysBroken: Math.floor(Math.random() * 10000),
        memoryUsed: 70 + Math.random() * 25,
        temperature: 0.015 + Math.random() * 0.005,
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel p-4 neon-border">
      <h3 className="text-sm font-bold neon-text-cyan mb-3 font-[Orbitron]">ÉTAT DU SYSTÈME</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatItem label="QUBITS ACTIFS" value={`${stats.qubits}`} unit="" color="cyan" />
        <StatItem label="COHÉRENCE" value={stats.coherence.toFixed(1)} unit="%" color="green" />
        <StatItem label="ENTROPIE" value={stats.entropy.toFixed(2)} unit="bits" color="purple" />
        <StatItem label="CLÉS CASSÉES" value={stats.keysBroken.toLocaleString()} unit="" color="cyan" />
        <StatItem label="MÉMOIRE" value={stats.memoryUsed.toFixed(1)} unit="%" color="green" />
        <StatItem label="TEMPÉRATURE" value={stats.temperature.toFixed(3)} unit="K" color="purple" />
      </div>
      <div className="mt-3 text-xs text-gray-600 text-center">
        Dernière mise à jour: {systemTime.toLocaleTimeString('fr-FR')}
      </div>
    </div>
  );
}

function StatItem({ label, value, unit, color }: { label: string; value: string; unit: string; color: string }) {
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
