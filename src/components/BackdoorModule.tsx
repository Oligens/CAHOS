import { useState, useEffect } from 'react';

export default function BackdoorModule() {
  const [scanning, setScanning] = useState(false);
  const [memoryDump, setMemoryDump] = useState<string[]>([]);
  const [foundKeys, setFoundKeys] = useState<string[]>([]);

  const startScan = () => {
    setScanning(true);
    setMemoryDump([]);
    setFoundKeys([]);

    const hexChars = '0123456789ABCDEF';
    const generateHex = (len: number) => 
      Array.from({ length: len }, () => hexChars[Math.floor(Math.random() * 16)]).join('');

    let count = 0;
    const interval = setInterval(() => {
      if (count < 15) {
        const addr = `0x${generateHex(8)}`;
        const data = Array.from({ length: 8 }, () => generateHex(4)).join(' ');
        const ascii = Array.from({ length: 16 }, () => {
          const c = Math.floor(Math.random() * 95) + 32;
          return String.fromCharCode(c);
        }).join('');
        setMemoryDump(prev => [...prev, `${addr}  ${data}  |${ascii}|`]);
        count++;
      } else {
        clearInterval(interval);
        setFoundKeys([
          'AES-256-KEY: 4A7F2B...E91C (trouvé en RAM à 0x7FFE4A20)',
          'RSA-PRIV: d=0x8B3F...1A2C (extrait du bus mémoire)',
          'PASSWORD: "S3cur!tY_2024#x" (capturé avant chiffrement)',
          'SSL-MASTER: 0xDEADBEEF...CAFE (intercepté en transit)',
          'BIOS-KEY: FIRMWARE_MASTER_KEY (backdoor silicium activé)',
        ]);
        setScanning(false);
      }
    }, 300);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 neon-border">
        <h2 className="text-2xl font-bold neon-text-green mb-2 font-[Orbitron]">
          BACKDOOR SILICIUM
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Zero-Day matériel — Accès direct à la RAM avant chiffrement.
          Contourne toutes les couches logicielles (OS, drivers, firmware).
          Inspiré des vulnérabilités Spectre/Meltdown, amplifié x1000.
        </p>

        <div className="bg-black/50 rounded p-4 border border-green-900/30 mb-4">
          <div className="text-xs text-gray-500 mb-2">ARCHITECTURE D'ATTAQUE</div>
          <div className="font-mono text-xs text-green-300 space-y-1">
            <div>┌─────────────────────────────────────┐</div>
            <div>│ CPU ← [SIDE-CHANNEL] ← RAM PHYSIQUE │</div>
            <div>│   ↓ bypass OS kernel                  │</div>
            <div>│   ↓ bypass encryption layer           │</div>
            <div>│   ↓ bypass application security       │</div>
            <div>│   → DONNÉES EN CLAIR AVANT CHIFFREMENT│</div>
            <div>└─────────────────────────────────────┘</div>
          </div>
        </div>

        <div className="bg-black/50 rounded p-4 border border-green-900/30 mb-4">
          <div className="text-xs text-gray-500 mb-2">TECHNIQUES UTILISÉES</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 text-green-400">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              Cache Timing Attack (Spectre variant Ω)
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              Rowhammer DDR5 Exploitation
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              Bus Sniffing (PCIe/USB interception)
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              Voltage Glitching (Fault Injection)
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              Microcode Backdoor Activation
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              JTAG Debug Port Override
            </div>
          </div>
        </div>

        <button
          onClick={startScan}
          disabled={scanning}
          className="w-full px-6 py-3 bg-green-500/20 text-green-300 border border-green-400/50 rounded hover:bg-green-500/30 transition-all font-mono text-sm"
        >
          {scanning ? '⟳ SCAN MÉMOIRE EN COURS...' : '▶ SCANNER LA MÉMOIRE VIVE'}
        </button>
      </div>

      {/* Memory dump */}
      <div className="glass-panel p-6 border border-green-900/30">
        <h3 className="text-sm font-bold neon-text-green mb-3 font-[Orbitron]">DUMP MÉMOIRE RAM</h3>
        <div className="bg-black/70 rounded p-3 font-mono text-[10px] overflow-x-auto max-h-60 overflow-y-auto">
          {memoryDump.map((line, i) => (
            <div key={i} className="text-green-400/70 hover:text-green-300">
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
          <h3 className="text-sm font-bold neon-text-green mb-3 font-[Orbitron]">CLÉS EXTRAITES</h3>
          <div className="space-y-2">
            {foundKeys.map((key, i) => (
              <div key={i} className="bg-black/30 rounded p-2 border border-green-900/20 font-mono text-xs text-green-300">
                <span className="text-gray-600">[{String(i+1).padStart(2, '0')}]</span> {key}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
