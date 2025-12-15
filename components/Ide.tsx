import React, { useState } from 'react';
import { FileNode, Project } from '../types';
import { Folder, FileCode, ChevronRight, ChevronDown, Play, Github, Save } from 'lucide-react';

interface IdeProps {
  project: Project;
  onPushToGithub: () => void;
}

const FileTreeItem: React.FC<{ node: FileNode; level: number; activeFileId: string | null; onSelect: (node: FileNode) => void }> = ({ node, level, activeFileId, onSelect }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.type === 'directory') {
      setIsOpen(!isOpen);
    } else {
      onSelect(node);
    }
  };

  const isSelected = activeFileId === node.id;

  return (
    <div className="select-none">
      <div 
        className={`flex items-center gap-1 py-1 px-2 cursor-pointer hover:bg-vibe-700/50 transition-colors ${isSelected ? 'bg-vibe-700 text-neon-blue' : 'text-vibe-300'}`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
      >
        <span className="opacity-70">
          {node.type === 'directory' ? (
            isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />
          ) : <div className="w-3" />}
        </span>
        {node.type === 'directory' ? <Folder className="w-3 h-3 text-vibe-400" /> : <FileCode className="w-3 h-3 text-vibe-400" />}
        <span className="text-xs font-mono truncate">{node.name}</span>
      </div>
      {node.type === 'directory' && isOpen && node.children && (
        <div>
          {node.children.map(child => (
            <FileTreeItem 
              key={child.id} 
              node={child} 
              level={level + 1} 
              activeFileId={activeFileId} 
              onSelect={onSelect} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Ide: React.FC<IdeProps> = ({ project, onPushToGithub }) => {
  const [activeFile, setActiveFile] = useState<FileNode | null>(
    project.files[0]?.children?.[0] || project.files[0] || null
  );

  return (
    <div className="flex h-full bg-vibe-900/90 backdrop-blur-xl border border-vibe-700 overflow-hidden rounded-xl shadow-2xl animate-in fade-in duration-700">
      {/* Sidebar */}
      <div className="w-64 border-r border-vibe-700 flex flex-col bg-vibe-800/30">
        <div className="p-3 border-b border-vibe-700 flex justify-between items-center">
          <span className="text-xs font-bold text-vibe-200 uppercase tracking-wider">{project.name}</span>
          <div className="flex gap-2">
            <button title="Push to Github" onClick={onPushToGithub} className="p-1 hover:text-white text-vibe-400 transition-colors">
              <Github className="w-3 h-3" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-2 scroll-hide">
          {project.files.map(node => (
            <FileTreeItem key={node.id} node={node} level={0} activeFileId={activeFile?.id || null} onSelect={setActiveFile} />
          ))}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Tabs */}
        {activeFile && (
          <div className="h-9 flex bg-vibe-900 border-b border-vibe-700">
            <div className="px-4 border-r border-vibe-700 bg-vibe-800/50 text-vibe-100 text-xs font-mono flex items-center gap-2 border-t-2 border-t-neon-blue">
              <FileCode className="w-3 h-3 text-neon-blue" />
              {activeFile.name}
            </div>
          </div>
        )}

        {/* Code Content */}
        <div className="flex-1 relative bg-[#0d0d14] overflow-hidden group">
          {activeFile ? (
            <div className="absolute inset-0 p-4 overflow-auto scroll-hide">
              <pre className="font-mono text-sm leading-relaxed">
                <code className="text-vibe-100 whitespace-pre">
                  {/* Rudimentary Syntax Highlighting Logic for Effect */}
                  {activeFile.content?.split('\n').map((line, i) => (
                    <div key={i} className="table-row">
                      <span className="table-cell text-vibe-600 select-none pr-4 text-right w-8">{i + 1}</span>
                      <span className="table-cell" dangerouslySetInnerHTML={{
                        __html: line
                          .replace(/(const|let|var|import|from|export|default|function|return|interface|type)/g, '<span class="text-neon-purple font-semibold">$1</span>')
                          .replace(/('.*?'|".*?")/g, '<span class="text-neon-green">$1</span>')
                          .replace(/(\/\/.*)/g, '<span class="text-vibe-500 italic">$1</span>')
                          .replace(/([A-Z][a-zA-Z0-9]*)/g, '<span class="text-neon-amber">$1</span>')
                          .replace(/({|}|\[|\]|\(|\))/g, '<span class="text-vibe-300">$1</span>')
                      }} />
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-vibe-500 text-sm">
              Select a file to view code
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Preview / Terminal */}
      <div className="w-80 border-l border-vibe-700 flex flex-col bg-vibe-800/20">
        <div className="h-9 border-b border-vibe-700 flex items-center px-3 gap-4">
          <span className="text-xs font-bold text-vibe-200 border-b-2 border-neon-green pb-2 pt-2">Preview</span>
          <span className="text-xs font-bold text-vibe-500 pb-2 pt-2">Terminal</span>
        </div>
        <div className="flex-1 bg-white p-1">
             <div className="w-full h-full bg-white rounded-sm overflow-hidden border border-vibe-200 shadow-inner flex flex-col">
                <div className="bg-gray-100 border-b p-2 flex items-center gap-2">
                    <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-400"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    </div>
                    <div className="bg-white rounded px-2 py-0.5 text-[8px] text-gray-400 flex-1 text-center shadow-sm">localhost:3000</div>
                </div>
                <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-400 text-xs">
                    <span className="animate-pulse">App Preview Active</span>
                </div>
             </div>
        </div>
        <div className="h-32 border-t border-vibe-700 bg-black p-2 font-mono text-[10px] text-vibe-300 overflow-y-auto">
            <div className="text-neon-green">➜  vibe-project git:(main) npm run dev</div>
            <div>   ready - started server on 0.0.0.0:3000, url: http://localhost:3000</div>
            <div className="text-vibe-500">   event - compiled client and server successfully in 1241 ms (156 modules)</div>
            <div className="text-neon-blue">   wait  - compiling...</div>
            <div className="text-neon-green">   event - compiled successfully in 320 ms (142 modules)</div>
        </div>
      </div>
    </div>
  );
};

export default Ide;