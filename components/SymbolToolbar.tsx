import React from 'react';
import { LOGIC_SYMBOLS } from '../constants';

interface SymbolToolbarProps {
  onInsert: (char: string) => void;
  disabled?: boolean;
}

const SymbolToolbar: React.FC<SymbolToolbarProps> = ({ onInsert, disabled }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-3 p-2 bg-slate-800/50 rounded-lg border border-slate-700">
      <span className="text-xs text-slate-400 uppercase font-bold tracking-wider flex items-center mr-2">
        Símbolos:
      </span>
      {LOGIC_SYMBOLS.map((s) => (
        <button
          key={s.key}
          type="button"
          onClick={() => onInsert(s.char)}
          disabled={disabled}
          title={s.name}
          className="px-3 py-1.5 bg-slate-700 hover:bg-brand-600 text-white rounded text-sm font-mono transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm border border-slate-600 hover:border-brand-500"
        >
          {s.char}
        </button>
      ))}
    </div>
  );
};

export default SymbolToolbar;