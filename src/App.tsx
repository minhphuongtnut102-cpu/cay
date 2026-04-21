import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  RotateCcw, 
  Info, 
  ChevronRight, 
  ArrowLeft, 
  Binary, 
  GitBranch, 
  Layers
} from 'lucide-react';

/**
 * Định nghĩa cấu trúc của một Nút trong cây nhị phân
 */
interface TreeNodeData {
  id: string;
  x: number;
  y: number;
  color: string;
  lightColor: string;
  left?: string;
  right?: string;
}

/**
 * Dữ liệu cây nhị phân cố định
 */
const treeNodes: Record<string, TreeNodeData> = {
  'A': { id: 'A', x: 200, y: 60, color: '#10B981', lightColor: '#D1FAE5', left: 'B', right: 'C' },
  'B': { id: 'B', x: 100, y: 160, color: '#F59E0B', lightColor: '#FEF3C7', left: 'D' },
  'C': { id: 'C', x: 300, y: 160, color: '#6366F1', lightColor: '#E0E7FF', left: 'F', right: 'G' },
  'D': { id: 'D', x: 50, y: 260, color: '#F43F5E', lightColor: '#FFE4E6' },
  'F': { id: 'F', x: 250, y: 260, color: '#8B5CF6', lightColor: '#EDE9FE' },
  'G': { id: 'G', x: 350, y: 260, color: '#06B6D4', lightColor: '#CFFAFE' },
};

type TraversalType = 'preorder' | 'inorder' | 'postorder';

interface TraversalConfig {
  title: string;
  sequence: string[];
  formula: string;
  steps: { label: string; text: string; color: string }[];
  description: string;
  icon: any;
}

const traversalConfigs: Record<TraversalType, TraversalConfig> = {
  preorder: {
    title: 'Duyệt trước (Preorder)',
    sequence: ['A', 'B', 'D', 'C', 'F', 'G'],
    formula: 'Gốc → Trái → Phải',
    description: 'Thăm nút gốc trước, sau đó duyệt cây con bên trái và cuối cùng là cây con bên phải.',
    icon: Binary,
    steps: [
      { label: 'Bước 1', text: 'Thăm nút Gốc (Root)', color: 'bg-blue-600' },
      { label: 'Bước 2', text: 'Duyệt cây con Trái (Left)', color: 'bg-blue-400' },
      { label: 'Bước 3', text: 'Duyệt cây con Phải (Right)', color: 'bg-blue-300' }
    ]
  },
  inorder: {
    title: 'Duyệt giữa (Inorder)',
    sequence: ['D', 'B', 'A', 'F', 'C', 'G'],
    formula: 'Trái → Gốc → Phải',
    description: 'Duyệt cây con bên trái trước, sau đó thăm nút gốc và cuối cùng là cây con bên phải.',
    icon: GitBranch,
    steps: [
      { label: 'Bước 1', text: 'Duyệt cây con Trái (Left)', color: 'bg-emerald-600' },
      { label: 'Bước 2', text: 'Thăm nút Gốc (Root)', color: 'bg-emerald-400' },
      { label: 'Bước 3', text: 'Duyệt cây con Phải (Right)', color: 'bg-emerald-300' }
    ]
  },
  postorder: {
    title: 'Duyệt sau (Postorder)',
    sequence: ['D', 'B', 'F', 'G', 'C', 'A'],
    formula: 'Trái → Phải → Gốc',
    description: 'Duyệt cây con bên trái, sau đó là cây con bên phải và cuối cùng mới thăm nút gốc.',
    icon: Layers,
    steps: [
      { label: 'Bước 1', text: 'Duyệt cây con Trái (Left)', color: 'bg-purple-600' },
      { label: 'Bước 2', text: 'Duyệt cây con Phải (Right)', color: 'bg-purple-400' },
      { label: 'Bước 3', text: 'Thăm nút Gốc (Root)', color: 'bg-purple-300' }
    ]
  }
};

