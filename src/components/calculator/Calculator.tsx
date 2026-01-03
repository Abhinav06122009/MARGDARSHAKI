import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import logo from "@/components/logo/logo.png";
import { Link } from 'react-router-dom';

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
  disabled?: boolean;
  tooltip?: string;
}

interface CalculationStep {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
}

interface MemoryState {
  value: number;
  operations: string[];
}

const Calculator: React.FC<CalculatorProps> = ({ onBack }) => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [history, setHistory] = useState<CalculationStep[]>([]);
  const [memory, setMemory] = useState<MemoryState>({ value: 0, operations: [] });
  const [mode, setMode] = useState<CalculatorMode>('scientific');
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastPressed, setLastPressed] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [pressedButton, setPressedButton] = useState<string>('');
  const [displayAnimation, setDisplayAnimation] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  
  const [angleUnit, setAngleUnit] = useState<'deg' | 'rad'>('deg');
  const [precision, setPrecision] = useState(10);
  const [scientificNotation, setScientificNotation] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  
  const audioContext = useRef<AudioContext | null>(null);
  const calculatorRef = useRef<HTMLDivElement>(null);
  const displayRef = useRef<HTMLDivElement>(null);

  const themes = useMemo(() => ({
    light: {
      background: 'bg-gradient-to-br from-blue-50 via-white to-gray-100',
      card: 'bg-white/90 shadow-xl',
      display: 'bg-gray-50/95',
      numberBtn: 'bg-gradient-to-b from-gray-100 to-gray-200 hover:from-gray-50 hover:to-gray-150 text-gray-900',
      operationBtn: 'bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white',
      functionBtn: 'bg-gradient-to-b from-gray-300 to-gray-400 hover:from-gray-200 hover:to-gray-300 text-gray-800',
      accent: 'blue-500',
      text: 'text-gray-900'
    },
    dark: {
      background: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black',
      card: 'bg-gray-800/90 shadow-xl border border-gray-700',
      display: 'bg-gray-900/95 text-white',
      numberBtn: 'bg-gray-700 hover:bg-gray-600 text-white',
      operationBtn: 'bg-blue-600 hover:bg-blue-500 text-white',
      functionBtn: 'bg-gray-600 hover:bg-gray-500 text-white',
      accent: 'blue-400',
      text: 'text-white'
    },
    neon: {
      background: 'bg-black',
      card: 'bg-black/90 shadow-[0_0_20px_rgba(139,92,246,0.3)] border border-purple-500/30',
      display: 'bg-gray-900/95 text-purple-400 font-mono',
      numberBtn: 'bg-gray-900 border border-purple-500/30 text-purple-100 hover:bg-purple-900/20',
      operationBtn: 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_10px_rgba(139,92,246,0.5)]',
      functionBtn: 'bg-gray-900 border border-pink-500/30 text-pink-400 hover:bg-pink-900/20',
      accent: 'purple-500',
      text: 'text-purple-100'
    }
  }), []);

  const currentTheme = themes[theme];

  const playAdvancedSound = useCallback((frequency: number, type: 'sine' | 'square' | 'triangle' = 'sine', duration: number = 100) => {
    if (!soundEnabled) return;
    
    try {
      if (!audioContext.current) {
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const oscillator = audioContext.current.createOscillator();
      const gainNode = audioContext.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.current.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0.1, audioContext.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + duration / 1000);
      
      oscillator.start(audioContext.current.currentTime);
      oscillator.stop(audioContext.current.currentTime + duration / 1000);
    } catch (error) {
      console.log('Audio not supported');
    }
  }, [soundEnabled]);

  const triggerAdvancedHaptic = useCallback((pattern: number[] = [10]) => {
    if (!hapticEnabled) return;
    
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 150);
  }, [hapticEnabled]);

  const formatAdvancedDisplay = useCallback((value: string): string => {
    if (errorMessage) return errorMessage;
    
    const num = parseFloat(value.replace(/,/g, ''));
    if (isNaN(num)) return value;
    
    if (scientificNotation && (Math.abs(num) >= 1000000 || (Math.abs(num) < 0.001 && num !== 0))) {
      return num.toExponential(precision);
    }
    
    if (Math.abs(num) > 999999999) {
      return num.toExponential(6);
    }
    
    const formatted = Math.abs(num) >= 1000 
      ? num.toLocaleString('en-US', { maximumFractionDigits: precision })
      : parseFloat(num.toFixed(precision)).toString();
    
    return formatted;
  }, [errorMessage, scientificNotation, precision]);

  const scientificFunctions = {
    sin: (x: number) => angleUnit === 'deg' ? Math.sin(x * Math.PI / 180) : Math.sin(x),
    cos: (x: number) => angleUnit === 'deg' ? Math.cos(x * Math.PI / 180) : Math.cos(x),
    tan: (x: number) => angleUnit === 'deg' ? Math.tan(x * Math.PI / 180) : Math.tan(x),
    log: Math.log10,
    ln: Math.log,
    sqrt: Math.sqrt,
    square: (x: number) => x * x,
    cube: (x: number) => x * x * x,
    power: Math.pow,
    factorial: (n: number) => {
      if (n < 0 || n % 1 !== 0) return NaN;
      if (n === 0 || n === 1) return 1;
      let result = 1;
      for (let i = 2; i <= n; i++) result *= i;
      return result;
    },
    pi: () => Math.PI,
    e: () => Math.E
  };

  const calculateAdvanced = useCallback((firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+': return firstValue + secondValue;
      case '-': return firstValue - secondValue;
      case '×': return firstValue * secondValue;
      case '÷':
        if (secondValue === 0) {
          setErrorMessage('Division by zero');
          return NaN;
        }
        return firstValue / secondValue;
      case '%': return firstValue % secondValue;
      case '^': return Math.pow(firstValue, secondValue);
      case 'mod': return firstValue % secondValue;
      default: return secondValue;
    }
  }, []);

  const handleMemory = useCallback((operation: 'MS' | 'MR' | 'MC' | 'M+' | 'M-') => {
    const currentValue = parseFloat(display.replace(/,/g, ''));
    
    switch (operation) {
      case 'MS': // Memory Store
        setMemory(prev => ({
          value: currentValue,
          operations: [...prev.operations, `MS: ${currentValue}`]
        }));
        break;
      case 'MR': // Memory Recall
        setDisplay(String(memory.value));
        setWaitingForNewValue(true);
        break;
      case 'MC': // Memory Clear
        setMemory({ value: 0, operations: [] });
        break;
      case 'M+': // Memory Add
        setMemory(prev => ({
          value: prev.value + currentValue,
          operations: [...prev.operations, `M+: ${currentValue}`]
        }));
        break;
      case 'M-': // Memory Subtract
        setMemory(prev => ({
          value: prev.value - currentValue,
          operations: [...prev.operations, `M-: ${currentValue}`]
        }));
        break;
    }
    
    triggerAdvancedHaptic([20, 10, 20]);
    playAdvancedSound(800, 'triangle', 150);
  }, [display, memory.value, triggerAdvancedHaptic, playAdvancedSound]);

  const handleScientific = useCallback((func: string) => {
    const currentValue = parseFloat(display.replace(/,/g, ''));
    let result: number;
    
    switch (func) {
      case 'sin': result = scientificFunctions.sin(currentValue); break;
      case 'cos': result = scientificFunctions.cos(currentValue); break;
      case 'tan': result = scientificFunctions.tan(currentValue); break;
      case 'log': result = scientificFunctions.log(currentValue); break;
      case 'ln': result = scientificFunctions.ln(currentValue); break;
      case '√': result = scientificFunctions.sqrt(currentValue); break;
      case 'x²': result = scientificFunctions.square(currentValue); break;
      case 'x³': result = scientificFunctions.cube(currentValue); break;
      case 'x!': result = scientificFunctions.factorial(currentValue); break;
      case 'π': result = scientificFunctions.pi(); break;
      case 'e': result = scientificFunctions.e(); break;
      case '1/x': result = 1 / currentValue; break;
      case '|x|': result = Math.abs(currentValue); break;
      default: result = currentValue;
    }
    
    if (isNaN(result) || !isFinite(result)) {
      setErrorMessage('Math Error');
      return;
    }
    
    setDisplay(String(result));
    setWaitingForNewValue(true);
    playAdvancedSound(1000, 'sine', 200);
  }, [display, angleUnit]);

  const getButtons = useCallback((): CalculatorButton[] => {
    const baseStyle = 'font-semibold rounded-2xl border-0 transition-all duration-300 transform relative overflow-hidden shadow-lg hover:shadow-xl';
    
    if (mode === 'scientific') {
      return [
        { label: '2nd', type: 'function', className: `${baseStyle} ${currentTheme.functionBtn} h-12 text-sm` },
        { label: angleUnit.toUpperCase(), type: 'function', className: `${baseStyle} ${currentTheme.functionBtn} h-12 text-sm` },
        { label: 'sin', type: 'scientific', className: `${baseStyle} ${currentTheme.functionBtn} h-12 text-sm` },
        { label: 'cos', type: 'scientific', className: `${baseStyle} ${currentTheme.functionBtn} h-12 text-sm` },
        { label: 'tan', type: 'scientific', className: `${baseStyle} ${currentTheme.functionBtn} h-12 text-sm` },
        
        { label: 'ln', type: 'scientific', className: `${baseStyle} ${currentTheme.functionBtn} h-12 text-sm` },
        { label: 'log', type: 'scientific', className: `${baseStyle} ${currentTheme.functionBtn} h-12 text-sm` },
        { label: 'x!', type: 'scientific', className: `${baseStyle} ${currentTheme.functionBtn} h-12 text-sm` },
        { label: '(', type: 'function', className: `${baseStyle} ${currentTheme.functionBtn} h-12 text-sm` },
        { label: ')', type: 'function', className: `${baseStyle} ${currentTheme.functionBtn} h-12 text-sm` },
        
        { label: 'MC', type: 'memory', className: `${baseStyle} ${currentTheme.functionBtn} h-12 text-sm` },
        { label: 'MR', type: 'memory', className: `${baseStyle} ${currentTheme.functionBtn} h-12 text-sm` },
        { label: 'M+', type: 'memory', className: `${baseStyle} ${currentTheme.functionBtn} h-12 text-sm` },
        { label: 'M-', type: 'memory', className: `${baseStyle} ${currentTheme.functionBtn} h-12 text-sm` },
        { label: 'MS', type: 'memory', className: `${baseStyle} ${currentTheme.functionBtn} h-12 text-sm` },
        
        { label: 'C', type: 'clear', className: `${baseStyle} ${currentTheme.functionBtn} h-16 text-xl` },
        { label: '±', type: 'function', className: `${baseStyle} ${currentTheme.functionBtn} h-16 text-xl` },
        { label: '%', type: 'function', className: `${baseStyle} ${currentTheme.functionBtn} h-16 text-xl` },
        { label: '÷', type: 'operation', className: `${baseStyle} ${currentTheme.operationBtn} h-16 text-xl ring-2 ring-${currentTheme.accent}/30` },
        
        { label: 'x²', type: 'scientific', className: `${baseStyle} ${currentTheme.functionBtn} h-16 text-lg` },
        { label: '7', type: 'number', className: `${baseStyle} ${currentTheme.numberBtn} h-16 text-xl` },
        { label: '8', type: 'number', className: `${baseStyle} ${currentTheme.numberBtn} h-16 text-xl` },
        { label: '9', type: 'number', className: `${baseStyle} ${currentTheme.numberBtn} h-16 text-xl` },
        { label: '×', type: 'operation', className: `${baseStyle} ${currentTheme.operationBtn} h-16 text-xl ring-2 ring-${currentTheme.accent}/30` },
        
        { label: '√', type: 'scientific', className: `${baseStyle} ${currentTheme.functionBtn} h-16 text-lg` },
        { label: '4', type: 'number', className: `${baseStyle} ${currentTheme.numberBtn} h-16 text-xl` },
        { label: '5', type: 'number', className: `${baseStyle} ${currentTheme.numberBtn} h-16 text-xl` },
        { label: '6', type: 'number', className: `${baseStyle} ${currentTheme.numberBtn} h-16 text-xl` },
        { label: '-', type: 'operation', className: `${baseStyle} ${currentTheme.operationBtn} h-16 text-xl ring-2 ring-${currentTheme.accent}/30` },
        
        { label: 'π', type: 'scientific', className: `${baseStyle} ${currentTheme.functionBtn} h-16 text-lg` },
        { label: '1', type: 'number', className: `${baseStyle} ${currentTheme.numberBtn} h-16 text-xl` },
        { label: '2', type: 'number', className: `${baseStyle} ${currentTheme.numberBtn} h-16 text-xl` },
        { label: '3', type: 'number', className: `${baseStyle} ${currentTheme.numberBtn} h-16 text-xl` },
        { label: '+', type: 'operation', className: `${baseStyle} ${currentTheme.operationBtn} h-16 text-xl ring-2 ring-${currentTheme.accent}/30` },
        
        { label: 'e', type: 'scientific', className: `${baseStyle} ${currentTheme.functionBtn} h-16 text-lg` },
        { label: '0', type: 'number', className: `${baseStyle} ${currentTheme.numberBtn} h-16 text-xl col-span-2`, span: 2 },
        { label: '.', type: 'decimal', className: `${baseStyle} ${currentTheme.numberBtn} h-16 text-xl` },
        { label: '=', type: 'equals', className: `${baseStyle} ${currentTheme.operationBtn} h-16 text-xl ring-2 ring-${currentTheme.accent}/30` },
      ];
    } else {
        return [
            { label: 'C', type: 'clear', className: `${baseStyle} ${currentTheme.functionBtn} h-16 text-xl` },
            { label: '±', type: 'function', className: `${baseStyle} ${currentTheme.functionBtn} h-16 text-xl` },
            { label: '%', type: 'function', className: `${baseStyle} ${currentTheme.functionBtn} h-16 text-xl` },
            { label: '÷', type: 'operation', className: `${baseStyle} ${currentTheme.operationBtn} h-16 text-xl` },
            
            { label: '7', type: 'number', className: `${baseStyle} ${currentTheme.numberBtn} h-16 text-xl` },
            { label: '8', type: 'number', className: `${baseStyle} ${currentTheme.numberBtn} h-16 text-xl` },
            { label: '9', type: 'number', className: `${baseStyle} ${currentTheme.numberBtn} h-16 text-xl` },
            { label: '×', type: 'operation', className: `${baseStyle} ${currentTheme.operationBtn} h-16 text-xl` },
            
            { label: '4', type: 'number', className: `${baseStyle} ${currentTheme.numberBtn} h-16 text-xl` },
            { label: '5', type: 'number', className: `${baseStyle} ${currentTheme.numberBtn} h-16 text-xl` },
            { label: '6', type: 'number', className: `${baseStyle} ${currentTheme.numberBtn} h-16 text-xl` },
            { label: '-', type: 'operation', className: `${baseStyle} ${currentTheme.operationBtn} h-16 text-xl` },
            
            { label: '1', type: 'number', className: `${baseStyle} ${currentTheme.numberBtn} h-16 text-xl` },
            { label: '2', type: 'number', className: `${baseStyle} ${currentTheme.numberBtn} h-16 text-xl` },
            { label: '3', type: 'number', className: `${baseStyle} ${currentTheme.numberBtn} h-16 text-xl` },
            { label: '+', type: 'operation', className: `${baseStyle} ${currentTheme.operationBtn} h-16 text-xl` },
            
            { label: '0', type: 'number', className: `${baseStyle} ${currentTheme.numberBtn} h-16 text-xl col-span-2`, span: 2 },
            { label: '.', type: 'decimal', className: `${baseStyle} ${currentTheme.numberBtn} h-16 text-xl` },
            { label: '=', type: 'equals', className: `${baseStyle} ${currentTheme.operationBtn} h-16 text-xl` },
        ];
    }
  }, [mode, currentTheme, angleUnit]);

  const handleNumber = useCallback((num: string) => {
    setErrorMessage('');
    playAdvancedSound(400 + parseInt(num) * 50, 'sine', 80);
    triggerAdvancedHaptic([5]);
    setLastPressed(num);
    setDisplayAnimation('animate-pulse');
    setTimeout(() => setDisplayAnimation(''), 200);

    if (display.length >= 20) return;

    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(prevDisplay => {
        if (prevDisplay === '0') return num;
        return prevDisplay + num;
      });
    }
  }, [display, waitingForNewValue, playAdvancedSound, triggerAdvancedHaptic]);

  const handleOperation = useCallback((nextOperation: string) => {
    setErrorMessage('');
    playAdvancedSound(600, 'square', 120);
    triggerAdvancedHaptic([10, 5, 10]);
    setLastPressed(nextOperation);

    const inputValue = parseFloat(display.replace(/,/g, ''));

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation && !waitingForNewValue) {
      const currentValue = previousValue || 0;
      const result = calculateAdvanced(currentValue, inputValue, operation);

      if (isNaN(result) || !isFinite(result)) {
        setErrorMessage('Error');
        return;
      }

      setDisplay(String(result));
      setPreviousValue(result);
      
      const calculationStep: CalculationStep = {
        id: Date.now().toString(),
        expression: `${formatAdvancedDisplay(String(currentValue))} ${operation} ${formatAdvancedDisplay(String(inputValue))}`,
        result: formatAdvancedDisplay(String(result)),
        timestamp: new Date()
      };
      
      setHistory(prev => [calculationStep, ...prev.slice(0, 19)]);
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  }, [display, previousValue, operation, waitingForNewValue, playAdvancedSound, triggerAdvancedHaptic, calculateAdvanced, formatAdvancedDisplay]);

  const handleEquals = useCallback(() => {
    playAdvancedSound(800, 'triangle', 200);
    triggerAdvancedHaptic([15, 10, 15, 10, 15]);
    setLastPressed('=');
    setDisplayAnimation('animate-bounce');
    setTimeout(() => setDisplayAnimation(''), 500);

    const inputValue = parseFloat(display.replace(/,/g, ''));

    if (previousValue !== null && operation) {
      const result = calculateAdvanced(previousValue, inputValue, operation);
      
      if (isNaN(result) || !isFinite(result)) {
        setErrorMessage('Error');
        return;
      }

      setDisplay(String(result));
      
      const calculationStep: CalculationStep = {
        id: Date.now().toString(),
        expression: `${formatAdvancedDisplay(String(previousValue))} ${operation} ${formatAdvancedDisplay(String(inputValue))}`,
        result: formatAdvancedDisplay(String(result)),
        timestamp: new Date()
      };
      
      setHistory(prev => [calculationStep, ...prev.slice(0, 19)]);
      
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  }, [display, previousValue, operation, calculateAdvanced, playAdvancedSound, triggerAdvancedHaptic, formatAdvancedDisplay]);

  const handleClear = useCallback(() => {
    playAdvancedSound(200, 'square', 150);
    triggerAdvancedHaptic([20, 10, 20]);
    setLastPressed('C');
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
    setErrorMessage('');
    setDisplayAnimation('animate-pulse');
    setTimeout(() => setDisplayAnimation(''), 300);
  }, [playAdvancedSound, triggerAdvancedHaptic]);

  const handleButtonClick = useCallback((button: CalculatorButton) => {
    setPressedButton(button.label);
    setTimeout(() => setPressedButton(''), 150);

    switch (button.type) {
      case 'number':
        handleNumber(button.label);
        break;
      case 'operation':
        handleOperation(button.label);
        break;
      case 'equals':
        handleEquals();
        break;
      case 'decimal':
        setErrorMessage('');
        playAdvancedSound(350, 'sine', 80);
        triggerAdvancedHaptic([5]);
        setLastPressed('.');
        if (waitingForNewValue) {
          setDisplay('0.');
          setWaitingForNewValue(false);
        } else if (display.indexOf('.') === -1) {
          setDisplay(prevDisplay => prevDisplay + '.');
        }
        break;
      case 'clear':
        handleClear();
        break;
      case 'function':
        if (button.label === '±') {
          playAdvancedSound(500, 'triangle', 100);
          triggerAdvancedHaptic([10]);
          setLastPressed('±');
          setDisplay(prevDisplay => {
            const num = parseFloat(prevDisplay.replace(/,/g, ''));
            return String(num * -1);
          });
        } else if (button.label === '%') {
          playAdvancedSound(550, 'triangle', 100);
          triggerAdvancedHaptic([10]);
          setLastPressed('%');
          setDisplay(prevDisplay => {
            const num = parseFloat(prevDisplay.replace(/,/g, ''));
            return String(num / 100);
          });
        }
        break;
      case 'memory':
        handleMemory(button.label as any);
        break;
      case 'scientific':
        handleScientific(button.label);
        break;
    }
  }, [handleNumber, handleOperation, handleEquals, handleClear, handleMemory, handleScientific, display, waitingForNewValue, playAdvancedSound, triggerAdvancedHaptic]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'r' && (event.metaKey || event.ctrlKey)) return;
      
      const key = event.key;
      
      if (/[0-9]/.test(key)) {
        handleNumber(key);
      } else if (key === '+') {
        handleOperation('+');
      } else if (key === '-') {
        handleOperation('-');
      } else if (key === '*') {
        handleOperation('×');
      } else if (key === '/') {
        handleOperation('÷');
      } else if (key === 'Enter' || key === '=') {
        handleEquals();
      } else if (key === '.') {
        handleButtonClick({ label: '.', type: 'decimal', className: '' });
      } else if (key === 'Escape' || key === 'c' || key === 'C') {
        handleClear();
      } else if (key === '%') {
        handleButtonClick({ label: '%', type: 'function', className: '' });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleNumber, handleOperation, handleEquals, handleClear, handleButtonClick]);

  useEffect(() => {
    if (autoSave) {
      const saveData = {
        display,
        history,
        memory,
        mode,
        theme,
        settings: { angleUnit, precision, scientificNotation, soundEnabled, hapticEnabled }
      };
      localStorage.setItem('calculatorState', JSON.stringify(saveData));
    }
  }, [display, history, memory, mode, theme, angleUnit, precision, scientificNotation, soundEnabled, hapticEnabled, autoSave]);

  useEffect(() => {
    const savedData = localStorage.getItem('calculatorState');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.display) setDisplay(parsed.display);
        if (parsed.history) setHistory(parsed.history);
        if (parsed.memory) setMemory(parsed.memory);
        if (parsed.mode) setMode(parsed.mode);
        if (parsed.theme) setTheme(parsed.theme);
        if (parsed.settings) {
          setAngleUnit(parsed.settings.angleUnit || 'deg');
          setPrecision(parsed.settings.precision || 10);
          setScientificNotation(parsed.settings.scientificNotation || false);
          setSoundEnabled(parsed.settings.soundEnabled ?? true);
          setHapticEnabled(parsed.settings.hapticEnabled ?? true);
        }
      } catch (error) {
        console.log('Failed to load saved data');
      }
    }
  }, []);

  const buttons = getButtons();
  const availableModes: CalculatorMode[] = ['scientific', 'standard'];
  const availableThemes: ThemeMode[] = ['light', 'dark', 'neon'];

  return (
    <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text} flex flex-col relative overflow-hidden`} ref={calculatorRef}>
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 bg-${currentTheme.accent} rounded-full filter blur-3xl animate-pulse`}></div>
        <div className={`absolute bottom-1/3 right-1/3 w-80 h-80 bg-purple-500 rounded-full filter blur-3xl animate-pulse delay-1000`}></div>
      </div>

      <div className="max-w-2xl mx-auto p-4 flex-grow flex flex-col justify-center relative z-10">
        <div className="text-center mb-6">
          <div className="flex justify-between items-center mb-4">
            {onBack ? (
                <Button 
                onClick={onBack}
                variant="outline"
                className={`${currentTheme.card} border-${currentTheme.accent}/30 ${currentTheme.text} hover:bg-${currentTheme.accent}/20 backdrop-blur-sm transition-all duration-300 hover:scale-105`}
                >
                ← Back
                </Button>
            ) : (
                <Link to="/">
                    <Button 
                    variant="outline"
                    className={`${currentTheme.card} border-${currentTheme.accent}/30 ${currentTheme.text} hover:bg-${currentTheme.accent}/20 backdrop-blur-sm transition-all duration-300 hover:scale-105`}
                    >
                    ← Home
                    </Button>
                </Link>
            )}
            
            <div className="flex space-x-2">
              <Button
                onClick={() => setShowSettings(!showSettings)}
                className={`${currentTheme.functionBtn} backdrop-blur-sm text-sm px-3 py-2 h-auto`}
              >
                ⚙️
              </Button>
            </div>
          </div>
          
          <div className="relative mb-4">
            <h1 className={`text-4xl md:text-5xl font-bold bg-gradient-to-r from-${currentTheme.accent} via-purple-500 to-blue-500 bg-clip-text text-transparent mb-2 animate-pulse`}>
              Scientific Calculator
            </h1>
            <p className="text-gray-400 text-lg">Free Online {mode.toUpperCase()} Tool</p>
          </div>

          <div className="flex justify-center space-x-2 mb-4">
            {availableModes.map((m) => (
              <Button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-2 text-sm capitalize transition-all duration-300 ${
                  mode === m 
                    ? `${currentTheme.operationBtn} ring-2 ring-${currentTheme.accent}/50` 
                    : `${currentTheme.functionBtn}`
                }`}
              >
                {m}
              </Button>
            ))}
          </div>

          <div className="flex justify-center space-x-1 mb-4">
            {availableThemes.map((t) => (
              <Button
                key={t}
                onClick={() => setTheme(t)}
                className={`w-8 h-8 rounded-full text-xs border-2 transition-all duration-300 ${
                  theme === t ? `border-${currentTheme.accent}` : 'border-gray-600'
                }`}
                style={{
                  background: t === 'light' ? '#f3f4f6' : t === 'neon' ? '#000' : '#1f2937'
                }}
                title={`${t} theme`}
              >
                {t === 'light' ? '☀️' : t === 'neon' ? '⚡' : '🌙'}
              </Button>
            ))}
          </div>
        </div>

        {showSettings && (
          <Card className={`${currentTheme.card} border border-${currentTheme.accent}/30 shadow-2xl rounded-3xl mb-4 backdrop-blur-xl`}>
            <CardHeader>
              <h3 className="text-lg font-semibold">Settings</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Angle Unit</span>
                <Button
                  onClick={() => setAngleUnit(angleUnit === 'deg' ? 'rad' : 'deg')}
                  className={currentTheme.functionBtn}
                >
                  {angleUnit.toUpperCase()}
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <span>Scientific Notation</span>
                <Button
                  onClick={() => setScientificNotation(!scientificNotation)}
                  className={scientificNotation ? currentTheme.operationBtn : currentTheme.functionBtn}
                >
                  {scientificNotation ? 'ON' : 'OFF'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {showHistory && history.length > 0 && (
          <Card className={`${currentTheme.card} border border-${currentTheme.accent}/30 shadow-2xl rounded-3xl mb-4 backdrop-blur-xl max-h-48 overflow-hidden`}>
             <CardHeader>
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">History</h3>
                    <Button onClick={() => setHistory([])} size="sm" variant="ghost">Clear</Button>
                </div>
             </CardHeader>
             <CardContent>
                 {history.slice(0, 5).map(h => (
                     <div key={h.id} className="text-sm mb-2">
                         <div className="text-gray-500">{h.expression}</div>
                         <div className="font-bold">{h.result}</div>
                     </div>
                 ))}
             </CardContent>
          </Card>
        )}

        <Card className={`${currentTheme.card} border border-${currentTheme.accent}/30 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-xl relative`}>
          <div className={`absolute -inset-1 bg-gradient-to-r from-${currentTheme.accent}/30 to-purple-500/30 rounded-3xl blur-md animate-pulse`}></div>
          
          <CardHeader className="p-0 relative">
            <div className={`${currentTheme.display} p-6 md:p-8 text-right backdrop-blur-sm relative`} ref={displayRef}>
              {operation && previousValue !== null && (
                <div className={`text-lg md:text-xl text-${currentTheme.accent} mb-2 font-mono animate-fade-in`}>
                  {formatAdvancedDisplay(String(previousValue))} {operation}
                </div>
              )}
              
              <div className={`text-4xl md:text-6xl font-light ${currentTheme.text} font-mono break-all leading-tight transition-all duration-300 ${displayAnimation} ${isAnimating ? 'scale-105 glow' : ''}`}>
                {formatAdvancedDisplay(display)}
              </div>
              
              <div className="flex justify-between items-center mt-4 text-sm">
                 <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setShowHistory(!showHistory)}>
                    History
                 </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className={`p-4 md:p-6 ${currentTheme.display} backdrop-blur-sm relative`}>
            <div className={`grid ${mode === 'scientific' ? 'grid-cols-5 gap-2' : 'grid-cols-4 gap-4'}`}>
              {buttons.map((button, index) => (
                <Button
                  key={index}
                  onClick={() => handleButtonClick(button)}
                  className={`
                    ${button.className}
                    ${button.span === 2 ? 'col-span-2' : ''}
                    ${pressedButton === button.label ? 'scale-90 brightness-125 animate-pulse' : ''}
                    active:scale-95 hover:scale-105
                    relative overflow-hidden group
                  `}
                  style={{
                    minHeight: mode === 'scientific' ? '48px' : '64px',
                  }}
                >
                  <span className="relative z-10">{button.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* ---------------------------------------------------------------------------------- */}
      {/* REQUIRED FOR ADSENSE: Substantial Content Section */}
      {/* ---------------------------------------------------------------------------------- */}
      <div className="max-w-3xl mx-auto mt-12 mb-20 px-6 text-slate-600 dark:text-slate-400">
        <article className="prose dark:prose-invert lg:prose-lg mx-auto">
          <h2 className={`text-3xl font-bold mb-6 text-${currentTheme.accent}`}>Master Mathematics with Our Free Scientific Calculator</h2>
          
          <p className="mb-4">
            Welcome to the MARGDARSHAK Online Scientific Calculator, a powerful tool designed to assist students, engineers, and professionals with complex mathematical computations. Unlike a basic calculator, our tool supports advanced functions essential for algebra, trigonometry, calculus, and statistics.
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-4 text-foreground">Key Features of This Calculator</h3>
          <ul className="list-disc pl-5 space-y-2 mb-6">
            <li><strong>Trigonometric Functions:</strong> Easily calculate Sine (sin), Cosine (cos), and Tangent (tan) in both Degrees and Radians. Perfect for geometry and physics problems.</li>
            <li><strong>Logarithms & Exponents:</strong> Perform natural logs (ln), base-10 logs (log), powers (^), and square roots (√) with precision.</li>
            <li><strong>Factorials & Constants:</strong> Access factorial (x!) calculations and mathematical constants like Pi (π) and Euler's number (e).</li>
            <li><strong>Memory Operations:</strong> Store and recall intermediate results using Memory Store (MS), Recall (MR), and Clear (MC) buttons to streamline long equations.</li>
          </ul>

          <h3 className="text-xl font-semibold mt-8 mb-4 text-foreground">Why Use an Online Scientific Calculator?</h3>
          <p className="mb-4">
            In the modern academic landscape, having immediate access to reliable calculation tools is vital. Whether you are solving a quadratic equation, calculating the area of a circle, or working on engineering derivatives, this browser-based tool is accessible from any device—laptop, tablet, or smartphone—without the need to install heavy applications.
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-4 text-foreground">How to switch modes?</h3>
          <p>
            Use the toggle at the top of the interface to switch between <strong>Standard Mode</strong> for basic arithmetic and <strong>Scientific Mode</strong> for advanced functions. You can also customize the visual theme to Dark, Light, or Neon mode to reduce eye strain during late-night study sessions.
          </p>
        </article>
      </div>

      <footer className="py-6 border-t border-white/10 text-center text-sm opacity-60">
        <div className="flex items-center justify-center gap-2 mb-2">
            <img src={logo} alt="Logo" className="w-8 h-8" />
            <span className="font-bold">MARGDARSHAK</span>
        </div>
        <p>© 2026 VSAV GYANTAPA. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Calculator;
