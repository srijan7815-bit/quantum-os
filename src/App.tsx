import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Users, Database, Shield, Zap, Star, ArrowRight, 
  X, Menu, ChevronDown, Cpu, Globe 
} from 'lucide-react';
import NeuralSphere from './components/NeuralSphere';
import { Toaster, toast } from 'sonner';

// Types
interface MousePosition {
  x: number;
  y: number;
}

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
}

// Custom Tilt Card Component (3D hover tilt)
const TiltCard: React.FC<TiltCardProps> = ({ children, className = '' }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateX = (mouseY / (rect.height / 2)) * -12;
    const rotateY = (mouseX / (rect.width / 2)) * 12;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      className={`tilt-card glass floating-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
      }}
    >
      {children}
    </div>
  );
};

// Magnetic Button with spring attraction
const MagneticButton: React.FC<MagneticButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '' 
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;

    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Magnetic pull strength
    const strength = 0.35;
    const maxPull = 18;

    const pullX = Math.max(-maxPull, Math.min(maxPull, mouseX * strength));
    const pullY = Math.max(-maxPull, Math.min(maxPull, mouseY * strength));

    setPosition({ x: pullX, y: pullY });
  };

  const handleMouseLeave = () => {
    // Spring back
    setPosition({ x: 0, y: 0 });
  };

  const baseClass = variant === 'primary' 
    ? 'btn-primary magnetic-btn' 
    : 'btn-secondary magnetic-btn';

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`${baseClass} ${className}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      {children}
      <ArrowRight className="w-4 h-4" />
    </button>
  );
};

