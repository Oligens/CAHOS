import { useState, useEffect } from 'react';

export default function AIModule() {
  const [predicting, setPredicting] = useState(false);
  const [predictions, setPredictions] = useState<string[]>([]);
  const [entropyMap, setEntropyMap] = useState<{ pattern: string; probability: number }[]>([]);

  const startPrediction = () => {
    setPredicting(true);
    setPredictions([]);
    setEntropyMap([]);

    const patterns = [
      { pattern: 'Prénom + année de naissance', probability: 0.34 },
      { pattern: 'Mot du dictionnaire + chiffre', probability: 0.28 },
      { pattern: 'Nom entreprise + symbole spécial', probability: 0.15 },
      { pattern: 'Suite clavier (qwerty, azerty)', probability: 0.08 },
      { pattern: 'Date significative (DD/MM/YYYY)', probability: 0.07 },
      { pattern: 'Phrase personnelle tronquée', probability: 0.05 },
      { pattern: 'Répétition (aaaa, 1234)', probability: 0.03 },
    ];

    const samplePasswords = [
      'Marie2024!',
      'password123',
      'Admin@Corp',
      'azerty1234',
      '15/08/1990',
      'JeaN_P@ul',
      'soleil2023',
      'qwerty!@#',
      'F00tb@ll',
      'M0nCh!en',
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < patterns.length) {
        setEntropyMap(prev => [...prev, patterns[step]]);
        step++;
      } else if (step < patterns.length + samplePasswords.length) {
        const idx = step - patterns.length;
        setPredictions(prev => [...prev, samplePasswords[idx]]);
        step++;
      } else {
        clearInterval(interval);
        setPredicting(false);
      }
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 neon-border">
        <h2 className="text-2xl font-bold neon-text-green mb-2 font-[Orbitron]">
          IA ENTROPIQUE — PRÉDICTION HUMAINE
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Intelligence artificielle capable de prédire les mots de passe avant même 
          qu'ils ne soient tapés, en modélisant l'entropie du comportement humain.
        </p>

        <div className="bg-black/50 rounded p-4 border border-green-900/30 mb-4">
          <div className="text-xs text-gray-500 mb-2">MODÈLE D'ENTROPIE HUMAINE</div>
          <div className="font-mono text-xs text-green-300 space-y-1">
            <div>H(password) = -∑ p(xᵢ) log₂ p(xᵢ)</div>
            <div className="text-gray-400 mt-2">Modèle de Markov d'ordre 3 sur corpus de 10⁹ mots de passe</div>
            <div className="text-gray-400">+ Réseau neuronal transformer (128 couches, 100B paramètres)</div>
            <div className="text-gray-400">+ Analyse biométrique comportementale (rythme de frappe, hésitations)</div>
            <div className="text-green-400 mt-2">Précision: 94.7% des mots de passe prédits dans les 1000 premiers essais</div>
          </div>
        </div>

        <div className="bg-black/50 rounded p-4 border border-green-900/30 mb-4">
          <div className="text-xs text-gray-500 mb-2">FACTEURS ANALYSÉS</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
            {[
              { factor: 'Psycholinguistique', detail: 'Mots liés à l\'identité' },
              { factor: 'Culture populaire', detail: 'Films, séries, musique' },
              { factor: 'Événements perso', detail: 'Dates, noms, lieux' },
              { factor: 'Patterns clavier', detail: 'Proximité des touches' },
              { factor: 'Substitutions', detail: '@=a, 0=o, $=s' },
              { factor: 'Rythme de frappe', detail: 'Dynamique comportementale' },
            ].map((item, i) => (
              <div key={i} className="bg-black/30 rounded p-2 border border-green-900/20">
                <div className="text-green-400 font-bold">{item.factor}</div>
                <div className="text-gray-500">{item.detail}</div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={startPrediction}
          disabled={predicting}
          className="w-full px-6 py-3 bg-green-500/20 text-green-300 border border-green-400/50 rounded hover:bg-green-500/30 transition-all font-mono text-sm"
        >
          {predicting ? '⟳ ANALYSE ENTROPIQUE EN COURS...' : '▶ LANCER LA PRÉDICTION'}
        </button>
      </div>

      {/* Entropy map */}
      <div className="glass-panel p-6 border border-green-900/30">
        <h3 className="text-sm font-bold neon-text-green mb-3 font-[Orbitron]">CARTE D'ENTROPIE — PATTERNS HUMAINS</h3>
        <div className="space-y-2">
          {entropyMap.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-48 text-xs text-gray-400 truncate">{item.pattern}</div>
              <div className="flex-1 h-4 bg-black/50 rounded-full overflow-hidden border border-gray-800">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-cyan-500 rounded-full transition-all duration-500"
                  style={{ width: `${item.probability * 100}%` }}
                />
              </div>
              <div className="text-xs text-green-400 font-mono w-12 text-right">
                {(item.probability * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Predicted passwords */}
      {predictions.length > 0 && (
        <div className="glass-panel p-6 border border-green-500/30">
          <h3 className="text-sm font-bold neon-text-green mb-3 font-[Orbitron]">MOTS DE PASSE PRÉDITS</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {predictions.map((pwd, i) => (
              <div key={i} className="bg-black/30 rounded p-2 border border-green-900/20 text-center">
                <div className="text-[10px] text-gray-600">#{i + 1}</div>
                <div className="text-xs text-green-300 font-mono mt-1">{pwd}</div>
                <div className="text-[9px] text-gray-600 mt-1">
                  confiance: {(95 - i * 5).toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-center text-xs text-gray-500">
            {predictions.length} mots de passe générés — Temps: {(predictions.length * 0.003).toFixed(3)}s
          </div>
        </div>
      )}

      {/* Neural network visualization */}
      <div className="glass-panel p-6 border border-green-900/30">
        <h3 className="text-sm font-bold neon-text-green mb-3 font-[Orbitron]">ARCHITECTURE DU MODÈLE</h3>
        <div className="bg-black/50 rounded p-4 font-mono text-xs overflow-x-auto">
          <pre className="text-green-300">
{`┌─────────────────────────────────────────────────────┐
│  COUCHE D'ENTRÉE                                     │
│  ├─ Encodeur comportemental (rythme, pression)       │
│  ├─ Encodeur linguistique (N-grams, sémantique)      │
│  └─ Encodeur contextuel (géolocalisation, temps)     │
├─────────────────────────────────────────────────────┤
│  TRANSFORMER (128 couches × 100B paramètres)         │
│  ├─ Self-Attention: modélisation des dépendances     │
│  ├─ Feed-Forward: extraction de patterns             │
│  └─ Layer Norm: stabilisation                        │
├─────────────────────────────────────────────────────┤
│  COUCHE DE SORTIE                                    │
│  ├─ Générateur de candidats (beam search, k=1000)    │
│  ├─ Scoreur de probabilité (softmax)                 │
│  └─ Validateur de contraintes (politique de mot de   │
│     passe du système cible)                          │
└─────────────────────────────────────────────────────┘

Performance: 94.7% top-1000 | Latence: 0.3ms | Mémoire: 200GB`}
          </pre>
        </div>
      </div>
    </div>
  );
}
