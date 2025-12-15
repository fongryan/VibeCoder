import React from 'react';
import { Agent, AgentRole, AgentStatus } from '../types';
import { Activity, Brain, Code, Layers, ShieldCheck, Zap } from 'lucide-react';

interface SwarmVisualizerProps {
  agents: Agent[];
}

const AgentNode: React.FC<{ agent: Agent }> = ({ agent }) => {
  const getIcon = () => {
    switch (agent.role) {
      case AgentRole.ARCHITECT: return <Brain className="w-4 h-4" />;
      case AgentRole.INTEGRATOR: return <Layers className="w-4 h-4" />;
      case AgentRole.CODER: return <Code className="w-4 h-4" />;
      case AgentRole.QA: return <ShieldCheck className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getColor = () => {
    switch (agent.status) {
      case AgentStatus.THINKING: return 'border-neon-amber text-neon-amber shadow-[0_0_10px_#ffb80040]';
      case AgentStatus.WORKING: return 'border-neon-blue text-neon-blue shadow-[0_0_10px_#00f3ff40]';
      case AgentStatus.COMPLETED: return 'border-neon-green text-neon-green shadow-[0_0_10px_#00ff9d40]';
      case AgentStatus.ERROR: return 'border-neon-pink text-neon-pink';
      default: return 'border-vibe-500 text-vibe-400';
    }
  };

  const getStatusText = () => {
     if (agent.status === AgentStatus.THINKING) return 'Reasoning...';
     if (agent.status === AgentStatus.WORKING) return agent.currentTask || 'Processing...';
     if (agent.status === AgentStatus.COMPLETED) return 'Done';
     return 'Idle';
  }

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border bg-vibe-800/50 backdrop-blur-sm transition-all duration-300 ${getColor()}`}>
      <div className={`p-2 rounded-full border ${getColor()} ${agent.status === AgentStatus.WORKING || agent.status === AgentStatus.THINKING ? 'animate-pulse' : ''}`}>
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-bold uppercase tracking-wider opacity-80">{agent.role}</span>
          <span className="text-[10px] uppercase opacity-60">{agent.id}</span>
        </div>
        <div className="text-xs truncate font-mono opacity-90">
          {getStatusText()}
        </div>
      </div>
      {agent.status === AgentStatus.WORKING && (
        <Zap className="w-3 h-3 text-neon-blue animate-bounce" />
      )}
    </div>
  );
};

const SwarmVisualizer: React.FC<SwarmVisualizerProps> = ({ agents }) => {
  return (
    <div className="flex flex-col gap-2 w-full max-w-sm">
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-xs font-bold text-vibe-300 uppercase tracking-widest flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
          Active Swarm
        </h3>
        <span className="text-[10px] text-vibe-400 font-mono">Context 7 Active</span>
      </div>
      <div className="space-y-2">
        {agents.map(agent => (
          <AgentNode key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
};

export default SwarmVisualizer;