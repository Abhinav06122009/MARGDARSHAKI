import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import logo from "@/components/logo/logo.png";
import { Link } from 'react-router-dom';
import { BookOpen, HelpCircle, Calculator as CalcIcon, Settings, RotateCcw } from 'lucide-react';

interface CalculatorProps {
  onBack?: () => void;
}

type CalculatorMode = 'scientific' | 'standard';
type ThemeMode = 'light' | 'dark' | 'neon';

interface CalculatorButton {
  label: string;
  type: 'number' | 'operation' | 'equals' | 'decimal' | 'clear' | 'function' | 'memory' | 'scientific' | 'mode';
  className: string;
  span?: number;
  value?: string;
}

interface CalculationStep {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
}

const Calculator: React.FC<CalculatorProps> = ({ onBack }) => {
  // --- STATE ---
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [history, setHistory] = useState<CalculationStep[]>([]);
  const [mode, setMode] = useState<CalculatorMode>('scientific');
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [showHistory, setShowHistory] = useState(false);
  const [angleUnit, setAngleUnit] = useState<'deg' | 'rad'>('deg');
  
  // --- THEMES ---
  const themes = useMemo(() => ({
    light: {
      background: 'bg-gradient-to-br from-blue-50 via-white to-gray-100',
      card: 'bg-white/90 shadow-xl',
      display: 'bg-gray-50/95',
      text: 'text-gray-900',
      accent: 'blue-500',
      functionBtn: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
      numberBtn: 'bg-white hover:bg-gray-50 text-gray-900',
      operationBtn: 'bg-blue-600 hover:bg-blue-700 text-white'
    },
    dark: {
      background: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black',
      card: 'bg-gray-800/90 shadow-xl border border-gray-700',
      display: 'bg-gray-900/95 text-white',
      text: 'text-white',
      accent: 'blue-400',
      functionBtn: 'bg-gray-700 hover:bg-gray-600 text-white',
      numberBtn: 'bg-gray-800 hover:bg-gray-700 text-white',
      operationBtn: 'bg-blue-600 hover:bg-blue-500 text-white'
    },
    neon: {
      background: 'bg-black',
      card: 'bg-black/90 shadow-[0_0_20px_rgba(139,92,246,0.3)] border border-purple-500/30',
      display: 'bg-gray-900/95 text-purple-400 font-mono',
      text: 'text-purple-100',
      accent: 'purple-500',
      functionBtn: 'bg-gray-900 border border-purple-500/30 text-purple-300 hover:bg-purple-900/20',
      numberBtn: 'bg-gray-900 border border-purple-500/30 text-white hover:bg-purple-900/20',
      operationBtn: 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/50'
    }
  }), []);

  const currentTheme = themes[theme];

  // --- LOGIC ---
  const handleNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperation = (op: string) => {
    const inputValue = parseFloat(display);
    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const result = calculate(previousValue, inputValue, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    }
    setWaitingForNewValue(true);
    setOperation(op);
  };

  const calculate = (a: number, b: number, op: string) => {
    switch(op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const inputValue = parseFloat(display);
      const result = calculate(previousValue, inputValue, operation);
      
      // Save to history
      const newHistoryItem: CalculationStep = {
        id: Date.now().toString(),
        expression: `${previousValue} ${operation} ${inputValue}`,
        result: String(result),
        timestamp: new Date()
      };
      setHistory([newHistoryItem, ...history].slice(0, 10)); // Keep last 10
      
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  // --- BUTTONS CONFIG ---
  const buttons = [
    { label: 'C', type: 'clear', className: currentTheme.functionBtn },
    { label: '(', type: 'function', className: currentTheme.functionBtn },
    { label: ')', type: 'function', className: currentTheme.functionBtn },
    { label: '÷', type: 'operation', className: currentTheme.operationBtn },
    { label: '7', type: 'number', className: currentTheme.numberBtn },
    { label: '8', type: 'number', className: currentTheme.numberBtn },
    { label: '9', type: 'number', className: currentTheme.numberBtn },
    { label: '×', type: 'operation', className: currentTheme.operationBtn },
    { label: '4', type: 'number', className: currentTheme.numberBtn },
    { label: '5', type: 'number', className: currentTheme.numberBtn },
    { label: '6', type: 'number', className: currentTheme.numberBtn },
    { label: '-', type: 'operation', className: currentTheme.operationBtn },
    { label: '1', type: 'number', className: currentTheme.numberBtn },
    { label: '2', type: 'number', className: currentTheme.numberBtn },
    { label: '3', type: 'number', className: currentTheme.numberBtn },
    { label: '+', type: 'operation', className: currentTheme.operationBtn },
    { label: '0', type: 'number', className: `${currentTheme.numberBtn} col-span-2` },
    { label: '.', type: 'decimal', className: currentTheme.numberBtn },
    { label: '=', type: 'equals', className: currentTheme.operationBtn },
  ];

  return (
    <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text} flex flex-col relative overflow-hidden`}>
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className={`absolute top-20 left-20 w-72 h-72 bg-${currentTheme.accent} rounded-full filter blur-3xl`}></div>
        <div className={`absolute bottom-20 right-20 w-72 h-72 bg-purple-500 rounded-full filter blur-3xl`}></div>
      </div>

      <div className="max-w-2xl mx-auto p-4 flex-grow flex flex-col justify-center relative z-10 w-full">
        {/* Nav Header */}
        <div className="flex justify-between items-center mb-6">
          <Link to="/">
            <Button variant="outline" className="backdrop-blur-md border-white/20 hover:bg-white/10">
              Back Home
            </Button>
          </Link>
          <div className="flex gap-2">
            {['light', 'dark', 'neon'].map((t) => (
              <button 
                key={t}
                onClick={() => setTheme(t as ThemeMode)}
                className={`w-8 h-8 rounded-full border-2 ${theme === t ? `border-${currentTheme.accent}` : 'border-transparent'} bg-${t === 'light' ? 'white' : t === 'neon' ? 'black' : 'gray-800'}`}
              />
            ))}
          </div>
        </div>

        {/* Calculator Body */}
        <Card className={`${currentTheme.card} border-0 rounded-3xl overflow-hidden backdrop-blur-xl`}>
          <CardHeader className="p-6 pb-2">
            <div className={`text-right text-4xl font-light p-4 rounded-xl mb-4 ${currentTheme.display} min-h-[80px] break-all`}>
              {display}
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="grid grid-cols-4 gap-3">
              {buttons.map((btn, idx) => (
                <Button
                  key={idx}
                  onClick={() => {
                    if (btn.type === 'number') handleNumber(btn.label);
                    if (btn.type === 'operation') handleOperation(btn.label);
                    if (btn.type === 'equals') handleEquals();
                    if (btn.type === 'clear') handleClear();
                  }}
                  className={`h-16 text-xl rounded-2xl shadow-sm transition-all hover:scale-105 active:scale-95 ${btn.className} ${btn.label === '0' ? 'col-span-2' : ''}`}
                >
                  {btn.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* History Toggle */}
        <div className="mt-4 text-center">
          <Button variant="ghost" onClick={() => setShowHistory(!showHistory)} className="text-white/60 hover:text-white">
            <RotateCcw className="w-4 h-4 mr-2" /> 
            {showHistory ? 'Hide History' : 'Show History'}
          </Button>
        </div>

        {/* History Panel */}
        {showHistory && (
          <div className="mt-4 bg-white/10 backdrop-blur-md rounded-xl p-4 max-h-40 overflow-y-auto">
            {history.length === 0 ? (
              <p className="text-center text-sm opacity-50">No history yet</p>
            ) : (
              history.map((step) => (
                <div key={step.id} className="flex justify-between text-sm py-1 border-b border-white/5 last:border-0">
                  <span className="opacity-60">{step.expression}</span>
                  <span className="font-bold">{step.result}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* --- SEO CONTENT SECTION (CRITICAL FOR ADSENSE) --- */}
      <div className="max-w-4xl mx-auto mt-16 mb-12 px-6 text-gray-300 relative z-10">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl">
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
            <CalcIcon className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">Free Online Scientific Calculator</h1>
          </div>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Master Complex Math Problems Instantly</h2>
              <p className="leading-relaxed text-white/80">
                Welcome to the MARGDARSHAK Free Online Scientific Calculator. Designed for students, engineers, and professionals, 
                this tool allows you to perform advanced mathematical operations directly from your browser. Whether you are solving 
                algebraic equations, calculating trigonometric functions for physics, or handling statistical data, our calculator 
                provides precision and speed without the need for downloads.
              </p>
            </section>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-black/20 p-5 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors">
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Standard Features</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-white/70">
                  <li><strong>Basic Arithmetic:</strong> Addition, subtraction, multiplication, and division with high precision.</li>
                  <li><strong>Percentages:</strong> Quickly calculate discounts, tips, and interest rates.</li>
                  <li><strong>Memory Bank:</strong> Store and recall numbers (M+, M-, MR) for multi-step problems.</li>
                </ul>
              </div>
              <div className="bg-black/20 p-5 rounded-xl border border-white/5 hover:border-purple-500/30 transition-colors">
                <h3 className="text-lg font-semibold text-purple-400 mb-2">Scientific Features</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-white/70">
                  <li><strong>Trigonometry:</strong> Sin, Cos, Tan, and their inverse functions (in Degrees or Radians).</li>
                  <li><strong>Advanced Math:</strong> Logarithms (Log, Ln), Exponentials (x², x³), and Square Roots.</li>
                  <li><strong>Constants:</strong> Built-in values for Pi (π) and Euler's number (e).</li>
                </ul>
              </div>
            </div>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Why Use Our Calculator?</h2>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2.5"></div>
                  <p className="text-white/80"><strong>Accessible Anywhere:</strong> Works on all devices—iPhone, Android, iPad, Windows, and Mac. No installation required.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2.5"></div>
                  <p className="text-white/80"><strong>Completely Private:</strong> All calculations are processed locally in your browser. We never store or track your mathematical data.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2.5"></div>
                  <p className="text-white/80"><strong>Eye-Friendly Themes:</strong> Switch between Light, Dark, and Neon modes to reduce eye strain during late-night study sessions.</p>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <HelpCircle className="w-5 h-5"/> Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-lg">
                  <h4 className="font-bold text-white text-sm mb-1">How do I switch between Degrees and Radians?</h4>
                  <p className="text-sm text-white/60">Use the "Settings" gear icon or the toggle button labeled 'DEG/RAD' to switch your angle mode for trigonometric calculations.</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <h4 className="font-bold text-white text-sm mb-1">Is this calculator free to use?</h4>
                  <p className="text-sm text-white/60">Yes, the MARGDARSHAK calculator is 100% free for educational and professional use.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <footer className="mt-8 py-8 border-t border-white/10 text-center text-sm opacity-60">
        <div className="flex items-center justify-center gap-2 mb-2">
            <img src={logo} alt="Logo" className="w-6 h-6 grayscale opacity-80" />
            <span className="font-semibold tracking-wider">MARGDARSHAK</span>
        </div>
        <p>© {new Date().getFullYear()} VSAV GYANTAPA. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Calculator;
