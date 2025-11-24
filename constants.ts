export const LOGIC_SYMBOLS = [
  { char: '¬', name: 'Negação (Não)', key: 'not' },
  { char: '∧', name: 'Conjunção (E)', key: 'and' },
  { char: '∨', name: 'Disjunção (Ou)', key: 'or' },
  { char: '→', name: 'Implicação (Se...então)', key: 'imp' },
  { char: '↔', name: 'Bicondicional (Se e somente se)', key: 'iff' },
  { char: '(', name: 'Parêntese Abrindo', key: 'open' },
  { char: ')', name: 'Parêntese Fechando', key: 'close' },
];

export const SAMPLE_SENTENCES = [
  "Se chover, então a rua fica molhada.",
  "Estudo e passo na prova ou não estudo e reprovo.",
  "O pássaro canta se e somente se estiver feliz.",
  "Não é verdade que o céu é verde e a terra é plana."
];

export const SAMPLE_FORMULAS = [
  "P → Q",
  "(P ∧ Q) → R",
  "¬P ∨ Q",
  "(P ↔ Q) ∧ (R → S)"
];