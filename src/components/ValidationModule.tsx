import { useState } from 'react';
import { runTestT1 } from '../engines/testT1Caesar';
import { runTestT2 } from '../engines/testT2XOR';
import { runTestT3 } from '../engines/testT3ZIP';
import { runTestT4 } from '../engines/testT4AES';
import { runTestT5 } from '../engines/testT5Integrity';

interface TestResult {
  id: string;
  name: string;
  passed: boolean;
  details: any;
  time: number;
}

export default function ValidationModule() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [currentTest, setCurrentTest] = useState<string>('');

  const runAllTests = async () => {
    setRunning(true);
    setResults([]);
    
    // T1 — César
    setCurrentTest('T1');
    await new Promise(resolve => setTimeout(resolve, 500));
    const t1Result = runTestT1();
    setResults(prev => [...prev, {
      id: 'T1',
      name: 'Chiffre de César',
      passed: t1Result.passed,
      details: t1Result,
      time: t1Result.time,
    }]);
    
    // T2 — XOR
    setCurrentTest('T2');
    await new Promise(resolve => setTimeout(resolve, 500));
    const t2Result = runTestT2();
    setResults(prev => [...prev, {
      id: 'T2',
      name: 'XOR pédagogique',
      passed: t2Result.passed,
      details: t2Result,
      time: t2Result.time,
    }]);
    
    // T3 — ZIP
    setCurrentTest('T3');
    await new Promise(resolve => setTimeout(resolve, 500));
    const t3Result = await runTestT3();
    setResults(prev => [...prev, {
      id: 'T3',
      name: 'Archive ZIP',
      passed: t3Result.passed,
      details: t3Result,
      time: t3Result.time,
    }]);
    
    // T4 — AES-256
    setCurrentTest('T4');
    await new Promise(resolve => setTimeout(resolve, 500));
    const t4Result = await runTestT4();
    setResults(prev => [...prev, {
      id: 'T4',
      name: 'AES-256-GCM',
      passed: t4Result.passed,
      details: t4Result,
      time: t4Result.encryptionTime + t4Result.decryptionTime,
    }]);
    
    // T5 — Intégrité
    setCurrentTest('T5');
    await new Promise(resolve => setTimeout(resolve, 500));
    const t5Result = await runTestT5();
    setResults(prev => [...prev, {
      id: 'T5',
      name: 'Intégrité SHA-256',
      passed: t5Result.passed,
      details: t5Result,
      time: t5Result.time,
    }]);
    
    setCurrentTest('');
    setRunning(false);
  };

  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 neon-border">
        <h2 className="text-2xl font-bold neon-text-cyan mb-2 font-[Orbitron]">
          PROTOCOLE DE VALIDATION — 5 TESTS
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Tests reproductibles pour vérifier les capacités réelles du dispositif.
          Chaque test est exécuté avec de vrais algorithmes cryptographiques.
        </p>

        <div className="grid grid-cols-5 gap-2 mb-4">
          {['T1', 'T2', 'T3', 'T4', 'T5'].map((test, i) => {
            const result = results.find(r => r.id === test);
            const isRunning = currentTest === test;
            
            return (
              <div
                key={test}
                className={`p-3 rounded border text-center transition-all ${
                  isRunning
                    ? 'bg-cyan-500/20 border-cyan-400/50 animate-pulse'
                    : result
                    ? result.passed
                      ? 'bg-green-500/20 border-green-400/50'
                      : 'bg-red-500/20 border-red-400/50'
                    : 'bg-black/30 border-gray-800'
                }`}
              >
                <div className="text-lg font-bold font-mono">
                  {isRunning ? '⟳' : result ? (result.passed ? '✓' : '✗') : test}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {['César', 'XOR', 'ZIP', 'AES', 'Intégrité'][i]}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={runAllTests}
          disabled={running}
          className="w-full px-6 py-3 bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 rounded hover:bg-cyan-500/30 transition-all font-mono text-sm disabled:opacity-50"
        >
          {running ? '⟳ EXÉCUTION DES TESTS...' : '▶ EXÉCUTER LES 5 TESTS'}
        </button>

        {results.length > 0 && (
          <div className="mt-4 p-3 bg-black/30 rounded border border-gray-800">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Résultat global</span>
              <span className={`text-lg font-bold ${
                passedCount === totalCount ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {passedCount}/{totalCount} tests réussis
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Résultats détaillés */}
      {results.map(result => (
        <TestResultCard key={result.id} result={result} />
      ))}
    </div>
  );
}

function TestResultCard({ result }: { result: TestResult }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`glass-panel p-6 border ${
      result.passed ? 'border-green-500/30' : 'border-red-500/30'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className={`text-2xl ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
            {result.passed ? '✓' : '✗'}
          </span>
          <div>
            <h3 className={`text-lg font-bold ${result.passed ? 'neon-text-green' : 'text-red-400'}`}>
              {result.id} — {result.name}
            </h3>
            <div className="text-xs text-gray-500">
              Temps d'exécution: {result.time.toFixed(3)} ms
            </div>
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-gray-500 hover:text-cyan-400 transition-colors"
        >
          {expanded ? '▲ Masquer' : '▼ Détails'}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 bg-black/50 rounded p-4 font-mono text-xs overflow-x-auto">
          <pre className="text-gray-300 whitespace-pre-wrap">
            {JSON.stringify(result.details, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
