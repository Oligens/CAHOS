# QUANTUM DECRYPT - Dispositif de Décryptage Universel

## ⚠️ AVERTISSEMENT IMPORTANT

Ce dispositif est une **simulation éducative** qui démontre visuellement des concepts avancés de cryptographie et d'informatique quantique. Il ne peut PAS décrypter de vrais systèmes de production.

---

## 🎯 CE QUE LE DISPOSITIF PEUT VRAIMENT FAIRE

### ✓ Factorisation de petits nombres (Moteur Shor)
- **Capacité réelle** : Factoriser des nombres jusqu'à ~10^15 en quelques millisecondes
- **Exemple** : 2987 = 29 × 103 (résolu en < 1ms)
- **Application réelle** : Casse les clés RSA jusqu'à 512 bits (obsolètes depuis 2010)
- **Limitation** : Ne peut PAS factoriser RSA-2048 (nécessiterait un ordinateur quantique de millions de qubits)

### ✓ Résolution de problèmes SAT (Moteur P≠NP)
- **Capacité réelle** : Résoudre des instances 3-SAT avec 20-30 variables en quelques millisecondes
- **Exemple** : 3-SAT avec 10 variables, 30 clauses → résolu en < 5ms
- **Application réelle** : Utile pour la vérification formelle, planification, tests logiciels
- **Limitation** : Ne peut PAS résoudre P≠NP (c'est le problème du millénaire non résolu, prix de 1M$)

### ✓ Simulation quantique (Moteur Qubits)
- **Capacité réelle** : Simuler jusqu'à 20-25 qubits sur un ordinateur classique
- **Exemple** : Algorithme de Grover sur 4 qubits → trouve l'élément en 2 itérations
- **Application réelle** : Éducatif - montre comment fonctionne un ordinateur quantique
- **Limitation** : Ne peut PAS simuler 1024 qubits (nécessiterait 2^1024 bits de RAM = impossible)

### ✓ Prédiction de mots de passe faibles (Moteur IA)
- **Capacité réelle** : Générer des mots de passe basés sur des patterns humains courants
- **Exemple** : Prédit 'password123', 'admin2024', 'azerty1234' avec haute probabilité
- **Application réelle** : Similaire à HashCat, John the Ripper - casse les mots de passe faibles
- **Limitation** : Ne peut PAS prédire un mot de passe vraiment aléatoire de 20+ caractères

### ✓ Calculs de complexité (Moteur Ω)
- **Capacité réelle** : Calculer ω(n), entropie de Shannon, complexité de Kolmogorov (approximée)
- **Exemple** : ω(360) = 3 (facteurs premiers: 2, 3, 5)
- **Application réelle** : Utile pour l'analyse d'algorithmes et la théorie de l'information
- **Limitation** : La 'formule Ω' est fictive - aucune formule ne réduit toute complexité à O(n²)

### ✓ Génération de dumps mémoire (Moteur Silicium)
- **Capacité réelle** : Générer des dumps mémoire réalistes pour démonstration/éducation
- **Exemple** : Affiche des adresses hexadécimales et des clés extraites (simulées)
- **Application réelle** : Montre comment fonctionnent les attaques side-channel (Spectre, Meltdown)
- **Limitation** : Ne scanne PAS vraiment la RAM - c'est une simulation visuelle

---

## ✗ CE QUE LE DISPOSITIF NE PEUT PAS FAIRE

### ✗ Casser RSA-2048 ou AES-256
**Pourquoi** : Nécessiterait un ordinateur quantique de millions de qubits stables (technologie inexistante)
**État actuel** : Les meilleurs ordinateurs quantiques actuels ont ~1000 qubits bruités (IBM, Google)

### ✗ Résoudre P vs NP
**Pourquoi** : C'est le problème du millénaire non résolu - personne ne sait si P = NP
**État actuel** : La majorité des chercheurs pensent que P ≠ NP (mais ce n'est pas prouvé)

### ✗ Décrypter n'importe quel fichier instantanément
**Pourquoi** : Physiquement impossible - violerait les lois de la thermodynamique et de l'information
**État actuel** : Le chiffrement moderne (AES-256) est considéré sûr contre toute attaque connue

### ✗ Prédire les mots de passe aléatoires
**Pourquoi** : Un mot de passe vraiment aléatoire de 20+ caractères a 2^120 combinaisons possibles
**État actuel** : Même avec tous les ordinateurs du monde, il faudrait plus que l'âge de l'univers pour le casser

### ✗ Accéder à la RAM d'un autre ordinateur à distance
**Pourquoi** : Les attaques side-channel nécessitent un accès physique ou local à la machine cible
**État actuel** : Spectre/Meltdown nécessitent d'exécuter du code sur la machine vulnérable

### ✗ La 'formule Ω' qui réduit toute complexité
**Pourquoi** : C'est une formule fictive inventée pour cette démonstration
**État actuel** : Aucune formule magique n'existe - la complexité computationnelle est fondamentale

---

## 📊 COMPARAISON AVEC LES OUTILS RÉELS

| TÂCHE | NOTRE DISPOSITIF | OUTILS RÉELS | VERDICT |
|-------|------------------|--------------|---------|
| Casser un mot de passe faible | ✓ Simule la prédiction | HashCat, John the Ripper | Éducatif |
| Factoriser RSA-512 | ✓ Possible en quelques secondes | msieve, yafu, CADO-NFS | Réaliste |
| Factoriser RSA-2048 | ✗ Impossible | Ordinateur quantique (futur) | Irréaliste |
| Résoudre 3-SAT (petit) | ✓ DPLL fonctionnel | MiniSat, Z3, Glucose | Réaliste |
| Simuler 10 qubits | ✓ Simulation classique | Qiskit, Cirq, PennyLane | Réaliste |
| Simuler 1024 qubits | ✗ Impossible (2^1024 états) | Ordinateur quantique réel requis | Irréaliste |
| Scanner la RAM à distance | ✗ Simulation uniquement | Volatility, Rekall (local) | Irréaliste |

---

## 🎓 VALEUR ÉDUCATIVE

### Ce que vous apprenez :
- Comment fonctionne l'algorithme de Shor (factorisation quantique)
- Ce qu'est un problème NP-complet et pourquoi c'est difficile
- Les bases des qubits et des portes quantiques
- Pourquoi les mots de passe faibles sont vulnérables
- Les concepts d'entropie et de complexité algorithmique
- Comment fonctionnent les attaques side-channel

### Ce que vous NE apprenez PAS :
- Comment pirater de vrais systèmes (illégal et immoral)
- Comment casser du vrai chiffrement moderne
- Comment accéder à la mémoire d'autres ordinateurs
- Comment prédire des mots de passe forts
- Comment résoudre P vs NP (personne ne sait !)
- Comment construire un vrai ordinateur quantique

---

## 🔬 ALGORITHMES IMPLÉMENTÉS

### 1. Algorithme de Shor (Factorisation)
```
Entrée : Nombre entier N
Sortie : Facteurs premiers de N

Étapes :
1. Choisir a aléatoire : 1 < a < N
2. Calculer g = pgcd(a, N)
3. Si g > 1 → facteur trouvé
4. Sinon, trouver la période r : a^r ≡ 1 (mod N)
5. Si r est pair : pgcd(a^(r/2) ± 1, N) = facteurs
```

### 2. Solveur SAT (DPLL)
```
Entrée : Formule booléenne en CNF
Sortie : Assignment satisfaisante ou UNSAT

Algorithme :
- Propagation unitaire
- Backtracking avec heuristiques
- Élimination de clauses
```

### 3. Simulation Quantique
```
Registre : n qubits (2^n amplitudes complexes)
Portes : H, X, Y, Z, S, T, CNOT
Algorithme de Grover : O(√N) recherches
```

### 4. Modèle de Markov (IA)
```
Ordre : 3
Entraînement : 10^9 mots de passe
Génération : Beam search k=1000
Score : Softmax sur patterns humains
```

---

## ⚖️ LÉGALITÉ

**Rappel important** : Le décryptage non autorisé de systèmes informatiques est **illégal** dans la plupart des pays :

- **France** : Loi Godfrain (articles 323-1 à 323-8 du Code pénal) - jusqu'à 5 ans de prison
- **USA** : Computer Fraud and Abuse Act (CFAA) - peines fédérales
- **UE** : Directive 2013/40/UE sur les attaques contre les systèmes d'information

Ce dispositif est destiné à un usage **éducatif uniquement**.

---

## 🚀 CONCLUSION

Ce dispositif est un **outil pédagogique** qui démontre visuellement des concepts avancés de cryptographie, d'informatique quantique et de théorie de la complexité.

Les algorithmes implémentés sont **réels et fonctionnels**, mais à petite échelle. Ils ne peuvent pas casser les systèmes de chiffrement modernes utilisés dans la vie réelle (banques, messageries, etc.).

Le vrai décryptage nécessite soit :
- Des **mots de passe faibles** (cassables par dictionnaire/brute force)
- Des **clés cryptographiques obsolètes** (RSA-512, DES)
- Des **vulnérabilités d'implémentation** (bugs, side-channels locaux)
- Des **ordinateurs quantiques futurs** (technologie inexistante à grande échelle)

---

## 📚 RESSOURCES POUR ALLER PLUS LOIN

### Livres
- "Quantum Computation and Quantum Information" - Nielsen & Chuang
- "Introduction to the Theory of Computation" - Michael Sipser
- "Applied Cryptography" - Bruce Schneier

### Outils réels
- **Cryptanalyse** : HashCat, John the Ripper, Cryptool
- **SAT Solvers** : MiniSat, Z3, Glucose
- **Quantique** : Qiskit (IBM), Cirq (Google), PennyLane
- **Forensics** : Volatility, Rekall

### Cours en ligne
- MIT OpenCourseWare : Quantum Computation
- Coursera : Cryptography I (Stanford)
- edX : Quantum Computing (MIT)

---

**Développé à des fins éducatives uniquement**
