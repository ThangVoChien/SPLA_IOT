'use client'

import React from 'react';

/**
 * Premium Gauge Widget for Next.js (Bootstrap/Dracula Theme)
 * Custom SVG-based circular indicator with dynamic thresholds and glassmorphism.
 */
const GaugeWidget = ({ value, min = 0, max = 100, label, unit, color = '#bd93f9', thresholds }) => {
    const percentage = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference * 0.75; // 270 degree arc
    const rotation = 135; // Start from bottom-left

    // Determine color from thresholds (Mapped to Dracula/Bootstrap colors)
    let gaugeColor = color;
    if (thresholds) {
        const hasWarn = typeof thresholds.warn === 'number';
        const hasCritical = typeof thresholds.critical === 'number';
        if (thresholds.invertWarning) {
            if (hasCritical && value < thresholds.critical) gaugeColor = '#ff5555'; // Dracula Danger
            else if (hasWarn && value < thresholds.warn) gaugeColor = '#f1fa8c'; // Dracula Warning
            else gaugeColor = '#50fa7b'; // Dracula Success
        } else {
            if (hasCritical && value >= thresholds.critical) gaugeColor = '#ff5555';
            else if (hasWarn && value >= thresholds.warn) gaugeColor = '#f1fa8c';
            else gaugeColor = '#50fa7b';
        }
    }

    return (
        <div className="glass-panel p-4 d-flex flex-column align-items-center position-relative overflow-hidden group transition-all hover:scale-105">
            {/* Background Glow */}
            <div 
                className="position-absolute start-0 top-0 w-100 h-100 opacity-10 transition-opacity duration-500 group-hover:opacity-20 blur-2xl z-0"
                style={{ background: `radial-gradient(circle at center, ${gaugeColor}, transparent 70%)` }}
            />
            
            <p className="small text-muted mb-4 font-bold text-uppercase tracking-widest position-relative z-1">{label}</p>
            <div className="position-relative" style={{ width: '140px', height: '140px' }}>
                <svg className="w-100 h-100" viewBox="0 0 140 140">
                    {/* Background arc */}
                    <circle
                        cx="70" cy="70" r={radius}
                        fill="none"
                        stroke="#44475a" // Dracula Selection/Background
                        strokeWidth="10"
                        strokeDasharray={circumference * 0.75}
                        strokeDashoffset="0"
                        strokeLinecap="round"
                        transform={`rotate(${rotation} 70 70)`}
                    />
                    {/* Value arc */}
                    <circle
                        cx="70" cy="70" r={radius}
                        fill="none"
                        stroke={gaugeColor}
                        strokeWidth="10"
                        strokeDasharray={circumference * 0.75}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        transform={`rotate(${rotation} 70 70)`}
                        style={{ 
                            filter: `drop-shadow(0 0 6px ${gaugeColor}50)`,
                            transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    />
                </svg>
                <div className="position-absolute start-0 top-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center pt-2">
                    <span className="fs-1 fw-bold tracking-tight" style={{ color: gaugeColor, textShadow: `0 0 20px ${gaugeColor}40` }}>
                        {typeof value === 'number' ? value.toFixed(1) : value}
                    </span>
                    <span className="small font-medium text-muted mt-1 opacity-50">{unit}</span>
                </div>
            </div>
        </div>
    );
};

export default GaugeWidget;
