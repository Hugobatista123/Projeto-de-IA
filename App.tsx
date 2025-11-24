import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowRightLeft, 
  BrainCircuit, 
  Sparkles, 
  Terminal, 
  Send, 
  Eraser,
  Copy,
  CheckCircle,
  Info,
  History,
  Trash2
} from 'lucide-react';
import { AgentMode, LogicResult, ContextMap, HistoryItem } from './types';
import { translateLogic } from './services/geminiService';
import SymbolToolbar from './components/SymbolToolbar';
import { SAMPLE_SENTENCES, SAMPLE_FORMULAS } from './constants';

const App: React.FC = () => {
  // State
  const [mode, setMode] = useState<AgentMode>(AgentMode.NL_TO_CPC);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<LogicResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [contextMap, setContextMap] = useState<ContextMap[]>([]);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Refs for text areas to manage focus
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Handlers
  const handleSwitchMode = () => {
    setMode(prev => prev === AgentMode.NL_TO_CPC ? AgentMode.CPC_TO_NL : AgentMode.NL_TO_CPC);
    setInput('');
    setResult(null);
    setError(null);
    setContextMap([]);
  };

  const handleInsertSymbol = (char: string) => {
    setInput(prev => prev + char);
    inputRef.current?.focus();
  };

  const handleContextChange = (index: number, field: 'symbol' | 'meaning', value: string) => {
    const newMap = [...contextMap];
    newMap[index] = { ...newMap[index], [field]: value };
    setContextMap(newMap);
  };

  const addContextRow = () => {
    const letters = ['P', 'Q', 'R', 'S', 'T'];
    const nextLetter = letters[contextMap.length] || '?';
    setContextMap([...contextMap, { symbol: nextLetter, meaning: '' }]);
  };

  const removeContextRow = (index: number) => {
    setContextMap(contextMap.filter((_, i) => i !== index));
  };

  const handleProcess = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await translateLogic(mode, input, contextMap);
      setResult(data);
      
      // Add to history
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        mode,
        input,
        result: data,
        timestamp: Date.now()
      };
      setHistory(prev => [newHistoryItem, ...prev].slice(0, 10));
    } catch (err) {
      setError("Ocorreu um erro ao processar sua solicitação. Verifique a chave da API ou tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadSample = () => {
    const samples = mode === AgentMode.NL_TO_CPC ? SAMPLE_SENTENCES : SAMPLE_FORMULAS;
    const randomSample = samples[Math.floor(Math.random() * samples.length)];
    setInput(randomSample);
    setResult(null);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadFromHistory = (item: HistoryItem) => {
    setMode(item.mode);
    setInput(item.input);
    setResult(item.result);
    if (item.result.propositions) {
        // If it was NL -> CPC, we don't really use the context map input, but good to reset
        setContextMap([]);
    }
    setShowHistory(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render Helper for Logic Symbols in Results
  const renderFormula = (formula: string) => {
    // Wrap variables in spans for color
    return formula.split(/([P-Z]|\(|\)|¬|∧|∨|→|↔)/g).map((part, i) => {
      if (/[P-Z]/.test(part)) return <span key={i} className="text-brand-400 font-bold">{part}</span>;
      if (/[¬∧∨→↔]/.test(part)) return <span key={i} className="text-pink-400 font-bold mx-1">{part}</span>;
      return <span key={i} className="text-slate-200">{part}</span>;
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-brand-900 selection:text-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-600 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.5)]">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">LogicFlow</h1>
              <p className="text-xs text-slate-400 font-mono">Agente de Lógica Proposicional</p>
            </div>
          </div>
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors relative"
          >
            <History className="w-5 h-5 text-slate-400" />
            {history.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-brand-500 rounded-full"></span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 relative">
        
        {/* History Drawer */}
        {showHistory && (
            <div className="mb-8 p-4 bg-slate-900 rounded-xl border border-slate-800 animate-in slide-in-from-top-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Histórico Recente</h3>
                <div className="space-y-3">
                    {history.length === 0 ? (
                        <p className="text-slate-500 text-sm italic">Nenhum histórico ainda.</p>
                    ) : (
                        history.map(item => (
                            <button 
                                key={item.id}
                                onClick={() => loadFromHistory(item)}
                                className="w-full text-left p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-transparent hover:border-brand-500/30 transition-all group"
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className={`text-xs px-2 py-0.5 rounded font-mono ${item.mode === AgentMode.NL_TO_CPC ? 'bg-purple-500/20 text-purple-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                                        {item.mode === AgentMode.NL_TO_CPC ? 'PT → LÓGICA' : 'LÓGICA → PT'}
                                    </span>
                                    <span className="text-xs text-slate-500">{new Date(item.timestamp).toLocaleTimeString()}</span>
                                </div>
                                <p className="text-sm text-slate-300 truncate font-mono">{item.input}</p>
                            </button>
                        ))
                    )}
                </div>
            </div>
        )}

        {/* Control Card */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
          
          {/* Mode Switcher */}
          <div className="flex border-b border-slate-800">
            <button
              onClick={() => mode !== AgentMode.NL_TO_CPC && handleSwitchMode()}
              className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-medium transition-all ${
                mode === AgentMode.NL_TO_CPC 
                  ? 'bg-slate-800 text-brand-400 border-b-2 border-brand-500' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              <Terminal className="w-4 h-4" />
              Linguagem Natural <ArrowRightLeft className="w-3 h-3 opacity-50" /> Lógica
            </button>
            <button
              onClick={() => mode !== AgentMode.CPC_TO_NL && handleSwitchMode()}
              className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-medium transition-all ${
                mode === AgentMode.CPC_TO_NL 
                  ? 'bg-slate-800 text-brand-400 border-b-2 border-brand-500' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              <Terminal className="w-4 h-4" />
              Lógica <ArrowRightLeft className="w-3 h-3 opacity-50" /> Linguagem Natural
            </button>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Introduction / Helper Text */}
            <div className="text-center mb-2">
              <p className="text-slate-400 text-sm">
                {mode === AgentMode.NL_TO_CPC 
                  ? 'Digite uma frase em português para convertê-la em uma fórmula formal (CPC).' 
                  : 'Digite uma fórmula lógica para gerar uma frase equivalente em português.'}
              </p>
            </div>

            {/* Input Area */}
            <div className="space-y-3">
              {mode === AgentMode.CPC_TO_NL && (
                <SymbolToolbar onInsert={handleInsertSymbol} disabled={isLoading} />
              )}
              
              <div className="relative group">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={mode === AgentMode.NL_TO_CPC 
                    ? "Ex: Se chover e eu não tiver guarda-chuva, então vou me molhar." 
                    : "Ex: (P ∧ ¬Q) → R"}
                  className="w-full h-32 bg-slate-950 border border-slate-700 rounded-xl p-4 text-lg font-mono text-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none resize-none transition-all shadow-inner placeholder:text-slate-600"
                />
                <div className="absolute bottom-3 right-3 flex gap-2">
                   <button 
                    onClick={loadSample}
                    className="p-1.5 bg-slate-800 text-slate-400 hover:text-brand-300 rounded-md text-xs flex items-center gap-1 border border-slate-700 hover:border-brand-500/50 transition-all"
                    title="Usar exemplo"
                  >
                    <Sparkles className="w-3 h-3" /> Exemplo
                  </button>
                  <button 
                    onClick={() => setInput('')}
                    className="p-1.5 bg-slate-800 text-slate-400 hover:text-red-400 rounded-md transition-colors border border-slate-700 hover:border-red-500/50"
                    title="Limpar"
                  >
                    <Eraser className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Context Inputs (Only for CPC -> NL) */}
            {mode === AgentMode.CPC_TO_NL && (
              <div className="bg-slate-950/50 rounded-xl border border-slate-800 p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <Info className="w-4 h-4 text-brand-500" /> Definir Contexto (Opcional)
                  </h3>
                  <button 
                    onClick={addContextRow}
                    className="text-xs text-brand-400 hover:text-brand-300 underline decoration-dotted underline-offset-4"
                  >
                    + Adicionar variável
                  </button>
                </div>
                
                {contextMap.length === 0 && (
                    <p className="text-xs text-slate-500 italic">Se vazio, a IA inventará um cenário criativo.</p>
                )}

                <div className="space-y-2">
                  {contextMap.map((ctx, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input 
                        type="text" 
                        value={ctx.symbol}
                        onChange={(e) => handleContextChange(idx, 'symbol', e.target.value.toUpperCase())}
                        className="w-12 bg-slate-900 border border-slate-700 rounded p-2 text-center font-mono font-bold text-brand-400 focus:border-brand-500 focus:outline-none"
                        placeholder="P"
                      />
                      <span className="text-slate-500">=</span>
                      <input 
                        type="text" 
                        value={ctx.meaning}
                        onChange={(e) => handleContextChange(idx, 'meaning', e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded p-2 text-sm text-slate-200 focus:border-brand-500 focus:outline-none"
                        placeholder="Significado (ex: Está chovendo)"
                      />
                      <button 
                        onClick={() => removeContextRow(idx)}
                        className="p-2 text-slate-600 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={handleProcess}
              disabled={isLoading || !input.trim()}
              className="w-full py-4 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-brand-500/25 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" /> Traduzir
                </>
              )}
            </button>

            {error && (
              <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-lg text-red-300 text-sm text-center">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Result Section */}
        {result && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
              <div className="bg-slate-950/50 border-b border-slate-800 p-4 flex items-center justify-between">
                <h2 className="font-bold text-slate-200 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" /> Resultado
                </h2>
                <button 
                    onClick={() => handleCopy(mode === AgentMode.NL_TO_CPC ? result.formula || '' : result.sentence || '')}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-brand-300 transition-colors"
                >
                    {copied ? <span className="text-emerald-400">Copiado!</span> : (
                        <>
                            <Copy className="w-3 h-3" /> Copiar Saída
                        </>
                    )}
                </button>
              </div>

              <div className="p-8 flex flex-col items-center text-center space-y-8">
                
                {/* Main Output Display */}
                <div className="w-full">
                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-bold">
                        {mode === AgentMode.NL_TO_CPC ? 'Fórmula Lógica Gerada' : 'Sentença em Linguagem Natural'}
                    </p>
                    <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 relative group">
                        <div className="text-2xl md:text-3xl font-mono leading-relaxed">
                            {mode === AgentMode.NL_TO_CPC ? (
                                result.formula && renderFormula(result.formula)
                            ) : (
                                <span className="text-brand-100 font-sans font-medium">"{result.sentence}"</span>
                            )}
                        </div>
                        <div className="absolute inset-0 bg-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
                    </div>
                </div>

                {/* Legend / Propositions (Mode 1 only mostly) */}
                {result.propositions && result.propositions.length > 0 && (
                  <div className="w-full max-w-lg bg-slate-800/30 rounded-lg border border-slate-800 p-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-3 text-left border-b border-slate-700 pb-2">Legenda</h3>
                    <ul className="space-y-2 text-left">
                      {result.propositions.map((prop, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <span className="font-mono font-bold text-brand-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">{prop.symbol}</span>
                          <span className="text-slate-300 mt-0.5">{prop.meaning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Explanation */}
                <div className="w-full text-left bg-blue-900/10 rounded-lg p-4 border border-blue-900/30">
                  <h3 className="text-xs font-bold text-blue-400 uppercase mb-2 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" /> Análise do Agente
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {result.explanation}
                  </p>
                </div>

              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-slate-600 text-xs py-6 fixed bottom-0 w-full bg-slate-950/80 backdrop-blur pointer-events-none">
        <span className="pointer-events-auto">Powered by Gemini 2.5 Flash • React 18 • Tailwind</span>
      </footer>
    </div>
  );
};

export default App;