import { useState, useEffect, useRef } from 'react';
import { generateHexLine, extractKeysFromMemory, type ExtractedKey } from '../engines/memoryEngine';

export default function BackdoorModule() {
  const [scanning, setScanning] = useState(false);
  const [memoryDump, setMemoryDump] = useState<string[]>([]);
  const [foundKeys, setFoundKeys] = useState<ExtractedKey[]>([]);
  const [scanPhase, setScanPhase] = useState('');
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startScan = () => {
    setScanning(true);
    setMemoryDump([]);
    setFoundKeys([]);
    setProgress(0);

    const phases = [
      'Initialisation du bus sniffing...',
      'Activation side-channel Spectre Ω...',
      'Lecture cache L1/L2/L3...',
      'Extraction pages mémoire actives...',
      'Analyse structures de données...',
      'Détection motifs cryptographiques...',
      'Extraction clés de session...',
      'Reconstruction buffers chiffrement...',
      'Analyse registres CPU...',
      'Finalisation extraction...',
    ];

    let phaseIdx = 0;
    let lineCount = 0;
    const baseAddr = 0x7FFE0000;

    intervalRef.current = setInterval(() => {
      if (phaseIdx < phases.length) {
        setScanPhase(phases[phaseIdx]);
        setProgress(((phaseIdx + 1) / phases.length) * 100);

        // Ajouter des lignes de dump mémoire
        for (let i = 0; i < 3; i++) {
          const line = generateHexLine(baseAddr + lineCount * 16);
          setMemoryDump(prev => [...prev, `${line.address}  ${line.hex}  |${line.ascii}|`]);
          lineCount++;
        }

        phaseIdx++;

        // Extraire des clés à mi-parcours
        if (phaseIdx === 6) {
          setFoundKeys(extractKeysFromMemory());
        }
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setScanning(false);
        if (foundKeys.length === 0) {
          setFoundKeys(extractKeysFromMemory());
        }
      }
    }, 400);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 neon-border">
        <h2 className="text-2xl font-bold neon-text-green mb-2 font-[Orbitron]">
          MOTEUR BACKDOOR SILICIUM
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Simulation de scan mémoire via side-channel attacks.
          Extrait les données de la RAM avant chiffrement en exploitant les vulnérabilités matérielles.
        </p>

        <div className="bg-black/50 rounded p-4 border border-green-900/30 mb-4">
          <div className="text-xs text-gray-500 mb-2">TECHNIQUES D'EXTRACTION</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {[
              'Cache Timing Attack (Spectre Ω)',
              'Rowhammer DDR5 Exploitation',
              'Bus Sniffing (PCIe/USB)',
              'Voltage Glitching (Fault Injection)',
              'Microcode Backdoor Activation',
              'JTAG Debug Port Override',
              'DRAM Row Buffer Sampling',
              'TLB Side-Channel Analysis',
            ].map((tech, i) => (
              <div key={i} className="flex items-center gap-2 text-green-400">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                {tech}
              </div>
            ))}
          </div>
        </div>

        {scanning && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{scanPhase}</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-cyan-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <button
          onClick={startScan}
          disabled={scanning}
          className="w-full px-6 py-3 bg-green-500/20 text-green-300 border border-green-400/50 rounded hover:bg-green-500/30 transition-all font-mono text-sm disabled:opacity-50"
        >
          {scanning ? '⟳ SCAN EN COURS...' : '▶ SCANNER LA MÉMOIRE VIVE'}
        </button>
      </div>

      {/* Memory dump */}
      <div className="glass-panel p-6 border border-green-900/30">
        <h3 className="text-sm font-bold neon-text-green mb-3 font-[Orbitron]">DUMP MÉMOIRE RAM</h3>
        <div className="bg-black/70 rounded p-3 font-mono text-[10px] overflow-x-auto max-h-60 overflow-y-auto">
          {memoryDump.map((line, i) => (
            <div key={i} className="text-green-400/70 hover:text-green-300 transition-colors">
              {line}
            </div>
          ))}
          {scanning && (
            <div className="text-green-400 animate-pulse">█ Lecture en cours...</div>
          )}
        </div>
      </div>

      {/* Found keys */}
      {foundKeys.length > 0 && (
        <div className="glass-panel p-6 border border-green-500/30">
          <h3 className="text-sm font-bold neon-text-green mb-3 font-[Orbitron]">CLÉS EXTRAITES ({foundKeys.length})</h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {foundKeys.map((key, i) => (
              <div key={i} className="bg-black/30 rounded p-3 border border-green-900/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-green-400 font-bold">{key.type}</span>
                  <span className="text-[10px] text-gray-600">{key.algorithm}</span>
                </div>
                <div className="font-mono text-[10px] text-green-300 break-all mb-1">
                  {key.value}
                </div>
                <div className="flex justify-between text-[10px] text-gray-600">
                  <span>Adresse: {key.address}</span>
                  <span>Confiance: {(key.confidence * 100).toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
