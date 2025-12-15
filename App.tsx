import React, { useState, useEffect, useRef } from 'react';
import CosmicBackground from './components/CosmicBackground';
import SwarmVisualizer from './components/SwarmVisualizer';
import Ide from './components/Ide';
import { Agent, AgentRole, AgentStatus, Message, Project, FileNode } from './types';
import { generateAgentResponse } from './services/gemini';
import { mcpClient } from './services/mcp';
import { Sparkles, Send, Globe, Database, Terminal, CheckCircle2, Hexagon, Command } from 'lucide-react';

// --- MOCK INITIAL DATA ---
const INITIAL_AGENTS: Agent[] = [
  { id: 'mgr-1', name: 'Atlas', role: AgentRole.MANAGER, status: AgentStatus.IDLE, logs: [] },
  { id: 'arc-1', name: 'Architect', role: AgentRole.ARCHITECT, status: AgentStatus.IDLE, logs: [] },
  { id: 'mcp-1', name: 'Connector', role: AgentRole.INTEGRATOR, status: AgentStatus.IDLE, logs: [] },
  { id: 'dev-1', name: 'VibeCoder', role: AgentRole.CODER, status: AgentStatus.IDLE, logs: [] },
];

const INITIAL_PROJECT: Project = {
  id: 'proj-1',
  name: 'untitled-vibe',
  mcpConnected: false,
  githubConnected: false,
  files: [
    {
      id: 'root',
      name: 'src',
      type: 'directory',
      path: '/src',
      children: [
        { id: 'f1', name: 'App.tsx', type: 'file', path: '/src/App.tsx', language: 'typescript', content: '// Enter your vibe idea to generate code...' }
      ]
    }
  ]
};

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [project, setProject] = useState<Project>(INITIAL_PROJECT);
  const [viewMode, setViewMode] = useState<'CHAT' | 'IDE'>('CHAT');
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Connect to MCP on mount (simulated)
  useEffect(() => {
    const init = async () => {
      await mcpClient.connect('demo-key');
      setProject(prev => ({ ...prev, mcpConnected: true }));
      addSystemMessage('Connected to Context 7 MCP Server. Integration Swarm ready.');
    };
    init();
  }, []);

  const addSystemMessage = (content: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'system',
      content,
      timestamp: Date.now()
    }]);
  };

  const updateAgentStatus = (role: AgentRole, status: AgentStatus, task?: string) => {
    setAgents(prev => prev.map(a => a.role === role ? { ...a, status, currentTask: task } : a));
  };

  const handlePushToGithub = async () => {
    if (!project.githubConnected) {
      // Simulate Auth
      const confirm = window.confirm("Connect GitHub Account to push repo?");
      if (confirm) {
        setProject(prev => ({ ...prev, githubConnected: true }));
        alert("GitHub Connected! Pushing repo 'vibe-app'...");
        setTimeout(() => alert("Push successful: https://github.com/user/vibe-app"), 1500);
      }
    } else {
        alert("Pushing changes to origin...");
    }
  };

  const processVibeRequest = async () => {
    if (!prompt.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: prompt, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setPrompt('');
    setIsProcessing(true);
    setViewMode('CHAT'); // Ensure we see the process

    // 1. Manager Agent Analysis
    updateAgentStatus(AgentRole.MANAGER, AgentStatus.THINKING, "Analyzing vibe...");
    const plan = await generateAgentResponse(userMsg.content, AgentRole.MANAGER);
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: plan, timestamp: Date.now(), agentId: 'mgr-1' }]);
    updateAgentStatus(AgentRole.MANAGER, AgentStatus.COMPLETED);

    // 2. Architect Agent Planning
    updateAgentStatus(AgentRole.ARCHITECT, AgentStatus.THINKING, "Drafting architecture...");
    const architecture = await generateAgentResponse("Create a file structure for: " + userMsg.content, AgentRole.ARCHITECT);
    updateAgentStatus(AgentRole.ARCHITECT, AgentStatus.COMPLETED);

    // 3. MCP Integrator Check
    updateAgentStatus(AgentRole.INTEGRATOR, AgentStatus.WORKING, "Querying Context 7...");
    const context7Data = await mcpClient.queryContext7(userMsg.content); // Mock query
    addSystemMessage(`Context 7 Insight: ${context7Data}`);
    updateAgentStatus(AgentRole.INTEGRATOR, AgentStatus.COMPLETED);

    // 4. Coder Agent Execution (Simulated file generation)
    updateAgentStatus(AgentRole.CODER, AgentStatus.WORKING, "Scaffolding codebase...");
    
    // Simulate gradual file creation
    setTimeout(() => {
        const newFiles: FileNode[] = [
            {
                id: 'root', name: 'src', type: 'directory', path: '/src', children: [
                    { id: 'comp', name: 'components', type: 'directory', path: '/src/components', children: [
                         { id: 'f2', name: 'Header.tsx', type: 'file', path: '/src/components/Header.tsx', content: `import React from 'react';\n\nexport const Header = () => <header className="p-4 bg-black text-white">Vibe App</header>;` },
                         { id: 'f3', name: 'Hero.tsx', type: 'file', path: '/src/components/Hero.tsx', content: `import React from 'react';\nimport { motion } from 'framer-motion';\n\nexport const Hero = () => (\n  <div className="h-screen flex items-center justify-center">\n    <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">Vibe On.</h1>\n  </div>\n);` }
                    ]},
                    { id: 'f1', name: 'App.tsx', type: 'file', path: '/src/App.tsx', content: `import React from 'react';\nimport { Header } from './components/Header';\nimport { Hero } from './components/Hero';\n\nexport default function App() {\n  return (\n    <main className="bg-gray-900 min-h-screen">\n      <Header />\n      <Hero />\n    </main>\n  );\n}` }
                ]
            }
        ];
        
        setProject(prev => ({ ...prev, files: newFiles, name: 'generated-vibe-app' }));
        updateAgentStatus(AgentRole.CODER, AgentStatus.COMPLETED);
        setIsProcessing(false);
        addSystemMessage("Build complete. Swapping to IDE View.");
        
        // Auto switch to IDE after a moment
        setTimeout(() => setViewMode('IDE'), 1000);
    }, 3000);
  };

  return (
    <div className="relative w-full h-screen font-sans text-vibe-100 flex overflow-hidden">
      <CosmicBackground />

      {/* Main Container */}
      <div className="relative z-10 w-full h-full flex flex-col md:flex-row max-w-[1920px] mx-auto">
        
        {/* Left Control Panel / Chat */}
        <div className={`flex flex-col transition-all duration-500 ease-in-out border-r border-vibe-700/50 bg-vibe-900/60 backdrop-blur-md
          ${viewMode === 'IDE' ? 'w-[400px]' : 'w-full md:w-1/2 lg:w-1/3 mx-auto md:mx-0'}
        `}>
           {/* Header */}
           <div className="p-4 border-b border-vibe-700/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hexagon className="w-6 h-6 text-neon-purple animate-pulse-slow" />
                <span className="font-bold text-lg tracking-tight">VibeCoder <span className="text-[10px] bg-neon-blue/10 text-neon-blue px-1 rounded ml-1">BETA</span></span>
              </div>
              <div className="flex gap-2">
                 <div title="Context 7 Connected" className={`w-2 h-2 rounded-full ${project.mcpConnected ? 'bg-neon-green shadow-[0_0_8px_#00ff9d]' : 'bg-red-500'}`}></div>
              </div>
           </div>

           {/* Chat History */}
           <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-hide">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                   <Sparkles className="w-12 h-12 mb-4 text-neon-amber animate-float" />
                   <h2 className="text-xl font-bold mb-2">Architect Your Dream</h2>
                   <p className="text-sm max-w-xs text-vibe-300">Describe your app idea. Our swarm of autonomous agents will architect, integrate, and build it for you.</p>
                </div>
              )}
              {messages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-4 shadow-lg backdrop-blur-sm
                    ${msg.role === 'user' 
                      ? 'bg-vibe-600 rounded-tr-sm border border-vibe-500 text-white' 
                      : msg.role === 'system'
                        ? 'bg-transparent text-xs text-vibe-400 font-mono border border-vibe-800'
                        : 'bg-vibe-800 rounded-tl-sm border border-vibe-700 text-vibe-100'
                    }
                  `}>
                    {msg.role === 'assistant' && <div className="text-[10px] uppercase text-neon-purple mb-1 font-bold tracking-wider">{msg.agentId ? INITIAL_AGENTS.find(a => a.id === msg.agentId)?.name : 'AI'}</div>}
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                  </div>
                </div>
              ))}
              {isProcessing && (
                 <div className="flex items-center gap-2 text-xs text-vibe-400 animate-pulse px-4">
                    <div className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-bounce delay-100"></div>
                    <div className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-bounce delay-200"></div>
                    Swarm is active...
                 </div>
              )}
           </div>

           {/* Input Area */}
           <div className="p-4 border-t border-vibe-700/50 bg-vibe-900/80">
              {isProcessing && (
                 <div className="mb-4">
                    <SwarmVisualizer agents={agents} />
                 </div>
              )}
              
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-purple to-neon-blue rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                <div className="relative flex items-center bg-vibe-800 rounded-xl overflow-hidden border border-vibe-600 group-focus-within:border-vibe-500 transition-colors">
                    <input 
                        type="text" 
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && processVibeRequest()}
                        placeholder="Build me a SaaS dashboard with..."
                        className="flex-1 bg-transparent p-4 text-sm focus:outline-none text-white placeholder-vibe-500"
                        disabled={isProcessing}
                    />
                    <button 
                        onClick={processVibeRequest}
                        disabled={!prompt.trim() || isProcessing}
                        className="p-3 mr-1 text-vibe-400 hover:text-neon-blue disabled:opacity-50 transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
              </div>
              <div className="flex justify-between mt-2 px-1">
                 <div className="text-[10px] text-vibe-500 flex items-center gap-1">
                    <Globe className="w-3 h-3" /> Context 7 Enabled
                 </div>
                 <div className="text-[10px] text-vibe-500 flex items-center gap-1">
                    <Command className="w-3 h-3" /> Enter to Send
                 </div>
              </div>
           </div>
        </div>

        {/* Right Content: IDE (Only visible when toggled or in IDE mode) */}
        {viewMode === 'IDE' && (
           <div className="flex-1 p-4 h-full animate-in fade-in slide-in-from-right-10 duration-500">
              <Ide project={project} onPushToGithub={handlePushToGithub} />
           </div>
        )}

        {/* Empty State visual for Right side when Chat mode active on Desktop */}
        {viewMode === 'CHAT' && (
           <div className="hidden md:flex flex-1 items-center justify-center p-12">
               <div className="text-center space-y-6 opacity-30 select-none">
                  <div className="text-9xl font-bold text-vibe-800 blur-sm">VIBE</div>
                  <div className="text-2xl text-vibe-600 font-mono">AWAITING INSTRUCTIONS</div>
               </div>
           </div>
        )}

      </div>
      
      {/* Mode Toggles (Floating) */}
      <div className="fixed bottom-6 right-6 z-50 flex gap-2">
         {project.files.length > 1 && (
             <>
                <button 
                    onClick={() => setViewMode('CHAT')}
                    className={`p-3 rounded-full backdrop-blur-xl border transition-all hover:scale-105 ${viewMode === 'CHAT' ? 'bg-neon-blue/20 border-neon-blue text-neon-blue shadow-[0_0_15px_#00f3ff40]' : 'bg-vibe-800/80 border-vibe-600 text-vibe-400'}`}
                >
                    <Database className="w-5 h-5" />
                </button>
                <button 
                    onClick={() => setViewMode('IDE')}
                    className={`p-3 rounded-full backdrop-blur-xl border transition-all hover:scale-105 ${viewMode === 'IDE' ? 'bg-neon-purple/20 border-neon-purple text-neon-purple shadow-[0_0_15px_#bc13fe40]' : 'bg-vibe-800/80 border-vibe-600 text-vibe-400'}`}
                >
                    <Terminal className="w-5 h-5" />
                </button>
             </>
         )}
      </div>

    </div>
  );
};

export default App;