export default function App() {
  const [view, setView] = useState<'home' | TraversalType>('home');

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans selection:bg-blue-100">
      <AnimatePresence mode="wait">
        {view === 'home' ? (
          <motion.div key="home">
            <Home onSelect={(type) => setView(type)} />
          </motion.div>
        ) : (
          <motion.div key={view}>
            <TraversalVisualizer 
              type={view} 
              onBack={() => setView('home')} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Home({ onSelect }: { onSelect: (type: TraversalType) => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto px-4 py-16 md:py-24 flex flex-col items-center"
    >
      <header className="text-center mb-16">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-6 border border-blue-100"
        >
          <Binary size={16} />
          Cấu trúc Dữ liệu & Giải thuật
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-6">
          Duyệt Cây Nhị Phân
        </h1>
        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Khám phá các phương pháp duyệt cây nhị phân thông qua các minh họa trực quan sinh động và tương tác.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {(Object.keys(traversalConfigs) as TraversalType[]).map((type, i) => {
          const config = traversalConfigs[type];
          const Icon = config.icon;
          return (
            <motion.button
              key={type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              onClick={() => onSelect(type)}
              className="group relative bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 text-left hover:border-blue-500 hover:shadow-blue-100 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Icon size={120} />
              </div>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300 ${
                type === 'preorder' ? 'bg-blue-50 text-blue-600' : 
                type === 'inorder' ? 'bg-emerald-50 text-emerald-600' : 
                'bg-purple-50 text-purple-600'
              }`}>
                <Icon size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{config.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                {config.description}
              </p>
              <div className="flex items-center gap-2 text-sm font-bold text-blue-600 group-hover:gap-4 transition-all">
                Khám phá ngay <ChevronRight size={16} />
              </div>
            </motion.button>
          );
        })}
      </div>

      <footer className="mt-24 text-slate-400 text-xs font-medium tracking-widest uppercase">
        <p>© 2026 Binary Tree Visualizer • CS Education Series</p>
      </footer>
    </motion.div>
  );
}

function TraversalVisualizer({ type, onBack }: { type: TraversalType, onBack: () => void }) {
  const config = traversalConfigs[type];
  const [currentStep, setCurrentStep] = useState(-1);
  const [isTraversing, setIsTraversing] = useState(false);
  const [visitedNodes, setVisitedNodes] = useState<string[]>([]);
  const [traversalSpeed, setTraversalSpeed] = useState(1000);

  const startTraversal = () => {
    if (isTraversing || currentStep !== -1) return;
    setIsTraversing(true);
    setCurrentStep(0);
  };

  const reset = () => {
    setIsTraversing(false);
    setCurrentStep(-1);
    setVisitedNodes([]);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTraversing && currentStep >= 0 && currentStep < config.sequence.length) {
      const node = config.sequence[currentStep];
      setVisitedNodes(prev => [...prev, node]);
      
      if (currentStep < config.sequence.length - 1) {
        timer = setTimeout(() => {
          setCurrentStep(prev => prev + 1);
        }, traversalSpeed);
      } else {
        setIsTraversing(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isTraversing, currentStep, config.sequence, traversalSpeed]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-7xl mx-auto px-4 py-8 md:py-12"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors mb-8 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Quay về Trang chủ
      </button>

      <header className="mb-12">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">
          {config.title}
        </h1>
        <p className="text-slate-500 text-lg max-w-3xl leading-relaxed">
          {config.description}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 flex flex-col items-center overflow-hidden">
            <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <span className={`w-1.5 h-8 rounded-full ${
                  type === 'preorder' ? 'bg-blue-600' : 
                  type === 'inorder' ? 'bg-emerald-600' : 
                  'bg-purple-600'
                }`} />
                Sơ đồ Cây Nhị phân
              </h2>
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tốc độ:</span>
                  <input 
                    type="range" 
                    min="200" 
                    max="2000" 
                    step="100"
                    value={traversalSpeed}
                    onChange={(e) => setTraversalSpeed(Number(e.target.value))}
                    disabled={isTraversing}
                    className="w-24 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50"
                  />
                  <span className="text-xs font-mono font-bold text-blue-600 w-12 text-right">
                    {(traversalSpeed / 1000).toFixed(1)}s
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={startTraversal}
                    disabled={isTraversing || currentStep !== -1}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all shadow-lg ${
                      isTraversing || currentStep !== -1
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200 active:scale-95'
                    }`}
                  >
                    <Play size={18} fill="currentColor" />
                    Bắt đầu
                  </button>
                  <button
                    onClick={reset}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all active:scale-95"
                  >
                    <RotateCcw size={18} />
                    Đặt lại
                  </button>
                </div>
              </div>
            </div>

            <div className="relative w-full aspect-[4/3] max-w-[600px] border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/30 p-4 mb-8">
              <svg viewBox="0 0 400 320" className="w-full h-full drop-shadow-sm">
                {Object.values(treeNodes).map(node => (
                  <g key={`lines-${node.id}`}>
                    {node.left && (
                      <motion.line
                        x1={node.x} y1={node.y}
                        x2={treeNodes[node.left].x} y2={treeNodes[node.left].y}
                        stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                      />
                    )}
                    {node.right && (
                      <motion.line
                        x1={node.x} y1={node.y}
                        x2={treeNodes[node.right].x} y2={treeNodes[node.right].y}
                        stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                      />
                    )}
                  </g>
                ))}

                {Object.values(treeNodes).map(node => {
                  const isVisited = visitedNodes.includes(node.id);
                  const isCurrent = currentStep >= 0 && config.sequence[currentStep] === node.id;
                  
                  return (
                    <g key={node.id} className="cursor-default">
                      <motion.circle
                        cx={node.x}
                        cy={node.y}
                        r="22"
                        initial={{ fill: '#FFFFFF', stroke: '#E2E8F0' }}
                        animate={{
                          fill: isCurrent ? node.color : (isVisited ? node.lightColor : '#FFFFFF'),
                          stroke: isCurrent ? node.color : (isVisited ? node.color : '#E2E8F0'),
                          scale: isCurrent ? 1.25 : 1,
                          filter: isCurrent ? `drop-shadow(0 0 8px ${node.color}80)` : 'none',
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        strokeWidth={isCurrent ? "4" : "3"}
                      />
                      <motion.text
                        x={node.x}
                        y={node.y}
                        textAnchor="middle"
                        dy=".35em"
                        className="font-black text-base select-none"
                        animate={{
                          fill: isCurrent ? '#FFFFFF' : (isVisited ? node.color : '#64748B')
                        }}
                      >
                        {node.id}
                      </motion.text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="w-full border-t border-slate-100 pt-8">
              <h2 className="text-lg font-bold mb-6 text-slate-800 flex items-center justify-center gap-3">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                Kết quả Duyệt (Từng bước)
              </h2>
              <div className="flex flex-wrap justify-center gap-4 min-h-[60px]">
                <AnimatePresence mode="popLayout">
                  {visitedNodes.map((nodeId, index) => (
                    <motion.div
                      key={`${nodeId}-${index}`}
                      initial={{ opacity: 0, scale: 0.5, x: -20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="flex items-center"
                    >
                      <div 
                        className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-md border-2 transition-all"
                        style={{ 
                          backgroundColor: treeNodes[nodeId].lightColor,
                          borderColor: treeNodes[nodeId].color,
                          color: treeNodes[nodeId].color,
                          transform: index === visitedNodes.length - 1 ? 'scale(1.1)' : 'scale(1)'
                        }}
                      >
                        {nodeId}
                      </div>
                      {index < config.sequence.length - 1 && (
                        <motion.div
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          className="mx-1"
                        >
                          <ChevronRight size={24} className="text-slate-300" />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {visitedNodes.length === 0 && (
                  <div className="w-full py-6 flex flex-col items-center justify-center text-slate-400">
                    <p className="italic text-sm">Kết quả sẽ xuất hiện tại đây khi bạn nhấn "Bắt đầu"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6 h-full">
          <section className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-7">
            <h2 className="text-lg font-bold flex items-center gap-3 mb-5 text-slate-800">
              <div className="p-2 bg-blue-50 rounded-xl">
                <Info size={20} className="text-blue-600" />
              </div>
              Thuật toán {config.title}
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-slate-600">
              <p>{config.description}</p>
              <div className="space-y-2">
                {config.steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className={`flex-shrink-0 w-2 h-2 rounded-full ${step.color}`} />
                    <span className="font-bold text-slate-700 min-w-[60px]">{step.label}:</span>
                    <span>{step.text}</span>
                  </div>
                ))}
              </div>
              <div className={`p-4 rounded-2xl text-white shadow-md mt-6 ${
                type === 'preorder' ? 'bg-gradient-to-br from-blue-600 to-blue-700 shadow-blue-200' : 
                type === 'inorder' ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-emerald-200' : 
                'bg-gradient-to-br from-purple-600 to-purple-700 shadow-purple-200'
              }`}>
                <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Công thức ghi nhớ</p>
                <p className="text-xl font-black">{config.formula}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
}
