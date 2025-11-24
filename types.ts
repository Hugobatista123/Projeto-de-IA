export enum AgentMode {
  NL_TO_CPC = 'NL_TO_CPC',
  CPC_TO_NL = 'CPC_TO_NL'
}

export interface Proposition {
  symbol: string;
  meaning: string;
}

export interface LogicResult {
  formula?: string;
  sentence?: string;
  propositions?: Proposition[];
  explanation: string;
}

export interface HistoryItem {
  id: string;
  mode: AgentMode;
  input: string;
  result: LogicResult;
  timestamp: number;
}

export interface ContextMap {
  symbol: string;
  meaning: string;
}