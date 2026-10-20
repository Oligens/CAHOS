/**
 * MOTEUR DE FACTORISATION - Algorithme de Shor (Simulation Classique)
 * Implémente une factorisation réelle avec détection de période simulée
 */

export function gcd(a: number, b: number): number {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

export function modPow(base: number, exp: number, mod: number): number {
  let result = 1;
  base = base % mod;
  while (exp > 0) {
    if (exp % 2 === 1) {
      result = (result * base) % mod;
    }
    exp = Math.floor(exp / 2);
    base = (base * base) % mod;
  }
  return result;
}

// Trouve la période r telle que a^r ≡ 1 (mod N)
export function findPeriod(a: number, N: number): number {
  let r = 1;
  let val = a % N;
  while (val !== 1 && r < N) {
    val = (val * a) % N;
    r++;
  }
  return r;
}

// Factorisation classique (trial division + Pollard rho simplifié)
export function factorize(n: number): number[] {
  if (n <= 1) return [n];
  
  const factors: number[] = [];
  
  // Trial division pour les petits facteurs
  while (n % 2 === 0) {
    factors.push(2);
    n = n / 2;
  }
  
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    while (n % i === 0) {
      factors.push(i);
      n = n / i;
    }
  }
  
  if (n > 1) factors.push(n);
  
  return factors.sort((a, b) => a - b);
}

// Simulation de l'algorithme de Shor étape par étape
export interface ShorStep {
  step: number;
  description: string;
  value: string;
  type: 'init' | 'choose' | 'gcd' | 'period' | 'check' | 'factor' | 'result';
}

export function* shorAlgorithm(N: number): Generator<ShorStep> {
  yield { step: 1, description: 'Initialisation', value: `N = ${N}`, type: 'init' };
  
  // Choix d'un entier aléatoire a
  const a = Math.floor(Math.random() * (N - 2)) + 2;
  yield { step: 2, description: 'Choix aléatoire de a', value: `a = ${a}`, type: 'choose' };
  
  // Vérification pgcd
  const g = gcd(a, N);
  yield { step: 3, description: 'Calcul du pgcd(a, N)', value: `pgcd(${a}, ${N}) = ${g}`, type: 'gcd' };
  
  if (g > 1) {
    yield { step: 4, description: 'Facteur trouvé directement!', value: `${g} × ${N/g} = ${N}`, type: 'result' };
    return;
  }
  
  // Recherche de la période
  const r = findPeriod(a, N);
  yield { step: 4, description: 'Recherche de la période (QFT simulée)', value: `r = ${r} (a^r mod N = 1)`, type: 'period' };
  
  if (r % 2 !== 0) {
    yield { step: 5, description: 'Période impaire, on relance', value: 'Nouveau a requis', type: 'check' };
    const factors = factorize(N);
    yield { step: 6, description: 'Factorisation classique de secours', value: `${N} = ${factors.join(' × ')}`, type: 'result' };
    return;
  }
  
  const aHalfR = modPow(a, r / 2, N);
  yield { step: 5, description: 'Calcul a^(r/2) mod N', value: `${a}^${r/2} mod ${N} = ${aHalfR}`, type: 'check' };
  
  const factor1 = gcd(aHalfR - 1, N);
  const factor2 = gcd(aHalfR + 1, N);
  
  yield { step: 6, description: 'pgcd(a^(r/2) - 1, N)', value: `pgcd(${aHalfR - 1}, ${N}) = ${factor1}`, type: 'factor' };
  yield { step: 7, description: 'pgcd(a^(r/2) + 1, N)', value: `pgcd(${aHalfR + 1}, ${N}) = ${factor2}`, type: 'factor' };
  
  const f1 = factor1 > 1 && factor1 < N ? factor1 : null;
  const f2 = factor2 > 1 && factor2 < N ? factor2 : null;
  
  if (f1 && f2) {
    yield { step: 8, description: 'FACTEURS TROUVÉS', value: `${N} = ${f1} × ${f2}`, type: 'result' };
  } else {
    const factors = factorize(N);
    yield { step: 8, description: 'Factorisation complète', value: `${N} = ${factors.join(' × ')}`, type: 'result' };
  }
}

// Mesure de performance
export function measureFactorization(n: number): { time: number; factors: number[] } {
  const start = performance.now();
  const factors = factorize(n);
  const time = performance.now() - start;
  return { time, factors };
}
