/**
 * MOTEUR FORMULE Ω - Calculs de complexité et transformations
 */

// Fonction Ω(n) - nombre de diviseurs premiers distincts
export function omegaFunction(n: number): number {
  let count = 0;
  let num = n;
  
  for (let i = 2; i * i <= num; i++) {
    if (num % i === 0) {
      count++;
      while (num % i === 0) num = num / i;
    }
  }
  if (num > 1) count++;
  
  return count;
}

// Fonction Omega(n) - nombre total de facteurs premiers (avec multiplicité)
export function bigOmegaFunction(n: number): number {
  let count = 0;
  let num = n;
  
  for (let i = 2; i * i <= num; i++) {
    while (num % i === 0) {
      count++;
      num = num / i;
    }
  }
  if (num > 1) count++;
  
  return count;
}

// Fonction de complexité de Kolmogorov (approximation par compression)
export function kolmogorovComplexity(data: string): number {
  // Approximation par la longueur après compression RLE
  let compressed = '';
  let i = 0;
  while (i < data.length) {
    let count = 1;
    while (i + count < data.length && data[i + count] === data[i]) count++;
    compressed += count > 3 ? `${count}${data[i]}` : data.slice(i, i + count);
    i += count;
  }
  return compressed.length;
}

// Entropie de Shannon
export function shannonEntropy(data: string): number {
  const freq: Record<string, number> = {};
  for (const char of data) {
    freq[char] = (freq[char] || 0) + 1;
  }
  
  const len = data.length;
  let entropy = 0;
  for (const count of Object.values(freq)) {
    const p = count / len;
    if (p > 0) entropy -= p * Math.log2(p);
  }
  
  return entropy;
}

// Calcul de la série Ω pour un nombre donné
export function omegaSeries(n: number, terms: number = 10): { term: number; value: number; cumulative: number }[] {
  const result: { term: number; value: number; cumulative: number }[] = [];
  let cumulative = 0;
  const lambda = Math.log(n) / n;
  
  for (let i = 0; i < terms; i++) {
    const psi = Math.sin(i * Math.PI / n) * Math.exp(-lambda * i);
    const factorial = factorialApprox(i);
    const value = psi * Math.exp(-lambda * n) / factorial;
    cumulative += value;
    result.push({ term: i, value, cumulative });
  }
  
  return result;
}

// Approximation de factorielle (Stirling)
function factorialApprox(n: number): number {
  if (n <= 1) return 1;
  if (n > 170) return Infinity;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

// Transformée de Fourier discrète (pour simulation QFT)
export function dft(input: { re: number; im: number }[]): { re: number; im: number }[] {
  const N = input.length;
  const output: { re: number; im: number }[] = [];
  
  for (let k = 0; k < N; k++) {
    let sumRe = 0, sumIm = 0;
    for (let n = 0; n < N; n++) {
      const angle = -2 * Math.PI * k * n / N;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      sumRe += input[n].re * cos - input[n].im * sin;
      sumIm += input[n].re * sin + input[n].im * cos;
    }
    output.push({ re: sumRe / Math.sqrt(N), im: sumIm / Math.sqrt(N) });
  }
  
  return output;
}

// Réduction de complexité simulée
export interface ComplexityReduction {
  original: string;
  reduced: string;
  originalComplexity: string;
  reducedComplexity: string;
  speedup: number;
}

export function reduceComplexity(problemType: string, n: number): ComplexityReduction {
  const reductions: Record<string, ComplexityReduction> = {
    'TSP': {
      original: `O(n! × 2^n)`,
      reduced: `O(n³ × log(n))`,
      originalComplexity: `${formatBigNumber(factorialApprox(n) * Math.pow(2, n))} opérations`,
      reducedComplexity: `${formatBigNumber(n * n * n * Math.log2(n))} opérations`,
      speedup: (factorialApprox(n) * Math.pow(2, n)) / (n * n * n * Math.log2(n)),
    },
    'SAT': {
      original: `O(2^n)`,
      reduced: `O(n⁴)`,
      originalComplexity: `${formatBigNumber(Math.pow(2, n))} opérations`,
      reducedComplexity: `${formatBigNumber(Math.pow(n, 4))} opérations`,
      speedup: Math.pow(2, n) / Math.pow(n, 4),
    },
    'Factorisation': {
      original: `O(e^(1.9 × (log n)^(1/3)))`,
      reduced: `O((log n)³)`,
      originalComplexity: `${formatBigNumber(Math.exp(1.9 * Math.pow(Math.log(n), 1/3)))} opérations`,
      reducedComplexity: `${formatBigNumber(Math.pow(Math.log(n), 3))} opérations`,
      speedup: Math.exp(1.9 * Math.pow(Math.log(n), 1/3)) / Math.pow(Math.log(n), 3),
    },
    'Graph Coloring': {
      original: `O(k^n)`,
      reduced: `O(n² × k)`,
      originalComplexity: `${formatBigNumber(Math.pow(4, n))} opérations (k=4)`,
      reducedComplexity: `${formatBigNumber(n * n * 4)} opérations`,
      speedup: Math.pow(4, n) / (n * n * 4),
    },
  };

  return reductions[problemType] || reductions['SAT'];
}

function formatBigNumber(n: number): string {
  if (!isFinite(n)) return '∞';
  if (n < 1000) return n.toFixed(0);
  const exp = Math.floor(Math.log10(n));
  const mantissa = n / Math.pow(10, exp);
  return `${mantissa.toFixed(2)} × 10^${exp}`;
}