// Custom Cursor Component
const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsActive(true);
    const handleMouseUp = () => setIsActive(false);

    // Only show custom cursor on desktop
    const isDesktop = window.innerWidth > 768;
    if (!isDesktop) return;

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Hide default cursor
    document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <div
      className={`custom-cursor ${isActive ? 'active' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    />
  );
};

// Demo Modal - Simulated Quantum OS Interface
const DemoModal: React.FC<{ isOpen: boolean; onClose: () => void; mode: 'demo' | 'enter' }> = ({ 
  isOpen, 
  onClose, 
  mode 
}) => {
  const [chatMessages, setChatMessages] = useState([
    { id: 1, type: 'ai', text: "Hello. Quantum OS initialized. How may I assist your cognition today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), type: 'user' as const, text: input.trim() };
    setChatMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Understood. I've synthesized the relevant neural pathways and prepared a contextual response.",
        "Processing complete. The Memory Engine has retrieved 14,892 related insights from your timeline.",
        "Agent Swarm deployed. Three specialized neural agents are now collaborating on your query.",
        "Quantum encryption layer activated. Your session is now fully isolated and secure.",
        "I've updated the workspace. The new simulation model is ready for you to explore."
      ];
      const aiMsg = { 
        id: Date.now() + 1, 
        type: 'ai' as const, 
        text: responses[Math.floor(Math.random() * responses.length)] 
      };
      setChatMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="modal-content"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="modal-header">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#56CCFF] flex items-center justify-center">
                  <Brain className="w-4 h-4 text-[#050505]" />
                </div>
                <div>
                  <div className="font-semibold text-lg tracking-[-0.02em]">
                    {mode === 'enter' ? 'QUANTUM OS — Session Active' : 'QUANTUM OS — Interactive Demo'}
                  </div>
                  <div className="text-xs text-[#56CCFF] font-mono tracking-[2px]">NEURAL LINK ESTABLISHED • 99.97% SYNC</div>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated OS Desktop */}
            <div className="os-demo">
              <div className="os-desktop">
                {/* Topbar */}
                <div className="os-topbar glass">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex-1 text-center text-xs font-mono tracking-[3px] text-[#56CCFF]/70">
                    QUANTUM-01 • INTELLIGENCE LAYER v4.2.1 • 06.05.2026
                  </div>
                  <div className="text-xs text-[#888] flex items-center gap-2">
                    <Cpu className="w-3 h-3" /> 12.4 TFLOPS
                  </div>
                </div>

                <div className="os-window">
                  {/* Sidebar - Neural Agents Panel */}
                  <div className="os-sidebar glass">
                    <div className="text-xs font-semibold tracking-widest mb-4 text-[#56CCFF]">NEURAL AGENTS</div>
                    {[
                      { name: 'AETHER', desc: 'Creative Synthesis', status: 'Active' },
                      { name: 'NEXUS', desc: 'Research & Analysis', status: 'Active' },
                      { name: 'ECHO', desc: 'Memory Retrieval', status: 'Idle' },
                    ].map((agent, i) => (
                      <div key={i} className="mb-3 p-3 rounded-xl bg-black/30 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">{agent.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">{agent.status}</span>
                        </div>
                        <div className="text-[#888] text-xs mt-0.5">{agent.desc}</div>
                      </div>
                    ))}

                    <div className="mt-auto pt-4 border-t border-white/10 text-[10px] text-[#666]">
                      3 agents • 41,203 inferences today
                    </div>
                  </div>

                  {/* Main Workspace Area */}
                  <div className="os-main glass">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-xs text-[#56CCFF] tracking-[1.5px] font-mono">AI WORKSPACE</div>
                        <div className="font-semibold text-xl tracking-[-0.03em]">Project: Quantum Cognition v3</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-emerald-400">SYNCED</div>
                        <div className="text-[10px] text-[#666]">14.2k tokens used</div>
                      </div>
                    </div>

                    {/* Fake content */}
                    <div className="space-y-4 text-sm">
                      <div className="p-4 bg-black/40 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-2 text-[#56CCFF] text-xs mb-1">
                          <Zap className="w-3 h-3" /> LIVE INSIGHT
                        </div>
                        <div className="text-[#ccc]">
                          The convergence point between intuition and reasoning has shifted +14% since last session. 
                          Recommending re-calibration of Memory Engine weights.
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-black/30 rounded-xl text-xs">
                          <div className="text-[#888]">CURRENT THROUGHPUT</div>
                          <div className="text-2xl font-semibold mt-1 tabular-nums">847k</div>
                          <div className="text-emerald-400 text-[10px]">+31% from baseline</div>
                        </div>
                        <div className="p-3 bg-black/30 rounded-xl text-xs">
                          <div className="text-[#888]">NEURAL DEPTH</div>
                          <div className="text-2xl font-semibold mt-1 tabular-nums">142</div>
                          <div className="text-[#56CCFF] text-[10px]">Layers active</div>
                        </div>
                      </div>
                    </div>

                    {/* Floating AI Chat in OS */}
                    <div className="os-chat">
                      <div className="text-xs font-medium mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#56CCFF] rounded-full animate-pulse" />
                        QUANTUM CHAT
                      </div>
                      
                      <div className="h-52 overflow-y-auto space-y-3 mb-3 pr-1 text-sm custom-scrollbar">
                        {chatMessages.map(msg => (
                          <div key={msg.id} className={msg.type === 'user' ? 'text-right' : ''}>
                            <div className={`inline-block max-w-[85%] px-3 py-1.5 rounded-2xl text-xs leading-relaxed ${
                              msg.type === 'user' 
                                ? 'bg-[#56CCFF] text-[#050505]' 
                                : 'bg-white/10'
                            }`}>
                              {msg.text}
                            </div>
                          </div>
                        ))}
                        {isTyping && (
                          <div className="text-[#888] text-xs pl-1">Quantum is thinking...</div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <input
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Ask anything..."
                          className="flex-1 bg-black/40 border border-white/10 rounded-full px-4 py-2 text-sm outline-none focus:border-[#56CCFF]/50 placeholder:text-[#555]"
                        />
                        <button 
                          onClick={sendMessage}
                          className="w-9 h-9 rounded-full bg-[#56CCFF] text-[#050505] flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer bar in modal */}
            <div className="px-6 py-4 bg-black/60 flex items-center justify-between text-xs border-t border-white/10">
              <div className="flex items-center gap-4 text-[#888]">
                <div>SECURE • QUANTUM-ENCRYPTED</div>
                <div className="h-px w-4 bg-white/20" />
                <div>Latency: 0.4ms</div>
              </div>
              <button 
                onClick={onClose}
                className="text-[#56CCFF] hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium"
              >
                EXIT SESSION <X className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Main App Component
function App() {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'demo' | 'enter'>('demo');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState<string[]>([]);

  // Mouse tracking for 3D sphere (normalized -1 to 1)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = ((e.clientX / window.innerWidth) - 0.5) * 2;
      const y = ((e.clientY / window.innerHeight) - 0.5) * 2;
      setMousePosition({ x: Math.max(-1, Math.min(1, x * 1.1)), y: Math.max(-1, Math.min(1, y * 0.9)) });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Intersection Observer for scroll reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setVisibleSections(prev => [...new Set([...prev, id])]);
          }
        });
      },
      { threshold: 0.15, rootMargin: '-50px 0px' }
    );

    const sections = document.querySelectorAll('.section');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const openDemo = (mode: 'demo' | 'enter') => {
    setModalMode(mode);
    setIsModalOpen(true);
    setIsMobileMenuOpen(false);

    if (mode === 'enter') {
      toast.success('Neural link established', {
        description: 'Welcome to QUANTUM OS. All systems synchronized.',
        duration: 4000,
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Scroll to section
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition - bodyRect - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  // Staggered reveal helper
  const isVisible = (id: string) => visibleSections.includes(id);

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] overflow-x-hidden">
      <Toaster position="top-center" richColors closeButton />

      {/* Custom Cursor */}
      <CustomCursor />

      {/* Fixed Navbar - Glassmorphism */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <div className="logo-dot" />
            QUANTUM OS
          </div>

          {/* Desktop Nav */}
          <div className="nav-links hidden md:flex">
            <button onClick={() => scrollTo('workspace')} className="hover:text-white transition-colors">Workspace</button>
            <button onClick={() => scrollTo('agents')} className="hover:text-white transition-colors">Agents</button>
            <button onClick={() => scrollTo('memory')} className="hover:text-white transition-colors">Memory</button>
            <button onClick={() => scrollTo('security')} className="hover:text-white transition-colors">Security</button>
            <button onClick={() => scrollTo('pricing')} className="hover:text-white transition-colors">Pricing</button>
          </div>

          <div className="nav-actions">
            <button 
              onClick={() => openDemo('enter')}
              className="hidden md:block btn-secondary text-sm px-6 py-2.5"
            >
              Enter Quantum
            </button>
            <button 
              onClick={() => openDemo('demo')}
              className="btn-primary text-sm px-6 py-2.5"
            >
              Watch Demo
            </button>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center glass rounded-full"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/10 bg-[#050505]/95 backdrop-blur-xl"
            >
              <div className="px-6 py-6 flex flex-col gap-4 text-sm">
                {['workspace', 'agents', 'memory', 'security', 'pricing'].map((section) => (
                  <button 
                    key={section}
                    onClick={() => scrollTo(section)}
                    className="text-left py-1.5 text-[#ccc] hover:text-white capitalize"
                  >
                    {section === 'workspace' ? 'AI Workspace' : 
                     section === 'agents' ? 'Neural Agents' : 
                     section === 'memory' ? 'Memory Engine' : 
                     section === 'security' ? 'Enterprise Security' : 'Pricing'}
                  </button>
                ))}
                <div className="pt-2 border-t border-white/10 flex flex-col gap-3">
                  <button onClick={() => openDemo('enter')} className="btn-secondary w-full justify-center">Enter Quantum</button>
                  <button onClick={() => openDemo('demo')} className="btn-primary w-full justify-center">Watch Demo</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ==================== HERO ==================== */}
      <section className="hero">
        {/* Animated Starfield Background (CSS + JS enhanced) */}
        <div className="starfield">
          {Array.from({ length: 42 }).map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${1.5 + Math.random() * 2.5}px`,
                height: `${1.5 + Math.random() * 2.5}px`,
                animationDelay: `-${Math.random() * 4}s`,
                opacity: 0.2 + Math.random() * 0.5,
              }}
            />
          ))}
          {/* Floating particles */}
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={`fp-${i}`}
              className="floating-particle"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${25 + Math.random() * 50}%`,
                animationDelay: `-${i * 0.8}s`,
                animationDuration: `${5.5 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Interactive 3D Neural Sphere */}
        <div className="hero-3d">
          <NeuralSphere mousePosition={mousePosition} />
        </div>

        {/* Hero Content - Cinematic Typography */}
        <div className="hero-content">
          <div className="max-w-[820px] mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full glass text-xs tracking-[2px] mb-8 text-[#56CCFF] border border-white/10">
              <div className="w-1.5 h-1.5 bg-[#56CCFF] rounded-full animate-pulse" />
              VERSION 4.2.1 — DEPLOYED ACROSS 187 NODES
            </div>

            <h1 className="hero-headline blur-reveal visible">
              The Operating System<br />For The Age of Intelligence
            </h1>

            <p className="hero-subhead blur-reveal visible stagger-1">
              Where human intuition and machine reasoning converge.
            </p>

            <div className="hero-buttons blur-reveal visible stagger-2">
              <MagneticButton 
                variant="primary" 
                onClick={() => openDemo('enter')}
              >
                Enter Quantum
              </MagneticButton>

              <MagneticButton 
                variant="secondary" 
                onClick={() => openDemo('demo')}
              >
                Watch Demo
              </MagneticButton>
            </div>

            <div className="mt-16 flex justify-center">
              <button 
                onClick={() => scrollTo('workspace')} 
                className="flex items-center gap-2 text-xs tracking-[1.5px] text-[#666] hover:text-[#56CCFF] transition-colors group"
              >
                SCROLL TO EXPLORE
                <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Subtle bottom gradient for depth */}
        <div className="absolute bottom-0 left-0 right-0 h-[220px] bg-gradient-to-t from-[#050505] to-transparent z-10 pointer-events-none" />
      </section>

      {/* ==================== AI WORKSPACE ==================== */}
      <section id="workspace" className="section">
        <div className="max-w-6xl mx-auto px-6">
          <div className="section-header">
            <div className={`blur-reveal ${isVisible('workspace') ? 'visible' : ''}`}>
              <h2>AI Workspace</h2>
              <p>A living interface where thought becomes execution. Infinite context. Zero friction.</p>
            </div>
          </div>

          <div className="workspace-grid">
            {/* Left Panel - Main Workspace */}
            <TiltCard className="workspace-panel">
              <div className="workspace-header">
                <div className="icon">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-xl tracking-[-0.02em]">Cognition Canvas</div>
                  <div className="text-xs text-[#56CCFF]">Real-time multi-agent collaboration</div>
                </div>
              </div>

              <div className="workspace-content">
                <p className="mb-5">Your thoughts are translated into structured reasoning graphs. Every idea is versioned, contextualized, and instantly available to your agents.</p>
                
                <div className="mock-editor">
                  <div className="line"><span className="line-number">01</span> <span className="text-[#56CCFF]">const</span> insight = await quantum.reason("future of intelligence")</div>
                  <div className="line"><span className="line-number">02</span> <span className="text-[#888]">// 14 agents converged in 0.8s</span></div>
                  <div className="line"><span className="line-number">03</span> <span className="text-[#56CCFF]">return</span> insight.synthesize()</div>
                </div>
              </div>
            </TiltCard>

            {/* Right Panel - Live Metrics */}
            <TiltCard className="workspace-panel">
              <div className="workspace-header">
                <div className="icon" style={{ background: 'linear-gradient(135deg, #56CCFF, #3aa8d9)' }}>
                  <Zap className="w-5 h-5 text-[#050505]" />
                </div>
                <div>
                  <div className="font-semibold text-xl tracking-[-0.02em]">Live Intelligence Layer</div>
                  <div className="text-xs text-[#56CCFF]">47,291 inferences processed today</div>
                </div>
              </div>

              <div className="space-y-6 mt-8">
                {[
                  { label: "Context Depth", value: "142.8k tokens", progress: 94 },
                  { label: "Reasoning Fidelity", value: "99.4%", progress: 99 },
                  { label: "Cross-Agent Sync", value: "3.2ms", progress: 87 },
                ].map((metric, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span>{metric.label}</span>
                      <span className="font-mono text-[#56CCFF]">{metric.value}</span>
                    </div>
                    <div className="h-px bg-white/10 rounded overflow-hidden">
                      <div 
                        className="h-px bg-gradient-to-r from-[#56CCFF] to-white transition-all duration-1000" 
                        style={{ width: `${metric.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* ==================== NEURAL AGENTS ==================== */}
      <section id="agents" className="section bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="section-header">
            <div className={`blur-reveal ${isVisible('agents') ? 'visible' : ''}`}>
              <h2>Neural Agents</h2>
              <p>Specialized intelligences that work together in perfect synchrony. Deployable in seconds.</p>
            </div>
          </div>

          <div className="agents-grid">
            {[
              {
                icon: <Brain className="w-7 h-7" />,
                name: "Aether",
                role: "Creative Synthesis",
                desc: "Transforms abstract concepts into tangible strategies, prototypes, and narratives with cinematic depth.",
                stats: ["94% novelty", "2.1s avg"]
              },
              {
                icon: <Users className="w-7 h-7" />,
                name: "Nexus",
                role: "Strategic Research",
                desc: "Synthesizes vast datasets into actionable intelligence. Cross-references 400M+ sources in real time.",
                stats: ["99.8% precision", "0.3s latency"]
              },
              {
                icon: <Database className="w-7 h-7" />,
                name: "Echo",
                role: "Memory Engine",
                desc: "Your lifelong second brain. Retrieves, connects, and evolves memories with perfect contextual fidelity.",
                stats: ["∞ context", "14ms recall"]
              }
            ].map((agent, index) => (
              <TiltCard key={index} className="agent-card">
                <div className="agent-icon">{agent.icon}</div>
                <h3>{agent.name}</h3>
                <div className="text-[#56CCFF] text-sm tracking-widest mb-3 font-medium">{agent.role}</div>
                <p>{agent.desc}</p>
                
                <div className="agent-stats mt-auto">
                  {agent.stats.map((stat, i) => (
                    <span key={i}>{stat}</span>
                  ))}
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== MEMORY ENGINE ==================== */}
      <section id="memory" className="section">
        <div className="max-w-6xl mx-auto px-6">
          <div className="section-header">
            <div className={`blur-reveal ${isVisible('memory') ? 'visible' : ''}`}>
              <h2>Memory Engine</h2>
              <p>Persistent, queryable, and self-evolving memory. Your entire history of thought, perfectly indexed.</p>
            </div>
          </div>

          <div className="memory-container">
            <div className="memory-timeline">
              {[
                { time: "TODAY 14:22", title: "Strategic pivot insight", desc: "Synthesized 7 years of project data into a new product direction. 41 connections formed automatically." },
                { time: "YESTERDAY 09:11", title: "Personal knowledge graph update", desc: "Integrated your reading list from the last quarter. New emergent patterns detected across 3 domains." },
                { time: "MAR 12, 2026", title: "Collaborative session with Aether", desc: "Co-created a 47-page vision document. All decisions and alternatives preserved in immutable layers." },
                { time: "FEB 28, 2026", title: "Enterprise compliance audit", desc: "Full memory trail exported for audit. Zero data loss. Cryptographically verified." },
              ].map((item, index) => (
                <motion.div 
                  key={index} 
                  className="memory-item glass p-6 rounded-2xl"
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <div className="time">{item.time}</div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== ENTERPRISE SECURITY ==================== */}
      <section id="security" className="section bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="section-header">
            <div className={`blur-reveal ${isVisible('security') ? 'visible' : ''}`}>
              <h2>Enterprise Security</h2>
              <p>Built for the most demanding environments. Quantum-resistant. Zero-trust by default.</p>
            </div>
          </div>

          <div className="security-grid">
            {[
              { icon: <Shield className="w-6 h-6" />, title: "Quantum Encryption", desc: "Post-quantum cryptographic primitives protect every packet, model weight, and memory fragment." },
              { icon: <Globe className="w-6 h-6" />, title: "Zero-Knowledge Architecture", desc: "Your data never leaves your control. We cannot access it, even if compelled." },
              { icon: <Cpu className="w-6 h-6" />, title: "Isolated Execution", desc: "Every agent runs in hardware-isolated enclaves with runtime attestation and audit logs." },
              { icon: <Star className="w-6 h-6" />, title: "Immutable Audit Trails", desc: "Complete provenance for every decision. Tamper-proof. Exportable in seconds for compliance." },
            ].map((feature, index) => (
              <TiltCard key={index} className="security-card">
                <div className="icon-wrapper">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-[#aaa] leading-relaxed">{feature.desc}</p>
              </TiltCard>
            ))}
          </div>

          <div className="text-center mt-12 text-xs tracking-[2px] text-[#666]">
            CERTIFIED: SOC 2 TYPE II • ISO 27001 • FEDRAMP MODERATE • QUANTUM-RESISTANT
          </div>
        </div>
      </section>

      {/* ==================== PRICING ==================== */}
      <section id="pricing" className="section">
        <div className="max-w-6xl mx-auto px-6">
          <div className="section-header">
            <div className={`blur-reveal ${isVisible('pricing') ? 'visible' : ''}`}>
              <h2>Choose Your Intelligence</h2>
              <p>Start free. Scale without limits. Every tier includes the full power of Quantum OS.</p>
            </div>
          </div>

          <div className="pricing-grid">
            {[
              {
                name: "Individual",
                price: "0",
                period: "forever",
                desc: "For explorers and builders",
                features: [
                  "1 Neural Agent",
                  "50k context tokens/mo",
                  "Basic Memory Engine",
                  "Community support",
                  "Public workspaces"
                ],
                cta: "Start Free",
                popular: false
              },
              {
                name: "Professional",
                price: "49",
                period: "per month",
                desc: "For serious practitioners",
                features: [
                  "Unlimited Agents",
                  "2M context tokens/mo",
                  "Advanced Memory + Timeline",
                  "Priority support",
                  "Private workspaces",
                  "API access"
                ],
                cta: "Start 14-day trial",
                popular: true
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "",
                desc: "For organizations at scale",
                features: [
                  "Everything in Pro",
                  "Dedicated infrastructure",
                  "Custom agents & models",
                  "SLA + on-prem options",
                  "Advanced compliance",
                  "Dedicated success team"
                ],
                cta: "Contact Sales",
                popular: false
              }
            ].map((tier, index) => (
              <TiltCard 
                key={index} 
                className={`pricing-card ${tier.popular ? 'popular' : ''}`}
              >
                <div>
                  <div className="text-sm tracking-[1px] text-[#56CCFF] font-medium">{tier.name}</div>
                  <div className="price">
                    {tier.price === "Custom" ? (
                      <span>{tier.price}</span>
                    ) : (
                      <>
                        <span className="currency">$</span>{tier.price}
                      </>
                    )}
                  </div>
                  <div className="text-[#888] text-sm -mt-1">{tier.period}</div>
                  <div className="text-[#aaa] text-sm mt-1">{tier.desc}</div>
                </div>

                <ul>
                  {tier.features.map((feature, fIndex) => (
                    <li key={fIndex}>
                      <Star className="w-3.5 h-3.5" /> {feature}
                    </li>
                  ))}
                </ul>

                <MagneticButton 
                  variant={tier.popular ? "primary" : "secondary"}
                  onClick={() => {
                    if (tier.name === "Enterprise") {
                      toast.info("Enterprise inquiry submitted", { description: "Our team will contact you within 4 hours." });
                    } else {
                      openDemo('enter');
                    }
                  }}
                  className="mt-auto w-full justify-center"
                >
                  {tier.cta}
                </MagneticButton>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="footer">
        <div className="footer-content max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="logo text-lg">QUANTUM OS</div>
              <div className="text-xs px-2 py-0.5 rounded bg-white/5 text-[#666]">v4.2.1</div>
            </div>

            <div className="footer-links text-sm">
              <a href="#workspace">Product</a>
              <a href="#agents">Agents</a>
              <a href="#memory">Memory</a>
              <a href="#security">Security</a>
              <a href="#pricing">Pricing</a>
              <a href="#">Docs</a>
              <a href="#">Blog</a>
            </div>

            <div className="text-xs text-[#555]">
              © {new Date().getFullYear()} Quantum Systems. All rights reserved.<br className="md:hidden" /> Built for the age of intelligence.
            </div>
          </div>
        </div>
      </footer>

      {/* Demo / Enter Modal */}
      <DemoModal isOpen={isModalOpen} onClose={closeModal} mode={modalMode} />
    </div>
  );
}

export default App;
