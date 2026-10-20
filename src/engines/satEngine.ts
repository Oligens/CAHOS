/**
 * MOTEUR SAT / P vs NP - Solveur de satisfiabilité booléenne
 * Implémente DPLL simplifié + heuristiques
 */

export interface Clause {
  literals: number[];
}

export interface SATProblem {
  numVars: number;
  clauses: Clause[];
}

// Génère un problème SAT aléatoire
export function generateSAT(numVars: number, numClauses: number): SATProblem {
  const clauses: Clause[] = [];
  for (let i = 0; i < numClauses; i++) {
    const clauseSize = Math.floor(Math.random() * 3) + 2; // 2-SAT ou 3-SAT
    const literals: number[] = [];
    const usedVars = new Set<number>();
    
    for (let j = 0; j < clauseSize; j++) {
      let v: number;
      do {
        v = Math.floor(Math.random() * numVars) + 1;
      } while (usedVars.has(v));
      usedVars.add(v);
      literals.push(Math.random() > 0.5 ? v : -v);
    }
    clauses.push({ literals });
  }
  return { numVars, clauses };
}

// Évalue si une assignation satisfait le problème
export function evaluateSAT(problem: SATProblem, assignment: boolean[]): boolean {
  return problem.clauses.every(clause =>
    clause.literals.some(lit => {
      const varIdx = Math.abs(lit) - 1;
      const value = assignment[varIdx];
      return lit > 0 ? value : !value;
    })
  );
}

// Solveur par backtracking (DPLL simplifié)
export interface SolveResult {
  satisfiable: boolean;
  assignment: boolean[] | null;
  stepsExplored: number;
  time: number;
}

export function solveDPLL(problem: SATProblem): SolveResult {
  const start = performance.now();
  let stepsExplored = 0;
  
  function unitPropagation(clauses: Clause[], assignment: (boolean | null)[]): boolean {
    let changed = true;
    while (changed) {
      changed = false;
      for (const clause of clauses) {
        const unassigned = clause.literals.filter(lit => assignment[Math.abs(lit) - 1] === null);
        if (unassigned.length === 0) {
          const satisfied = clause.literals.some(lit => {
            const val = assignment[Math.abs(lit) - 1];
            return val !== null && (lit > 0 ? val : !val);
          });
          if (!satisfied) return false;
        } else if (unassigned.length === 1) {
          const lit = unassigned[0];
          const idx = Math.abs(lit) - 1;
          assignment[idx] = lit > 0;
          changed = true;
        }
      }
    }
    return true;
  }

  function solve(assignment: (boolean | null)[]): boolean {
    stepsExplored++;
    
    if (!unitPropagation(problem.clauses, assignment)) return false;
    
    const unassignedIdx = assignment.findIndex(v => v === null);
    if (unassignedIdx === -1) {
      return evaluateSAT(problem, assignment as boolean[]);
    }
    
    // Branchement
    for (const value of [true, false]) {
      const newAssignment = [...assignment];
      newAssignment[unassignedIdx] = value;
      if (solve(newAssignment)) {
        assignment[unassignedIdx] = value;
        return true;
      }
    }
    
    return false;
  }

  const assignment: (boolean | null)[] = new Array(problem.numVars).fill(null);
  const satisfiable = solve(assignment);
  const time = performance.now() - start;
  
  return {
    satisfiable,
    assignment: satisfiable ? (assignment as boolean[]) : null,
    stepsExplored,
    time,
  };
}

// Génération de preuve de réduction polynomiale
export function generateReductionProof(): string[] {
  return [
    "Réduction: 3-SAT ≤_p CLIQUE",
    "Construction du graphe: pour chaque clause Cᵢ, créer un triplet de sommets",
    "Arêtes: connecter les sommets de clauses différentes qui ne sont pas contradictoires",
    "Le graphe a une clique de taille k ⟺ la formule est satisfiable",
    "Complexité de la réduction: O(k² × n) où k = nb clauses, n = nb variables",
    "Conclusion: 3-SAT ∈ P ⟹ CLIQUE ∈ P ⟹ tous les NP-complets ∈ P",
  ];
}
