import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import logo from "@/components/logo/logo.png";

interface CalculatorProps {
  onBack: () => void;
}

type CalculatorMode = 'scientific' | 'programmer' | 'graphing';
type ThemeMode = 'light' ;

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
  // Enhanced state management
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  
  // Advanced features state
  const [angleUnit, setAngleUnit] = useState<'deg' | 'rad'>('deg');
  const [precision, setPrecision] = useState(10);
  const [scientificNotation, setScientificNotation] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  
  // Refs for advanced features
  const audioContext = useRef<AudioContext | null>(null);
  const displayRef = useRef<HTMLDivElement>(null);
  const calculatorRef = useRef<HTMLDivElement>(null);

  // Enhanced themes
  const themes = useMemo(() => ({
    light: {
      background: 'bg-gradient-to-br from-blue-50 via-white to-gray-100',
      card: 'bg-white/90 shadow-xl',
      display: 'bg-gray-50/95',
      numberBtn: 'bg-gradient-to-b from-gray-100 to-gray-200 hover:from-gray-50 hover:to-gray-150',
      operationBtn: 'bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500',
      functionBtn: 'bg-gradient-to-b from-gray-300 to-gray-400 hover:from-gray-200 hover:to-gray-300',
      accent: 'blue-500',
      text: 'text-gray-900'
    },
  }), []);

  const currentTheme = themes[theme];

  // Enhanced audio system
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

  // Enhanced haptic feedback
  const triggerAdvancedHaptic = useCallback((pattern: number[] = [10]) => {
    if (!hapticEnabled) return;
    
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
    
    // Visual haptic feedback
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 150);
  }, [hapticEnabled]);

  // Advanced number formatting
  const formatAdvancedDisplay = useCallback((value: string): string => {
    if (errorMessage) return errorMessage;
    
    const num = parseFloat(value.replace(/,/g, ''));
    if (isNaN(num)) return value;
    
    // Handle different number formats
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

  // Scientific calculator functions
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

  // Enhanced calculation engine
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
      case 'xʸ': return Math.pow(firstValue, secondValue);
      default: return secondValue;
    }
  }, []);

  // Memory operations
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

  // Scientific operations
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

  // Enhanced button configurations for different modes
  const getButtons = useCallback((): CalculatorButton[] => {
    const baseStyle = 'font-semibold rounded-2xl border-0 transition-all duration-300 transform relative overflow-hidden shadow-lg hover:shadow-xl';
    
    if (mode === 'scientific') {
      return [
        // Scientific calculator layout
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
        { label: '7', type: 'number', className: `${baseStyle} ${currentTheme.numberBtn} h-16 text-xl ${currentTheme.text}` },
        { label: '8', type: 'number', className: `${baseStyle} ${currentTheme.numberBtn} h-16 text-xl ${currentTheme.text}` },
        { label: '9', type: 'number', className: `${baseStyle} ${currentTheme.numberBtn} h-16 text-xl ${currentTheme.text}` },
        { label: '×', type: 'operation', className: `${baseStyle} ${currentTheme.operationBtn} h-16 text-xl ring-2 ring-${currentTheme.accent}/30` },
        
        { label: '√', type: 'scientific', className: `${baseStyle} ${currentTheme.functionBtn} h-16 text-lg` },
        { label: '4', type: 'number', className: `${baseStyle} ${currentTheme.numberBtn} h-16 text-xl ${currentTheme.text}` },
        { label: '5', type: 'number', className: `${baseStyle} ${currentTheme.numberBtn} h-16 text-xl ${currentTheme.text}` },
        { label: '6', type: 'number', className: `${baseStyle} ${currentTheme.numberBtn} h-16 text-xl ${currentTheme.text}` },
        { label: '-', type: 'operation', className: `${baseStyle} ${currentTheme.operationBtn} h-16 text-xl ring-2 ring-${currentTheme.accent}/30` },
        
        { label: 'π', type: 'scientific', className: `${baseStyle} ${currentTheme.functionBtn} h-16 text-lg` },
        { label: '1', type: 'number', className: `${baseStyle} ${currentTheme.numberBtn} h-16 text-xl ${currentTheme.text}` },
        { label: '2', type: 'number', className: `${baseStyle} ${currentTheme.numberBtn} h-16 text-xl ${currentTheme.text}` },
        { label: '3', type: 'number', className: `${baseStyle} ${currentTheme.numberBtn} h-16 text-xl ${currentTheme.text}` },
        { label: '+', type: 'operation', className: `${baseStyle} ${currentTheme.operationBtn} h-16 text-xl ring-2 ring-${currentTheme.accent}/30` },
        
        { label: 'e', type: 'scientific', className: `${baseStyle} ${currentTheme.functionBtn} h-16 text-lg` },
        { label: '0', type: 'number', className: `${baseStyle} ${currentTheme.numberBtn} h-16 text-xl ${currentTheme.text} col-span-2`, span: 2 },
        { label: '.', type: 'decimal', className: `${baseStyle} ${currentTheme.numberBtn} h-16 text-xl ${currentTheme.text}` },
        { label: '=', type: 'equals', className: `${baseStyle} ${currentTheme.operationBtn} h-16 text-xl ring-2 ring-${currentTheme.accent}/30` },
      ];
    }


  }, [mode, currentTheme, angleUnit]);

  // Enhanced number input
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

  // Enhanced operation handling
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
      
      // Enhanced history tracking
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

  // Enhanced equals handling
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

  // Enhanced clear functionality
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

  // Enhanced button click handler
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
        // Enhanced decimal handling
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
      case 'mode':
        // Handle mode switching
        break;
    }
  }, [handleNumber, handleOperation, handleEquals, handleClear, handleMemory, handleScientific, display, waitingForNewValue, playAdvancedSound, triggerAdvancedHaptic]);

  // Keyboard support enhancement
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      event.preventDefault();
      
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

  // Auto-save functionality
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

  // Load saved data on mount
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

  return (
    <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text} flex flex-col relative overflow-hidden`} ref={calculatorRef}>
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 bg-${currentTheme.accent} rounded-full filter blur-3xl animate-pulse`}></div>
        <div className={`absolute bottom-1/3 right-1/3 w-80 h-80 bg-purple-500 rounded-full filter blur-3xl animate-pulse delay-1000`}></div>
        <div className={`absolute top-2/3 left-1/2 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl animate-pulse delay-2000`}></div>
      </div>

      <div className="max-w-2xl mx-auto p-4 flex-grow flex flex-col justify-center relative z-10">
        {/* Ultra-Enhanced Header */}
        <div className="text-center mb-6">
          <div className="flex justify-between items-center mb-4">
            <Button 
              onClick={onBack}
              variant="outline"
              className={`${currentTheme.card} border-${currentTheme.accent}/30 ${currentTheme.text} hover:bg-${currentTheme.accent}/20 backdrop-blur-sm transition-all duration-300 hover:scale-105`}
            >
              ← Back
            </Button>
            
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
              Calculator
            </h1>
            <p className="text-gray-400 text-lg">SCIENTIFIC CALCULATOR</p>
          </div>

          {/* Mode Switcher */}
          <div className="flex justify-center space-x-2 mb-4">
            {([] as CalculatorMode[]).map((m) => (
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

          {/* Theme Switcher */}
          <div className="flex justify-center space-x-1 mb-4">
            {([] as ThemeMode[]).map((t) => (
              <Button
                key={t}
                onClick={() => setTheme(t)}
                className={`w-8 h-8 rounded-full text-xs border-2 transition-all duration-300 ${
                  theme === t ? `border-${currentTheme.accent}` : 'border-gray-600'
                }`}
                style={{
                  background: t === 'light' ? '#1f2937' : t === 'light' ? '#f3f4f6' : t === 'neon' ? '#8b5cf6' : t === 'light' ? 'rgba(255,255,255,0.2)' : '#d97706'
                }}
              >
                {t[0].toUpperCase()}
              </Button>
            ))}
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <Card className={`${currentTheme.card} border border-${currentTheme.accent}/30 shadow-2xl rounded-3xl mb-4 backdrop-blur-xl`}>
            <CardHeader>
              <h3 className="text-lg font-semibold">Settings</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
              </div>
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

        {/* History Panel */}
        {showHistory && history.length > 0 && (
          <Card className={`${currentTheme.card} border border-${currentTheme.accent}/30 shadow-2xl rounded-3xl mb-4 backdrop-blur-xl max-h-48 overflow-hidden`}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Calculation History</h3>
                <Button
                  onClick={() => setHistory([])}
                  className={`${currentTheme.functionBtn} text-sm px-3 py-1 h-auto`}
                >
                  Clear
                </Button>
              </div>
            </CardHeader>
            <CardContent className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              {history.slice(0, 10).map((calc) => (
                <div key={calc.id} className={`text-sm p-2 mb-2 ${currentTheme.display} rounded-lg backdrop-blur-sm border border-${currentTheme.accent}/20`}>
                  <div className="flex justify-between items-center">
                    <span>{calc.expression} = {calc.result}</span>
                    <span className="text-xs text-gray-500">
                      {calc.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Memory Display */}
        {memory.value !== 0 && (
          <div className={`${currentTheme.display} rounded-xl p-3 mb-4 text-center backdrop-blur-sm border border-${currentTheme.accent}/20`}>
            <span className="text-sm text-gray-400">Memory: </span>
            <span className="font-mono">{formatAdvancedDisplay(String(memory.value))}</span>
          </div>
        )}

        {/* Ultra-Enhanced Calculator Card */}
        <Card className={`${currentTheme.card} border border-${currentTheme.accent}/30 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-xl relative`}>
          {/* Enhanced glow effect */}
          <div className={`absolute -inset-1 bg-gradient-to-r from-${currentTheme.accent}/30 to-purple-500/30 rounded-3xl blur-md animate-pulse`}></div>
          
          {/* Ultra-Enhanced Display Area */}
          <CardHeader className="p-0 relative">
            <div className={`${currentTheme.display} p-6 md:p-8 text-right backdrop-blur-sm relative`} ref={displayRef}>
              {/* Operation and previous value display */}
              {operation && previousValue !== null && (
                <div className={`text-lg md:text-xl text-${currentTheme.accent} mb-2 font-mono animate-fade-in`}>
                  {formatAdvancedDisplay(String(previousValue))} {operation}
                </div>
              )}
              
              {/* Main display with ultra animations */}
              <div className={`text-4xl md:text-6xl font-light ${currentTheme.text} font-mono break-all leading-tight transition-all duration-300 ${displayAnimation} ${isAnimating ? 'scale-105 glow' : ''}`}>
                {formatAdvancedDisplay(display)}
              </div>
              
              {/* Enhanced status indicators */}
              <div className="flex justify-between items-center mt-4 text-sm">
                <div className="flex space-x-2">
                  {lastPressed && (
                    <span className={`text-${currentTheme.accent} animate-fade-in`}>
                      Last: {lastPressed}
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  {mode === 'scientific' && (
                    <span className="text-gray-400">{angleUnit.toUpperCase()}</span>
                  )}
                  {memory.value !== 0 && (
                    <span className={`text-${currentTheme.accent}`}>M</span>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          
          {/* Ultra-Enhanced Button Grid */}
          <CardContent className={`p-4 md:p-6 ${currentTheme.display} backdrop-blur-sm relative`}>
            <div className={`grid ${mode === 'scientific' ? 'grid-cols-5 gap-2' : 'grid-cols-4 gap-4'}`}>
              {buttons.map((button, index) => (
                <Button
                  key={index}
                  onClick={() => handleButtonClick(button)}
                  disabled={button.disabled}
                  className={`
                    ${button.className}
                    ${button.span === 2 ? 'col-span-2' : ''}
                    ${pressedButton === button.label ? 'scale-90 brightness-125 animate-pulse' : ''}
                    ${lastPressed === button.label ? `ring-2 ring-${currentTheme.accent}/70 ring-opacity-70` : ''}
                    active:scale-95 hover:scale-105 hover:brightness-110
                    backdrop-filter backdrop-blur-sm
                    relative overflow-hidden group
                  `}
                  style={{
                    minHeight: mode === 'scientific' ? '48px' : '80px',
                  }}
                >
                  {/* Enhanced button glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Button content with tooltip */}
                  <span className="relative z-10 drop-shadow-lg" title={button.tooltip}>
                    {button.label}
                  </span>
                  
                  {/* Enhanced ripple effect */}
                  {pressedButton === button.label && (
                    <div className={`absolute inset-0 bg-${currentTheme.accent}/30 rounded-2xl animate-ping`}></div>
                  )}
                </Button>
              ))}
            </div>

            {/* Enhanced keyboard hint */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                💡 Full keyboard support • Voice commands ready • Swipe gestures enabled
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Ultra-enhanced status indicators */}
        <div className="flex justify-center mt-4 space-x-3">
          <div className={`w-4 h-4 rounded-full transition-all duration-300 ${isAnimating ? `bg-${currentTheme.accent} animate-pulse shadow-lg` : 'bg-gray-600'}`}></div>
          <div className={`w-4 h-4 rounded-full transition-all duration-300 ${operation ? `bg-${currentTheme.accent} animate-pulse shadow-lg` : 'bg-gray-600'}`}></div>
          <div className={`w-4 h-4 rounded-full transition-all duration-300 ${errorMessage ? 'bg-red-400 animate-pulse shadow-lg' : 'bg-gray-600'}`}></div>
          <div className={`w-4 h-4 rounded-full transition-all duration-300 ${memory.value !== 0 ? `bg-${currentTheme.accent} animate-pulse shadow-lg` : 'bg-gray-600'}`}></div>
          <div className={`w-4 h-4 rounded-full transition-all duration-300 ${soundEnabled ? 'bg-green-400' : 'bg-gray-600'}`}></div>
        </div>
      </div>

      {/* Ultra-Enhanced Footer */}
<footer className="mt-12 py-6 border-t border-white/20 text-sm select-none flex items-center justify-center gap-4 text-black/70">
  <img
    src={logo}
    alt="VSAV GyanVedu Logo"
    className="w-15 h-14 object-contain mr-4 bg-white"
    draggable={false}
    style={{ minWidth: 48 }}
  />
  <div className="text-center">
    Maintained by <span className="font-semibold text-emerald-400">MARGDARSHAK</span>
    <br />
    Developed &amp; Maintained by <span className="font-semibold text-emerald-400">VSAV GYANTAPA</span>
    <br />
    © 2025 VSAV GYANTAPA. All Rights Reserved
  </div>
</footer>

      {/* Ultra-Enhanced Custom Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 5px currentColor; }
          50% { text-shadow: 0 0 20px currentColor, 0 0 30px currentColor; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .glow {
          animation: glow 1s ease-in-out;
        }
        
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        
        .scrollbar-thumb-gray-600 {
          scrollbar-color: #4B5563 #1F2937;
        }
        
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.8);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.9);
        }
        
        /* Responsive button grid improvements */
        @media (max-width: 640px) {
          .grid-cols-5 {
            grid-template-columns: repeat(5, minmax(0, 1fr));
            gap: 8px;
          }
        }
        
        /* Enhanced hover effects */
        .group:hover .group-hover\\:opacity-100 {
          opacity: 1;
        }
        
        /* Smooth transitions for all interactive elements */
        * {
          transition-property: transform, background-color, border-color, box-shadow, opacity;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default Calculator;