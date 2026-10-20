/**
 * MOTEUR IA ENTROPIQUE - Prédiction de mots de passe
 * Modèle de Markov + générateur basé sur patterns humains
 */

// Patterns courants de mots de passe humains
const COMMON_PATTERNS = {
  names: ['admin', 'root', 'user', 'test', 'guest', 'info', 'mysql', 'oracle', 'ftp', 'www'],
  words: ['password', 'letmein', 'welcome', 'monkey', 'dragon', 'master', 'qwerty', 'login', 'princess', 'football'],
  french: ['bonjour', 'soleil', 'amour', 'famille', 'maison', 'ordinateur', 'internet', 'securite', 'motdepasse', 'france'],
  numbers: ['123', '1234', '12345', '123456', '1234567', '12345678', '123456789', '1234567890', '000', '111'],
  years: Array.from({ length: 30 }, (_, i) => String(1990 + i)),
  symbols: ['!', '@', '#', '$', '%', '&', '*', '?', '.', '_'],
  substitutions: { 'a': '@', 'e': '3', 'i': '1', 'o': '0', 's': '$', 't': '7', 'l': '1' },
};

// Modèle de Markov pour générer des séquences probables
export class MarkovModel {
  private transitions: Map<string, Map<string, number>> = new Map();
  private order: number;

  constructor(order: number = 3) {
    this.order = order;
  }

  train(texts: string[]): void {
    for (const text of texts) {
      const padded = '^^^' + text.toLowerCase() + '$$$';
      for (let i = 0; i <= padded.length - this.order; i++) {
        const state = padded.slice(i, i + this.order);
        const next = i + this.order < padded.length ? padded[i + this.order] : '';
        
        if (!this.transitions.has(state)) {
          this.transitions.set(state, new Map());
        }
        const stateMap = this.transitions.get(state)!;
        stateMap.set(next, (stateMap.get(next) || 0) + 1);
      }
    }
  }

  generate(maxLength: number = 12): string {
    let result = '';
    let state = '^^^';
    
    for (let i = 0; i < maxLength; i++) {
      const stateMap = this.transitions.get(state);
      if (!stateMap) break;
      
      const entries = Array.from(stateMap.entries());
      const total = entries.reduce((sum, [, count]) => sum + count, 0);
      
      let rand = Math.random() * total;
      let nextChar = '';
      
      for (const [char, count] of entries) {
        rand -= count;
        if (rand <= 0) {
          nextChar = char;
          break;
        }
      }
      
      if (nextChar === '$') break;
      result += nextChar;
      state = state.slice(1) + nextChar;
    }
    
    return result;
  }
}

// Générateur de mots de passe basé sur l'entropie humaine
export function generatePasswordPredictions(count: number = 20): { password: string; confidence: number; pattern: string }[] {
  const predictions: { password: string; confidence: number; pattern: string }[] = [];
  
  const patterns = [
    { fn: () => generateNamePassword(), pattern: 'Prénom + chiffres', weight: 0.25 },
    { fn: () => generateWordPassword(), pattern: 'Mot + substitution', weight: 0.20 },
    { fn: () => generateDatePassword(), pattern: 'Date significative', weight: 0.15 },
    { fn: () => generatePhrasePassword(), pattern: 'Phrase tronquée', weight: 0.12 },
    { fn: () => generatePatternPassword(), pattern: 'Suite clavier', weight: 0.10 },
    { fn: () => generateMixedPassword(), pattern: 'Mot + symbole + année', weight: 0.18 },
  ];

  for (let i = 0; i < count; i++) {
    // Sélection pondérée du pattern
    let rand = Math.random();
    let selectedPattern = patterns[0];
    for (const p of patterns) {
      rand -= p.weight;
      if (rand <= 0) {
        selectedPattern = p;
        break;
      }
    }
    
    predictions.push({
      password: selectedPattern.fn(),
      confidence: Math.max(0.1, 1 - i * 0.04 - Math.random() * 0.05),
      pattern: selectedPattern.pattern,
    });
  }

  return predictions.sort((a, b) => b.confidence - a.confidence);
}

