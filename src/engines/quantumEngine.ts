/**
 * MOTEUR QUANTIQUE - Simulation de qubits et portes quantiques
 * Implémente les opérations de base sur des états quantiques
 */

export type Complex = { re: number; im: number };

export function complexMul(a: Complex, b: Complex): Complex {
  return {
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re,
  };
}

export function complexAdd(a: Complex, b: Complex): Complex {
  return { re: a.re + b.re, im: a.im + b.im };
}

export function complexAbs(a: Complex): number {
  return Math.sqrt(a.re * a.re + a.im * a.im);
}

export function complexPhase(a: Complex): number {
  return Math.atan2(a.im, a.re);
}

// État quantique d'un registre de n qubits
export class QuantumState {
  numQubits: number;
  amplitudes: Complex[];

  constructor(numQubits: number) {
    this.numQubits = numQubits;
    this.amplitudes = new Array(Math.pow(2, numQubits)).fill(null).map(() => ({ re: 0, im: 0 }));
    this.amplitudes[0] = { re: 1, im: 0 }; // |00...0⟩
  }

  // Applique une porte à 1 qubit
  applyGate1(gate: Complex[][], target: number): void {
    const n = this.numQubits;
    const size = Math.pow(2, n);
    const newAmplitudes = [...this.amplitudes];

    for (let i = 0; i < size; i++) {
      const bit = (i >> target) & 1;
      const partner = i ^ (1 << target);
      
      if (bit === 0) {
        newAmplitudes[i] = complexAdd(
          complexMul(gate[0][0], this.amplitudes[i]),
          complexMul(gate[0][1], this.amplitudes[partner])
        );
        newAmplitudes[partner] = complexAdd(
          complexMul(gate[1][0], this.amplitudes[i]),
          complexMul(gate[1][1], this.amplitudes[partner])
        );
      }
    }
    this.amplitudes = newAmplitudes;
  }

  // Mesure un qubit
  measure(qubit: number): { result: number; collapsed: QuantumState } {
    const size = Math.pow(2, this.numQubits);
    let prob0 = 0;

    for (let i = 0; i < size; i++) {
      if (((i >> qubit) & 1) === 0) {
        prob0 += Math.pow(complexAbs(this.amplitudes[i]), 2);
      }
    }

    const result = Math.random() < prob0 ? 0 : 1;
    const collapsed = new QuantumState(this.numQubits);
    
    const norm = result === 0 ? Math.sqrt(prob0) : Math.sqrt(1 - prob0);
    
    for (let i = 0; i < size; i++) {
      if (((i >> qubit) & 1) === result) {
        collapsed.amplitudes[i] = {
          re: this.amplitudes[i].re / norm,
          im: this.amplitudes[i].im / norm,
        };
      }
    }

    return { result, collapsed };
  }

  // Probabilités de chaque état de base
  getProbabilities(): number[] {
    return this.amplitudes.map(a => Math.pow(complexAbs(a), 2));
  }

  // Entropie de Von Neumann
  entropy(): number {
    const probs = this.getProbabilities().filter(p => p > 0);
    return -probs.reduce((sum, p) => sum + p * Math.log2(p), 0);
  }
}

// Portes quantiques standard
export const GATES: Record<string, Complex[][]> = {
  I: [[{ re: 1, im: 0 }, { re: 0, im: 0 }], [{ re: 0, im: 0 }, { re: 1, im: 0 }]],
  X: [[{ re: 0, im: 0 }, { re: 1, im: 0 }], [{ re: 1, im: 0 }, { re: 0, im: 0 }]],
  Y: [[{ re: 0, im: 0 }, { re: 0, im: -1 }], [{ re: 0, im: 1 }, { re: 0, im: 0 }]],
  Z: [[{ re: 1, im: 0 }, { re: 0, im: 0 }], [{ re: 0, im: 0 }, { re: -1, im: 0 }]],
  H: [
    [{ re: 1 / Math.sqrt(2), im: 0 }, { re: 1 / Math.sqrt(2), im: 0 }],
    [{ re: 1 / Math.sqrt(2), im: 0 }, { re: -1 / Math.sqrt(2), im: 0 }],
  ],
  S: [[{ re: 1, im: 0 }, { re: 0, im: 0 }], [{ re: 0, im: 0 }, { re: 0, im: 1 }]],
  T: [[{ re: 1, im: 0 }, { re: 0, im: 0 }], [{ re: 0, im: 0 }, { re: Math.cos(Math.PI / 4), im: Math.sin(Math.PI / 4) }]],
};

// Simulation de l'algorithme de Grover (recherche quantique)
export function groverSearch(numQubits: number, targetState: number): { steps: string[]; result: number; iterations: number } {
  const state = new QuantumState(numQubits);
  const steps: string[] = [];
  const N = Math.pow(2, numQubits);
  const iterations = Math.floor(Math.PI / 4 * Math.sqrt(N));

  steps.push(`Initialisation: |0⟩^${numQubits}`);
  steps.push(`Application de H à tous les qubits → superposition uniforme`);

  // Hadamard sur tous les qubits
  for (let i = 0; i < numQubits; i++) {
    state.applyGate1(GATES.H, i);
  }

  steps.push(`Nombre d'itérations optimal: ⌊π/4 × √${N}⌋ = ${iterations}`);

  // Itérations de Grover
  for (let iter = 0; iter < Math.min(iterations, 10); iter++) {
    // Oracle (phase flip sur l'état cible)
    state.amplitudes[targetState] = {
      re: -state.amplitudes[targetState].re,
      im: -state.amplitudes[targetState].im,
    };
    steps.push(`Itération ${iter + 1}: Oracle appliqué (phase flip sur |${targetState.toString(2).padStart(numQubits, '0')}⟩)`);

    // Diffusion
    for (let i = 0; i < numQubits; i++) {
      state.applyGate1(GATES.H, i);
      state.applyGate1(GATES.X, i);
    }
    // Phase shift contrôlé
    state.amplitudes[N - 1] = { re: -state.amplitudes[N - 1].re, im: -state.amplitudes[N - 1].im };
    for (let i = 0; i < numQubits; i++) {
      state.applyGate1(GATES.X, i);
      state.applyGate1(GATES.H, i);
    }
    steps.push(`  → Diffusion appliquée, amplification d'amplitude`);
  }

  const probs = state.getProbabilities();
  const maxProb = Math.max(...probs);
  const result = probs.indexOf(maxProb);

  steps.push(`Mesure: état |${result.toString(2).padStart(numQubits, '0')}⟩ avec probabilité ${(maxProb * 100).toFixed(1)}%`);

  return { steps, result, iterations };
}

// Calcul de fidélité entre deux états
export function fidelity(state1: QuantumState, state2: QuantumState): number {
  let overlap = { re: 0, im: 0 };
  for (let i = 0; i < state1.amplitudes.length; i++) {
    const conj = { re: state1.amplitudes[i].re, im: -state1.amplitudes[i].im };
    overlap = complexAdd(overlap, complexMul(conj, state2.amplitudes[i]));
  }
  return Math.pow(complexAbs(overlap), 2);
}
