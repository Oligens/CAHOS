import { useState } from 'react';

export default function RealCapabilitiesModule() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Disclaimer */}
      <div className="glass-panel p-6 border border-yellow-500/50 bg-yellow-500/5">
        <div className="flex items-start gap-3">
          <span className="text-3xl">⚠️</span>
          <div>
            <h2 className="text-xl font-bold text-yellow-400 font-[Orbitron] mb-2">
              CAPACITÉS RÉELLES — VÉRITÉ TECHNIQUE
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Ce dispositif est une <strong className="text-cyan-400">simulation éducative</strong> qui implémente de vrais algorithmes 
              mathématiques et informatiques. Cependant, il est crucial de comprendre la différence entre 
              ce qui est <strong className="text-green-400">réalisable</strong>, ce qui est <strong className="text-yellow-400">théorique</strong>, 
              et ce qui est <strong className="text-red-400">impossible</strong> avec la technologie actuelle.
            </p>
          </div>
        </div>
      </div>

      {/* What it CAN do */}
      <div className="glass-panel p-6 neon-border">
        <h2 className="text-2xl font-bold neon-text-green mb-4 font-[Orbitron]">
          ✓ CE QUE LE DISPOSITIF PEUT VRAIMENT FAIRE
        </h2>
        
        <div className="space-y-4">
          <CapabilityCard
            title="Factorisation de petits nombres"
            module="Moteur Shor"
            canDo="Factoriser des nombres jusqu'à ~10^15 en quelques millisecondes"
            example="2987 = 29 × 103 (résolu en < 1ms)"
            realWorld="Casse les clés RSA jusqu'à 512 bits (obsolètes depuis 2010)"
            limitation="Ne peut PAS factoriser RSA-2048 (nécessiterait un ordinateur quantique de millions de qubits)"
            color="green"
            expanded={expandedCard === 'factorization'}
            onToggle={() => setExpandedCard(expandedCard === 'factorization' ? null : 'factorization')}
          />

          <CapabilityCard
            title="Résolution de problèmes SAT"
            module="Moteur P≠NP"
            canDo="Résoudre des instances 3-SAT avec 20-30 variables en quelques millisecondes"
            example="3-SAT avec 10 variables, 30 clauses → résolu en < 5ms"
            realWorld="Utile pour la vérification formelle, planification, tests logiciels"
            limitation="Ne peut PAS résoudre P≠NP (c'est le problème du millénaire non résolu, prix de 1M$)"
            color="green"
            expanded={expandedCard === 'sat'}
            onToggle={() => setExpandedCard(expandedCard === 'sat' ? null : 'sat')}
          />

          <CapabilityCard
            title="Simulation quantique"
            module="Moteur Qubits"
            canDo="Simuler jusqu'à 20-25 qubits sur un ordinateur classique"
            example="Algorithme de Grover sur 4 qubits → trouve l'élément en 2 itérations"
            realWorld="Éducatif : montre comment fonctionne un ordinateur quantique"
            limitation="Ne peut PAS simuler 1024 qubits (nécessiterait 2^1024 bits de RAM = impossible)"
            color="green"
            expanded={expandedCard === 'quantum'}
            onToggle={() => setExpandedCard(expandedCard === 'quantum' ? null : 'quantum')}
          />

          <CapabilityCard
            title="Prédiction de mots de passe faibles"
            module="Moteur IA"
            canDo="Générer des mots de passe basés sur des patterns humains courants"
            example="Prédit 'password123', 'admin2024', 'azerty1234' avec haute probabilité"
            realWorld="Similaire à HashCat, John the Ripper — casse les mots de passe faibles"
            limitation="Ne peut PAS prédire un mot de passe vraiment aléatoire de 20+ caractères"
            color="green"
            expanded={expandedCard === 'ai'}
            onToggle={() => setExpandedCard(expandedCard === 'ai' ? null : 'ai')}
          />

          <CapabilityCard
            title="Calculs de complexité"
            module="Moteur Ω"
            canDo="Calculer ω(n), entropie de Shannon, complexité de Kolmogorov (approximée)"
            example="ω(360) = 3 (facteurs premiers: 2, 3, 5)"
            realWorld="Utile pour l'analyse d'algorithmes et la théorie de l'information"
            limitation="La 'formule Ω' est fictive — aucune formule ne réduit toute complexité à O(n²)"
            color="green"
            expanded={expandedCard === 'formula'}
            onToggle={() => setExpandedCard(expandedCard === 'formula' ? null : 'formula')}
          />

          <CapabilityCard
            title="Génération de dumps mémoire"
            module="Moteur Silicium"
            canDo="Générer des dumps mémoire réalistes pour démonstration/éducation"
            example="Affiche des adresses hexadécimales et des clés extraites (simulées)"
            realWorld="Montre comment fonctionnent les attaques side-channel (Spectre, Meltdown)"
            limitation="Ne scanne PAS vraiment la RAM — c'est une simulation visuelle"
            color="green"
            expanded={expandedCard === 'memory'}
            onToggle={() => setExpandedCard(expandedCard === 'memory' ? null : 'memory')}
          />
        </div>
      </div>

      {/* What it CANNOT do */}
      <div className="glass-panel p-6 border border-red-500/50 bg-red-500/5">
        <h2 className="text-2xl font-bold text-red-400 mb-4 font-[Orbitron]">
          ✗ CE QUE LE DISPOSITIF NE PEUT PAS FAIRE
        </h2>

        <div className="space-y-3">
          <ImpossibleItem
            title="Casser RSA-2048 ou AES-256"
            reason="Nécessiterait un ordinateur quantique de millions de qubits stables (technologie inexistante)"
            current="Les meilleurs ordinateurs quantiques actuels ont ~1000 qubits bruités (IBM, Google)"
          />
          <ImpossibleItem
            title="Résoudre P vs NP"
            reason="C'est le problème du millénaire non résolu — personne ne sait si P = NP"
            current="La majorité des chercheurs pensent que P ≠ NP (mais ce n'est pas prouvé)"
          />
          <ImpossibleItem
            title="Décrypter n'importe quel fichier instantanément"
            reason="Physiquement impossible — violerait les lois de la thermodynamique et de l'information"
            current="Le chiffrement moderne (AES-256) est considéré sûr contre toute attaque connue"
          />
          <ImpossibleItem
            title="Prédire les mots de passe aléatoires"
            reason="Un mot de passe vraiment aléatoire de 20+ caractères a 2^120 combinaisons possibles"
            current="Même avec tous les ordinateurs du monde, il faudrait plus que l'âge de l'univers pour le casser"
          />
          <ImpossibleItem
            title="Accéder à la RAM d'un autre ordinateur à distance"
            reason="Les attaques side-channel nécessitent un accès physique ou local à la machine cible"
            current="Spectre/Meltdown nécessitent d'exécuter du code sur la machine vulnérable"
          />
          <ImpossibleItem
            title="La 'formule Ω' qui réduit toute complexité"
            reason="C'est une formule fictive inventée pour cette démonstration"
            current="Aucune formule magique n'existe — la complexité computationnelle est fondamentale"
          />
        </div>
      </div>

      {/* Real-world comparison */}
      <div className="glass-panel p-6 border border-cyan-900/30">
        <h2 className="text-xl font-bold neon-text-cyan mb-4 font-[Orbitron]">
          COMPARAISON AVEC LES OUTILS RÉELS
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-2 text-gray-500">TÂCHE</th>
                <th className="text-left py-2 text-gray-500">NOTRE DISPOSITIF</th>
                <th className="text-left py-2 text-gray-500">OUTILS RÉELS</th>
                <th className="text-left py-2 text-gray-500">VERDICT</th>
              </tr>
            </thead>
            <tbody className="text-gray-400">
              <tr className="border-b border-gray-900">
                <td className="py-2">Casser un mot de passe faible</td>
                <td className="py-2 text-green-400">✓ Simule la prédiction</td>
                <td className="py-2">HashCat, John the Ripper</td>
                <td className="py-2 text-yellow-400">Éducatif</td>
              </tr>
              <tr className="border-b border-gray-900">
                <td className="py-2">Factoriser RSA-512</td>
                <td className="py-2 text-green-400">✓ Possible en quelques secondes</td>
                <td className="py-2">msieve, yafu, CADO-NFS</td>
                <td className="py-2 text-green-400">Réaliste</td>
              </tr>
              <tr className="border-b border-gray-900">
                <td className="py-2">Factoriser RSA-2048</td>
                <td className="py-2 text-red-400">✗ Impossible</td>
                <td className="py-2">Ordinateur quantique (futur)</td>
                <td className="py-2 text-red-400">Irréaliste</td>
              </tr>
              <tr className="border-b border-gray-900">
                <td className="py-2">Résoudre 3-SAT (petit)</td>
                <td className="py-2 text-green-400">✓ DPLL fonctionnel</td>
                <td className="py-2">MiniSat, Z3, Glucose</td>
                <td className="py-2 text-green-400">Réaliste</td>
              </tr>
              <tr className="border-b border-gray-900">
                <td className="py-2">Simuler 10 qubits</td>
                <td className="py-2 text-green-400">✓ Simulation classique</td>
                <td className="py-2">Qiskit, Cirq, PennyLane</td>
                <td className="py-2 text-green-400">Réaliste</td>
              </tr>
              <tr className="border-b border-gray-900">
                <td className="py-2">Simuler 1024 qubits</td>
                <td className="py-2 text-red-400">✗ Impossible (2^1024 états)</td>
                <td className="py-2">Ordinateur quantique réel requis</td>
                <td className="py-2 text-red-400">Irréaliste</td>
              </tr>
              <tr className="border-b border-gray-900">
                <td className="py-2">Scanner la RAM à distance</td>
                <td className="py-2 text-red-400">✗ Simulation uniquement</td>
                <td className="py-2">Volatility, Rekall (local)</td>
                <td className="py-2 text-red-400">Irréaliste</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Educational value */}
      <div className="glass-panel p-6 border border-purple-900/30">
        <h2 className="text-xl font-bold neon-text-purple mb-4 font-[Orbitron]">
          VALEUR ÉDUCATIVE DU DISPOSITIF
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-black/30 rounded p-4 border border-purple-900/20">
            <h3 className="text-purple-400 font-bold mb-2">✓ Ce que vous apprenez</h3>
            <ul className="space-y-1 text-gray-400 text-xs">
              <li>• Comment fonctionne l'algorithme de Shor (factorisation quantique)</li>
              <li>• Ce qu'est un problème NP-complet et pourquoi c'est difficile</li>
              <li>• Les bases des qubits et des portes quantiques</li>
              <li>• Pourquoi les mots de passe faibles sont vulnérables</li>
              <li>• Les concepts d'entropie et de complexité algorithmique</li>
              <li>• Comment fonctionnent les attaques side-channel</li>
            </ul>
          </div>
          <div className="bg-black/30 rounded p-4 border border-cyan-900/20">
            <h3 className="text-cyan-400 font-bold mb-2">✓ Ce que vous NE apprenez PAS</h3>
            <ul className="space-y-1 text-gray-400 text-xs">
              <li>• Comment pirater de vrais systèmes (illégal et immoral)</li>
              <li>• Comment casser du vrai chiffrement moderne</li>
              <li>• Comment accéder à la mémoire d'autres ordinateurs</li>
              <li>• Comment prédire des mots de passe forts</li>
              <li>• Comment résoudre P vs NP (personne ne sait !)</li>
              <li>• Comment construire un vrai ordinateur quantique</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Conclusion */}
      <div className="glass-panel p-6 border border-green-500/50 bg-green-500/5">
        <h2 className="text-xl font-bold neon-text-green mb-3 font-[Orbitron]">
          CONCLUSION
        </h2>
        <div className="text-sm text-gray-300 space-y-3 leading-relaxed">
          <p>
            Ce dispositif est un <strong className="text-cyan-400">outil pédagogique</strong> qui démontre visuellement 
            des concepts avancés de cryptographie, d'informatique quantique et de théorie de la complexité.
          </p>
          <p>
            Les algorithmes implémentés sont <strong className="text-green-400">réels et fonctionnels</strong>, mais à petite échelle. 
            Ils ne peuvent pas casser les systèmes de chiffrement modernes utilisés dans la vie réelle 
            (banques, messageries, etc.).
          </p>
          <p>
            Le vrai décryptage nécessite soit :
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-400 ml-4">
            <li>Des <strong className="text-yellow-400">mots de passe faibles</strong> (cassables par dictionnaire/brute force)</li>
            <li>Des <strong className="text-yellow-400">clés cryptographiques obsolètes</strong> (RSA-512, DES)</li>
            <li>Des <strong className="text-yellow-400">vulnérabilités d'implémentation</strong> (bugs, side-channels locaux)</li>
            <li>Des <strong className="text-red-400">ordinateurs quantiques futurs</strong> (technologie inexistante à grande échelle)</li>
          </ul>
          <p className="text-xs text-gray-500 mt-4">
            Rappel : Le décryptage non autorisé de systèmes informatiques est <strong className="text-red-400">illégal</strong> dans la plupart 
            des pays (loi Godfrain en France, CFAA aux USA, etc.) et puni de peines de prison.
          </p>
        </div>
      </div>
    </div>
  );
}

