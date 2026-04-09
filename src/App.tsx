import { useState, useEffect, useCallback } from 'react';
import { Copy, RefreshCw, Check, ShieldCheck, Eye, EyeOff, History, Trash2 } from 'lucide-react';

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

const TIPS = [
  "Senhas com mais de 16 caracteres e símbolos são exponencialmente mais difíceis de quebrar por força bruta.",
  "Evite o óbvio: Nunca use datas de nascimento, nomes ou informações pessoais nas suas senhas.",
  "Misture tudo: Um mix de letras maiúsculas, minúsculas, números e símbolos é a chave para segurança.",
  "Uma senha por conta: Nunca reutilize a mesma senha para diferentes sites ou serviços importantes.",
  "Cofre digital: Utilize um bom gerenciador de senhas para armazenar suas senhas longas e complexas."
];

export default function App() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
  });
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [history, setHistory] = useState<string[]>([]);
  const [currentTip, setCurrentTip] = useState(0);

  const generatePassword = useCallback((addToHistory = true) => {
    let charset = '';
    if (options.lowercase) charset += LOWERCASE;
    if (options.uppercase) charset += UPPERCASE;
    if (options.numbers) charset += NUMBERS;
    if (options.symbols) charset += SYMBOLS;

    if (charset === '') {
      setPassword('');
      return;
    }

    let newPassword = '';
    const requiredChars = [];
    if (options.lowercase) requiredChars.push(LOWERCASE[Math.floor(Math.random() * LOWERCASE.length)]);
    if (options.uppercase) requiredChars.push(UPPERCASE[Math.floor(Math.random() * UPPERCASE.length)]);
    if (options.numbers) requiredChars.push(NUMBERS[Math.floor(Math.random() * NUMBERS.length)]);
    if (options.symbols) requiredChars.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);

    for (let i = 0; i < length - requiredChars.length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }

    newPassword = (newPassword + requiredChars.join(''))
      .split('')
      .sort(() => 0.5 - Math.random())
      .join('');

    setPassword(newPassword);
    setCopied(false);

    if (addToHistory) {
      setHistory(prev => [newPassword, ...prev.slice(0, 4)]);
    }
    setCurrentTip(Math.floor(Math.random() * TIPS.length));
  }, [length, options]);

  useEffect(() => {
    generatePassword(false);
  }, [generatePassword]);

  const handleCopy = async (text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleOptionChange = (option: keyof typeof options) => {
    setOptions((prev) => {
      const next = { ...prev, [option]: !prev[option] };
      if (!Object.values(next).some(Boolean)) return prev;
      return next;
    });
  };

  const calculateStrength = () => {
    let score = 0;
    if (length > 8) score += 1;
    if (length > 12) score += 1;
    if (length >= 16) score += 1;
    if (options.uppercase) score += 1;
    if (options.numbers) score += 1;
    if (options.symbols) score += 1;

    if (score <= 2) return { label: 'Fraca', color: 'bg-red-500', text: 'text-red-500' };
    if (score <= 4) return { label: 'Média', color: 'bg-amber-500', text: 'text-amber-500' };
    return { label: 'Forte', color: 'bg-emerald-500', text: 'text-emerald-500' };
  };

  const strength = calculateStrength();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))]">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Generator Card */}
        <div className="lg:col-span-7 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight leading-tight">G-Code</h1>
              <p className="text-xs text-slate-400 font-medium">Sistema Gerador de Senhas Seguras</p>
            </div>
          </div>

          <div className="relative group mb-8">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative flex items-center justify-between bg-slate-950 border border-slate-800 rounded-2xl p-4 md:p-5">
              <div className="overflow-hidden mr-4 flex-1">
                <p className={`font-mono text-xl md:text-2xl tracking-wider break-all ${password ? 'text-emerald-400' : 'text-slate-600'}`}>
                  {password ? (isVisible ? password : '•'.repeat(password.length)) : 'Selecione opções'}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setIsVisible(!isVisible)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                  title={isVisible ? "Ocultar senha" : "Mostrar senha"}
                >
                  {isVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => generatePassword(true)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                  title="Gerar nova senha"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleCopy(password)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                  title="Copiar senha"
                >
                  {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-300">Tamanho da Senha</label>
                <span className="text-lg font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg">
                  {length}
                </span>
              </div>
              <input
                type="range"
                min="6"
                max="64"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-800/50">
              <Checkbox label="Minúsculas" checked={options.lowercase} onChange={() => handleOptionChange('lowercase')} />
              <Checkbox label="Maiúsculas" checked={options.uppercase} onChange={() => handleOptionChange('uppercase')} />
              <Checkbox label="Números" checked={options.numbers} onChange={() => handleOptionChange('numbers')} />
              <Checkbox label="Símbolos" checked={options.symbols} onChange={() => handleOptionChange('symbols')} />
            </div>

            <div className="pt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-400">Força da Senha</span>
                <span className={`text-sm font-semibold ${strength.text}`}>{strength.label}</span>
              </div>
              <div className="flex gap-1.5 h-1.5 w-full">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`h-full flex-1 rounded-full transition-colors duration-300 ${
                    password && (
                      (i === 1) || 
                      (i === 2 && strength.label !== 'Fraca') || 
                      (i === 3 && strength.label === 'Forte') || 
                      (i === 4 && strength.label === 'Forte' && length >= 16)
                    ) ? strength.color : 'bg-slate-800'
                  }`}></div>
                ))}
              </div>
            </div>

            <button
              onClick={() => generatePassword(true)}
              className="w-full mt-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-4 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <RefreshCw className="w-5 h-5" />
              Gerar Senha G-Code
            </button>
          </div>
        </div>

        {/* History Sidebar */}
        <div className="lg:col-span-5 bg-slate-900/40 backdrop-blur-md border border-slate-800/50 rounded-3xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-slate-300">
              <History className="w-5 h-5" />
              <h2 className="font-semibold">Histórico Recente</h2>
            </div>
            <button 
              onClick={() => setHistory([])}
              className="text-slate-500 hover:text-red-400 transition-colors"
              title="Limpar histórico"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
            {history.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2 py-12">
                <ShieldCheck className="w-12 h-12 opacity-10" />
                <p className="text-sm">Nenhuma senha gerada ainda</p>
              </div>
            ) : (
              history.map((h, i) => (
                <div key={i} className="group flex items-center justify-between bg-slate-950/50 border border-slate-800/50 p-3 rounded-xl hover:border-emerald-500/30 transition-all">
                  <span className="font-mono text-sm text-slate-400 truncate mr-2">{h}</span>
                  <button
                    onClick={() => handleCopy(h)}
                    className="p-1.5 text-slate-600 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-6 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
            <p className="text-xs text-emerald-500/70 leading-relaxed transition-opacity">
              <strong>Dica G-Code:</strong> {TIPS[currentTip]}
            </p>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="mt-8 text-slate-500/80 text-sm font-medium tracking-wide">
        Desenvolvido por <span className="text-emerald-500/90 font-bold">Gêrlan Cardoso</span>
      </div>
    </div>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/50 cursor-pointer transition-colors border border-transparent hover:border-slate-800">
      <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${checked ? 'bg-emerald-500 border-emerald-500' : 'bg-slate-950 border-slate-700'} border`}>
        {checked && <Check className="w-3.5 h-3.5 text-slate-950" strokeWidth={3} />}
      </div>
      <span className={`text-sm ${checked ? 'text-slate-200' : 'text-slate-400'}`}>{label}</span>
    </label>
  );
}
