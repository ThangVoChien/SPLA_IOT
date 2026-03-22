'use client'
import { useEffect, useState } from 'react';

export default function Loading() {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const duration = 2500;

    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const nextPercent = Math.min(Math.round((elapsed / duration) * 100), 100);
      setPercent(nextPercent);
      if (nextPercent === 100) clearInterval(timer);
    }, 25);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="pulse-voyager-container">
      <div className="pulse-voyager">
        {/* 1. THE DRACULA EKG PULSE (THE "RUNNING" THING) */}
        <div className="pulse-container">
          <svg viewBox="0 0 1000 200" className="pulse-svg">
            <path d="M0 100 H300 L320 60 L350 140 L380 40 L410 160 L440 100 H1000" fill="none" stroke="rgba(139, 233, 253, 0.05)" strokeWidth="1" />
            <path d="M0 100 H300 L320 60 L350 140 L380 40 L410 160 L440 100 H1000" fill="none" stroke="#bd93f9" strokeWidth="3" className="pulse-path" style={{ strokeDashoffset: 1000 - (1000 * percent / 100) }} />
          </svg>

          <div className="pulse-head" style={{ left: `${percent}%` }}>
            <div className="glow-orb"></div>
          </div>
        </div>

        {/* 2. HUD OVERLAY (DRACULA THEME) */}
        <div className="hud-branding">
          <div className="status-top">
            <div className="tag">DASHBOARD_SYNC_ACTIVE</div>
            <div className="tag">LINK: <span className="green">SECURE</span></div>
          </div>

          <div className="central-area">
            <h1 className="logo">SPLA <span className="neon">DASHBOARD</span></h1>
            <div className="percent">{percent}% LOADED</div>
          </div>

          <div className="loading-meter">
            <div className="meter-track">
              <div className="meter-fill" style={{ width: `${percent}%` }}></div>
            </div>
          </div>
        </div>

        {/* Diagnostic Shards (Positioned relatively to the container) */}
        <div className="diag-shard tl">{">"} SYNCING_CORES...</div>
        <div className="diag-shard tr">{">"} LATENCY: 0.1ms</div>
        <div className="diag-shard bl">{">"} MESH_BOOT: <span className="cyan">0x8B</span></div>
        <div className="diag-shard br">{">"} ACCESS: <span className="purple">ROOT_ADMIN</span></div>
      </div>

      <style jsx>{`
        .pulse-voyager-container {
          width: 100%;
          height: calc(100vh - 8rem);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background: #282a36;
          border-radius: 12px;
          overflow: hidden;
          margin-top: 1rem;
        }

        .pulse-voyager {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          font-family: 'Space Mono', monospace;
          color: #f8f8f2;
        }

        /* 1. EKG PULSE (DRACULA PURPLE & CYAN) */
        .pulse-container {
            position: absolute;
            width: 100%; height: 200px;
            display: flex; align-items: center;
        }
        .pulse-svg { width: 100%; height: 100%; opacity: 0.2; }
        .pulse-path { 
          stroke-dasharray: 1000; 
          transition: stroke-dashoffset 0.1s linear; 
          filter: drop-shadow(0 0 10px #bd93f9); 
        }
        
        .pulse-head {
            position: absolute;
            top: 50%; width: 2px; height: 100px;
            transform: translateY(-50%);
            transition: left 0.1s linear;
        }
        .glow-orb {
            position: absolute; top: 50%; left: 50%; width: 60px; height: 60px;
            background: radial-gradient(circle, rgba(189, 147, 249, 0.4) 0%, transparent 70%);
            transform: translate(-50%, -50%);
            animation: pulse-glow 1s infinite alternate;
        }
        @keyframes pulse-glow { from { opacity: 0.3; transform: translate(-50%, -50%) scale(0.8); } to { opacity: 1; transform: translate(-50%, -50%) scale(1.2); } }

        /* 2. HUD BRANDING (DRACULA PALETTE) */
        .hud-branding { 
          position: absolute; inset: 2rem; 
          display: flex; flex-direction: column; 
          justify-content: space-between; align-items: center; 
          pointer-events: none; z-index: 5;
        }
        
        .status-top { width: 100%; display: flex; justify-content: space-between; font-size: 0.6rem; letter-spacing: 2px; color: #6272a4; }
        .tag { background: #44475a; padding: 4px 12px; border-radius: 4px; border: 1px solid rgba(255, 255, 255, 0.05); }
        .green { color: #50fa7b; text-shadow: 0 0 5px #50fa7b; }
        .cyan { color: #8be9fd; }
        .purple { color: #bd93f9; }

        .central-area { text-align: center; }
        .logo { font-size: 1.8rem; font-weight: 200; letter-spacing: 0.8rem; margin-bottom: 1rem; color: #f8f8f2; }
        .neon { font-weight: 900; color: #bd93f9; text-shadow: 0 0 20px #bd93f9; }
        .percent { font-size: 0.9rem; color: #8be9fd; font-weight: 800; letter-spacing: 0.4rem; }

        .loading-meter { width: 300px; text-align: center; }
        .meter-track { height: 2px; background: #44475a; width: 100%; position: relative; margin-bottom: 0.5rem; }
        .meter-fill { height: 100%; background: #50fa7b; box-shadow: 0 0 10px #50fa7b; transition: width 0.1s linear; }

        .diag-shard { position: absolute; font-size: 0.55rem; color: #6272a4; letter-spacing: 2px; z-index: 5; }
        .tl { top: 30px; left: 30px; }
        .tr { top: 30px; right: 30px; }
        .bl { bottom: 30px; left: 30px; }
        .br { bottom: 30px; right: 30px; }
      `}</style>
    </div>
  );
}