interface CapabilityCardProps {
  title: string;
  module: string;
  canDo: string;
  example: string;
  realWorld: string;
  limitation: string;
  color: string;
  expanded: boolean;
  onToggle: () => void;
}

function CapabilityCard({ title, module, canDo, example, realWorld, limitation, color, expanded, onToggle }: CapabilityCardProps) {
  return (
    <div className={`bg-black/30 rounded border transition-all ${
      color === 'green' ? 'border-green-900/30' : 'border-red-900/30'
    }`}>
      <button
        onClick={onToggle}
        className="w-full p-4 text-left flex items-center justify-between hover:bg-black/20 transition-all"
      >
        <div>
          <div className="text-sm font-bold text-green-400">{title}</div>
          <div className="text-xs text-gray-500">{module}</div>
        </div>
        <span className="text-gray-500">{expanded ? '▲' : '▼'}</span>
      </button>
      
      {expanded && (
        <div className="px-4 pb-4 space-y-2 text-xs">
          <div className="bg-green-500/5 rounded p-2 border border-green-900/20">
            <div className="text-green-400 font-bold mb-1">✓ PEUT FAIRE :</div>
            <div className="text-gray-300">{canDo}</div>
          </div>
          <div className="bg-cyan-500/5 rounded p-2 border border-cyan-900/20">
            <div className="text-cyan-400 font-bold mb-1">EXEMPLE :</div>
            <div className="text-gray-300 font-mono">{example}</div>
          </div>
          <div className="bg-purple-500/5 rounded p-2 border border-purple-900/20">
            <div className="text-purple-400 font-bold mb-1">APPLICATION RÉELLE :</div>
            <div className="text-gray-300">{realWorld}</div>
          </div>
          <div className="bg-red-500/5 rounded p-2 border border-red-900/20">
            <div className="text-red-400 font-bold mb-1">✗ LIMITATION :</div>
            <div className="text-gray-300">{limitation}</div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ImpossibleItemProps {
  title: string;
  reason: string;
  current: string;
}

function ImpossibleItem({ title, reason, current }: ImpossibleItemProps) {
  return (
    <div className="bg-black/30 rounded p-3 border border-red-900/20">
      <div className="text-sm font-bold text-red-400 mb-1">✗ {title}</div>
      <div className="text-xs text-gray-400 mb-1">{reason}</div>
      <div className="text-xs text-gray-500 italic">{current}</div>
    </div>
  );
}