function generateNamePassword(): string {
  const names = ['marie', 'jean', 'pierre', 'sophie', 'lucas', 'emma', 'thomas', 'julie', 'alex', 'camille'];
  const name = names[Math.floor(Math.random() * names.length)];
  const year = COMMON_PATTERNS.years[Math.floor(Math.random() * COMMON_PATTERNS.years.length)];
  const variations = [
    `${name}${year}`,
    `${name.charAt(0).toUpperCase()}${name.slice(1)}${year}`,
    `${name}${year}!`,
    `${name}_${year}`,
    `${name}${Math.floor(Math.random() * 99)}`,
  ];
  return variations[Math.floor(Math.random() * variations.length)];
}

function generateWordPassword(): string {
  const allWords = [...COMMON_PATTERNS.words, ...COMMON_PATTERNS.french];
  let word = allWords[Math.floor(Math.random() * allWords.length)];
  
  // Appliquer des substitutions
  for (const [from, to] of Object.entries(COMMON_PATTERNS.substitutions)) {
    if (Math.random() > 0.5) {
      word = word.replace(new RegExp(from, 'g'), to);
    }
  }
  
  return word + (Math.random() > 0.5 ? Math.floor(Math.random() * 999) : '');
}

function generateDatePassword(): string {
  const day = String(Math.floor(Math.random() * 31) + 1).padStart(2, '0');
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const year = String(Math.floor(Math.random() * 30) + 1990);
  const formats = [
    `${day}${month}${year}`,
    `${day}/${month}/${year.slice(2)}`,
    `${year}${month}${day}`,
    `${day}${month}${year.slice(2)}`,
  ];
  return formats[Math.floor(Math.random() * formats.length)];
}

function generatePhrasePassword(): string {
  const phrases = [
    'jesuisle meilleur', 'mot de passe', 'je taime', 'bonjour123',
    'il etait une fois', 'la vie est belle', 'mon cheri', 'a bientot',
  ];
  let phrase = phrases[Math.floor(Math.random() * phrases.length)];
  // Substitutions
  phrase = phrase.replace(/a/g, '@').replace(/e/g, '3').replace(/i/g, '1');
  return phrase.replace(/\s/g, Math.random() > 0.5 ? '_' : '');
}

function generatePatternPassword(): string {
  const patterns = [
    'qwerty', 'azerty', 'asdfgh', 'zxcvbn', 'qazwsx', '1qaz2wsx',
    '1q2w3e', 'qweasd', 'zaq1xsw2', '1234qwer',
  ];
  const base = patterns[Math.floor(Math.random() * patterns.length)];
  return base + (Math.random() > 0.5 ? Math.floor(Math.random() * 99) : '');
}

function generateMixedPassword(): string {
  const words = [...COMMON_PATTERNS.french, 'admin', 'root', 'test'];
  const word = words[Math.floor(Math.random() * words.length)];
  const symbol = COMMON_PATTERNS.symbols[Math.floor(Math.random() * COMMON_PATTERNS.symbols.length)];
  const year = COMMON_PATTERNS.years[Math.floor(Math.random() * COMMON_PATTERNS.years.length)];
  const capitalized = word.charAt(0).toUpperCase() + word.slice(1);
  return `${capitalized}${symbol}${year}`;
}

// Calcul d'entropie d'un mot de passe
export function passwordEntropy(password: string): number {
  let charsetSize = 0;
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 33;
  
  return password.length * Math.log2(charsetSize || 1);
}

// Score de force d'un mot de passe
export function passwordStrength(password: string): { score: number; label: string; crackTime: string } {
  const entropy = passwordEntropy(password);
  let score = Math.min(100, entropy * 1.5);
  
  let label: string;
  let crackTime: string;
  
  if (score < 20) { label = 'TRÈS FAIBLE'; crackTime = '< 1 seconde'; }
  else if (score < 40) { label = 'FAIBLE'; crackTime = '< 1 minute'; }
  else if (score < 60) { label = 'MOYEN'; crackTime = '< 1 heure'; }
  else if (score < 80) { label = 'FORT'; crackTime = '< 1 an'; }
  else { label = 'TRÈS FORT'; crackTime = '> 1000 ans'; }
  
  return { score, label, crackTime };
}
