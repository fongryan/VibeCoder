export enum AgentRole {
  MANAGER = 'MANAGER',
  ARCHITECT = 'ARCHITECT',
  INTEGRATOR = 'INTEGRATOR', // Context 7 Specialist
  CODER = 'CODER',
  QA = 'QA'
}

export enum AgentStatus {
  IDLE = 'IDLE',
  THINKING = 'THINKING',
  WORKING = 'WORKING',
  WAITING = 'WAITING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  status: AgentStatus;
  currentTask?: string;
  logs: string[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  agentId?: string; // If message came from a specific agent
}

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: FileNode[];
  language?: string;
  path: string;
}

export interface Project {
  id: string;
  name: string;
  files: FileNode[];
  mcpConnected: boolean;
  githubConnected: boolean;
  repositoryUrl?: string;
  description?: string;
}

export interface Tool {
  name: string;
  description: string;
  source: 'Context7' | 'System' | 'GitHub';
}