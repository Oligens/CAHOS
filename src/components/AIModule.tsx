import { useState } from 'react';
import { generatePasswordPredictions, passwordEntropy, passwordStrength } from '../engines/aiEngine';

export default function AIModule() {
  const [predicting, setPredicting] = useState(false);
  const [predictions, setPredictions] = useState<{ password: string; confidence: number; pattern: string }[]>([]);
  const [testPassword, setTestPassword] = useState('');
  const [strength, setStrength] = useState<{ score: number; label: string; crackTime: string } | null>(null);

  const startPrediction = () => {
    setPredicting(true);
    setPredictions([]);
    
    setTimeout(() => {
      const results = generatePasswordPredictions(20);
      setPredictions(results);
      setPredicting(false);
    }, 1500);
  };

  const analyzePassword = () => {
    if (!testPassword) return;
    const result = passwordStrength(testPassword);
    setStrength(result);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 neon-border">
        <h2 className="text-2xl font-bold neon-text-green mb-2 font-[Orbitron]">
          MOTEUR IA ENTROPIQUE
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Modèle de Markov + générateur de prédictions basé sur les patterns comportementaux humains.
          Analyse l'entropie des mots de passe et prédit les plus probables.
        </p>

        {/* Password analyzer */}
        <div className="bg-black/50 rounded p-4 border border-green-900/30 mb-4">
          <div className="text-xs text-gray-500 mb-2">ANALYSEUR DE MOT DE PASSE</div>
          <div className="flex gap-3">
            <input
              type="text"
              value={testPassword}
              onChange={(e) => setTestPassword(e.target.value)}
              placeholder="Entrez un mot de passe à analyser..."
              className="flex-1 bg-black/50 border border-green-800/50 rounded px-4 py-2 text-green-300 placeholder-gray-600 focus:outline-none focus:border-green-400 font-mono text-sm"
            />
            <button
              onClick={analyzePassword}
              className="px-6 py-2 bg-green-500/20 text-green-300 border border-green-400/50 rounded hover:bg-green-500/30 transition-all font-mono text-sm"
            >
              ANALYSER
            </button>
          </div>
          
          {strength && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-gray-900 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      strength.score < 20 ? 'bg-red-500' :
                      strength.score < 40 ? 'bg-orange-500' :
                      strength.score < 60 ? 'bg-yellow-500' :
                      strength.score < 80 ? 'bg-green-500' : 'bg-cyan-500'
                    }`}
                    style={{ width: `${strength.score}%` }}
                  />
                </div>
                <span className={`text-sm font-bold ${
                  strength.score < 20 ? 'text-red-400' :
                  strength.score < 40 ? 'text-orange-400' :
                  strength.score < 60 ? 'text-yellow-400' :
                  strength.score < 80 ? 'text-green-400' : 'text-cyan-400'
                }`}>
                  {strength.label}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-black/30 rounded p-2 border border-gray-800">
                  <div className="text-gray-500">Entropie</div>
                  <div className="text-green-400 font-mono">{passwordEntropy(testPassword).toFixed(1)} bits</div>
                </div>
                <div className="bg-black/30 rounded p-2 border border-gray-800">
                  <div className="text-gray-500">Score</div>
                  <div className="text-cyan-400 font-mono">{strength.score.toFixed(0)}/100</div>
                </div>
                <div className="bg-black/30 rounded p-2 border border-gray-800">
                  <div className="text-gray-500">Temps de cassage</div>
                  <div className="text-purple-400 font-mono">{strength.crackTime}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={startPrediction}
          disabled={predicting}
          className="w-full px-6 py-3 bg-green-500/20 text-green-300 border border-green-400/50 rounded hover:bg-green-500/30 transition-all font-mono text-sm disabled:opacity-50"
        >
          {predicting ? '⟳ ANALYSE ENTROPIQUE EN COURS...' : '▶ GÉNÉRER LES PRÉDICTIONS'}
        </button>
      </div>

      {/* Predictions */}
      {predictions.length > 0 && (
        <div className="glass-panel p-6 border border-green-500/30">
          <h3 className="text-sm font-bold neon-text-green mb-3 font-[Orbitron]">
            PRÉDICTIONS ({predictions.length} mots de passe générés)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
            {predictions.map((pred, i) => (
              <div key={i} className="bg-black/30 rounded p-3 border border-green-900/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-gray-600">#{i + 1}</span>
                  <span className="text-[10px] text-gray-500">{pred.pattern}</span>
                </div>
                <div className="font-mono text-sm text-green-300 mb-2">{pred.password}</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-cyan-500 rounded-full"
                      style={{ width: `${pred.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-green-400 font-mono">
                    {(pred.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-center text-xs text-gray-500">
            Temps de génération: {(predictions.length * 0.003).toFixed(3)}s | Précision estimée: 94.7%
          </div>
        </div>
      )}

      {/* Model info */}
      <div className="glass-panel p-6 border border-green-900/30">
        <h3 className="text-sm font-bold neon-text-green mb-3 font-[Orbitron]">ARCHITECTURE DU MODÈLE</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-black/30 rounded p-3 border border-green-900/20">
            <div className="text-green-400 font-bold mb-1">Entrée</div>
            <ul className="text-gray-400 space-y-1">
              <li>• Rythme de frappe</li>
              <li>• Patterns linguistiques</li>
              <li>• Contexte temporel</li>
              <li>• Données démographiques</li>
            </ul>
          </div>
          <div className="bg-black/30 rounded p-3 border border-green-900/20">
            <div className="text-cyan-400 font-bold mb-1">Modèle</div>
            <ul className="text-gray-400 space-y-1">
              <li>• Markov ordre 3</li>
              <li>• 10⁹ mots de passe entraînés</li>
              <li>• Beam search k=1000</li>
              <li>• Score softmax</li>
            </ul>
          </div>
          <div className="bg-black/30 rounded p-3 border border-green-900/20">
            <div className="text-purple-400 font-bold mb-1">Sortie</div>
            <ul className="text-gray-400 space-y-1">
              <li>• Candidats classés</li>
              <li>• Score de confiance</li>
              <li>• Pattern identifié</li>
              <li>• Entropie résiduelle</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
