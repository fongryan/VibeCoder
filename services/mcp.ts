import { Tool } from '../types';

// This simulates the behavior of the Context 7 MCP Client
// In a real app, this would connect via WebSocket/SSE to the MCP Server

const MOCK_TOOLS: Tool[] = [
  {
    name: 'search_documentation',
    description: 'Search for latest documentation on libraries via Context 7',
    source: 'Context7'
  },
  {
    name: 'get_library_version',
    description: 'Get the latest stable version of a package',
    source: 'Context7'
  },
  {
    name: 'validate_integration_pattern',
    description: 'Check if a coding pattern is deprecated using Context 7 knowledge base',
    source: 'Context7'
  }
];

export class McpClientService {
  private connected: boolean = false;

  async connect(apiKey: string): Promise<boolean> {
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    this.connected = true;
    console.log('[MCP] Connected to Context 7 Server');
    return true;
  }

  async getTools(): Promise<Tool[]> {
    if (!this.connected) throw new Error("MCP Client not connected");
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_TOOLS;
  }

  async queryContext7(query: string): Promise<string> {
    if (!this.connected) throw new Error("MCP Client not connected");
    console.log(`[MCP] Querying Context 7: ${query}`);
    
    await new Promise(resolve => setTimeout(resolve, 1500)); // Latency for "fetching"

    // Mock responses based on keywords
    if (query.toLowerCase().includes('next')) {
      return `[Context 7] Retrieved latest Next.js 14 App Router patterns.
      - Use server components by default.
      - Use 'use client' for interactive components.
      - Route handlers in route.ts.`;
    }
    if (query.toLowerCase().includes('tailwind')) {
      return `[Context 7] Retrieved Tailwind CSS v3.4 docs.
      - Support for nested groups.
      - New size-* utilities.`;
    }
    
    return `[Context 7] Retrieved generic latest context for: ${query}. Integration verified.`;
  }
}

export const mcpClient = new McpClientService();