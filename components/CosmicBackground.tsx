import React from 'react';

const CosmicBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#050508]">
      {/* Deep Space Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-vibe-900 rounded-full blur-[120px] opacity-40 animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-neon-purple rounded-full blur-[150px] opacity-10"></div>
      <div className="absolute top-[30%] left-[40%] w-[30%] h-[30%] bg-neon-blue rounded-full blur-[130px] opacity-5"></div>
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]"></div>
    </div>
  );
};

export default CosmicBackground;