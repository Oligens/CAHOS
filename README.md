# CAHOS — laboratoire pédagogique de cryptographie

CAHOS signifie ici **Dispositif Décryptage Universel** comme nom historique du projet. Le logiciel livré dans cette branche est un **laboratoire pédagogique reproductible**, et non un décrypteur universel.

> **Limite fondamentale :** CAHOS ne casse pas AES, RSA, TLS/HTTPS ou les messageries chiffrées de bout en bout. Il ne récupère pas une clé inconnue d'un système moderne correctement implémenté. Il applique des opérations cryptographiques connues lorsque leurs paramètres ou clés sont disponibles, et montre certaines faiblesses de chiffrements classiques.

## Fonctionnalités exécutables

| Test | Fonction réelle | Ce qu'il démontre | Limite |
|---|---|---|---|
| **T1 — César** | Déchiffrement d'un texte avec décalage connu | Chiffrement classique par substitution et arithmétique modulaire | Inadapté à la sécurité moderne; le décalage doit être connu |
| **T2 — XOR** | XOR à clé répétée et classement des 256 clés XOR à un octet | Pourquoi un XOR à clé courte/répétée est faible et parfois analysable statistiquement | L'analyse est heuristique, vise seulement une clé d'un octet et peut se tromper |
| **T3 — ZIP** | Création, listing, contrôle CRC et extraction protégée contre les chemins traversants | Manipulation d'archives ZIP ordinaires | Ne casse pas le mot de passe d'une archive chiffrée; le module standard Python ne déchiffre pas les ZIP protégés par mot de passe |
| **T4 — AES-256-GCM** | Chiffrement et déchiffrement authentifiés via la bibliothèque \`cryptography\` | Confidentialité et détection de modification avec une clé de 32 octets | La clé correcte est requise; ce n'est pas une attaque contre AES |
| **T5 — SHA-256** | Calcul et comparaison d'empreintes de fichiers | Détection d'une différence entre deux contenus | SHA-256 seul ne chiffre pas et ne prouve pas qui a créé un fichier; une empreinte attendue non fiable peut être remplacée |

## Prérequis

- Python 3.10 ou plus récent (CI sur Python 3.12)
- \`pip\`
- Dépendance cryptographique maintenue \`cryptography\`

### Installation

Linux/macOS :

\`\`\`bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
\`\`\`

Windows PowerShell :

\`\`\`powershell
py -3 -m venv .venv
.\\.venv\\Scripts\\Activate.ps1
python -m pip install -r requirements.txt
\`\`\`

### Lancer tous les tests T1-T5

À la racine du dépôt :

\`\`\`bash
python -m unittest discover -s tests -v
\`\`\`

Une CI GitHub Actions exécute également cette suite sur chaque push vers \`main\` ou une branche \`feature/**\`, sur les pull requests et sur demande. Un résultat vert signifie que les tests automatisés passent; il ne signifie pas que CAHOS peut casser un chiffrement moderne.

## Exemples d'utilisation

### T1 — César

\`\`\`bash
python -m cahos.cli caesar "VHFUHW" --shift 3
# SECRET
\`\`\`

Le décalage correspond à celui appliqué lors du chiffrement.

### T2 — Analyse XOR à un octet

Créer un petit fichier de démonstration chiffré par XOR à un octet, puis classer les clés candidates. Le chiffrement XOR répétitif est fourni pour l'étude dans \`cahos.crypto_tests.xor_bytes\`; il ne doit pas protéger de vraies données.

\`\`\`bash
python -c "from pathlib import Path; from cahos.crypto_tests import xor_bytes; Path('xor-demo.bin').write_bytes(xor_bytes(b' this is the secret message and the answer is known ', bytes([0x42])))"
python -m cahos.cli xor-analyze xor-demo.bin --top 5
\`\`\`

Le score linguistique est une heuristique; vérifiez toujours les candidats. Les données binaires et les langues non couvertes peuvent donner des résultats trompeurs.

### T3 — ZIP ordinaire

\`\`\`bash
python -m cahos.cli zip-create exemple.zip fichier1.txt fichier2.txt
python -m cahos.cli zip-list exemple.zip
python -m cahos.cli zip-extract exemple.zip sortie
\`\`\`

L'extraction refuse les chemins qui sortiraient du dossier de destination et les entrées symboliques. N'extrayez jamais une archive inconnue dans un dossier sensible; une limite de taille et une politique anti-bombe ZIP restent nécessaires pour un service exposé à des fichiers non fiables.

### T4 — AES-256-GCM

Générer une clé aléatoire de 32 octets (256 bits) :

\`\`\`bash
python -m cahos.cli aes-keygen
\`\`\`

Conservez la clé hors du dépôt et ne la publiez pas. Utilisez la chaîne hexadécimale affichée pour le chiffrement et le déchiffrement :

\`\`\`bash
python -m cahos.cli aes-encrypt document.txt document.cahos.json --key VOTRE_CLE_HEX_DE_64_CARACTERES
python -m cahos.cli aes-decrypt document.cahos.json document-restaure.txt --key VOTRE_CLE_HEX_DE_64_CARACTERES
\`\`\`

Le fichier JSON contient le nonce, le texte chiffré et le tag d'authentification (encodés en Base64); ces valeurs ne remplacent pas la clé secrète. Une clé erronée ou une modification des données fait échouer l'authentification. Chaque chiffrement utilise un nonce aléatoire de 96 bits; **ne réutilisez jamais un nonce avec la même clé GCM**. L'outil est une démonstration, pas un coffre-fort de production ou un gestionnaire de clés.

### T5 — SHA-256

\`\`\`bash
python -m cahos.cli sha256 document.txt
python -m cahos.cli sha256-verify document.txt EMPREINTE_ATTENDUE
\`\`\`

La commande de vérification renvoie un code de sortie \`0\` si l'empreinte correspond et \`1\` si elle diffère; une entrée mal formée ou une erreur d'E/S produit une erreur.

## Organisation du dépôt

- \`cahos/crypto_tests.py\` : implémentations réelles des exercices T1-T5.
- \`cahos/cli.py\` : interface en ligne de commande.
- \`tests/test_validation.py\` : tests automatisés, y compris mauvaises clés, modification AES-GCM et tentative Zip Slip.
- \`.github/workflows/tests.yml\` : exécution automatisée dans GitHub Actions.
- \`requirements.txt\` : dépendance de chiffrement AES-GCM.

## Modèle de sécurité et périmètre

- **Aucun contournement cryptographique** : pas de cassage d'AES-256, RSA, TLS, chiffrement disque ou messagerie chiffrée.
- **Pas de récupération magique de mot de passe** : T3 ne déchiffre pas les ZIP protégés par mot de passe.
- **Aucun envoi réseau** : les commandes décrites traitent les données localement.
- **Clés** : une clé AES perdue n'est pas récupérable par CAHOS. Les clés ne doivent pas être enregistrées dans Git, des journaux ou des captures d'écran.
- **Données de démonstration** : n'utilisez pas ce projet non audité pour protéger des données sensibles en production.
- **SHA-256** : une empreinte n'est authentique que si sa valeur attendue est obtenue par un canal fiable; pour une preuve d'origine, utiliser une signature numérique ou un MAC adapté.
- **ZIP** : le contrôle CRC détecte certaines corruptions accidentelles, mais n'est pas une preuve cryptographique d'authenticité.

## Licence et statut

Le dépôt doit ajouter une licence explicite avant de définir les conditions de réutilisation. Les capacités réelles sont celles du code et des tests présents, pas la promesse suggérée par le nom « universel ».
