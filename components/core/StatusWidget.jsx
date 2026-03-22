'use client'

import React, { useEffect, useState } from 'react';

/**
 * Premium Status Widget for SPLA (Bootstrap/Dracula Theme)
 * Displays a discrete status value with mapping, alerts, and pulse animations.
 */
const StatusWidget = ({ label, value, mapping }) => {
    const displayValue = mapping ? (mapping[value] || 'Unknown') : value;
    
    // Alert logic based on values or keywords
    const isAlert = value === 1 || value === 2 || 
                    value === 'Detected' || 
                    String(displayValue).toLowerCase().includes('accident') || 
                    String(displayValue).toLowerCase().includes('heavy');
    
    const [isPulsing, setIsPulsing] = useState(false);
    
    // Animate on value change
    useEffect(() => {
        setIsPulsing(true);
        const timer = setTimeout(() => setIsPulsing(false), 500);
        return () => clearTimeout(timer);
    }, [value]);

    return (
        <div className={`glass-panel p-4 animate-fade-in-up position-relative overflow-hidden group transition-all hover:scale-105 ${isAlert ? 'border-danger border-opacity-50' : ''}`}>
            {/* Background Glow */}
            <div 
                className={`position-absolute end-0 top-0 translate-middle w-50 h-50 rounded-circle blur-2xl transition-all duration-500 opacity-20 group-hover:opacity-30 ${isPulsing ? 'scale-125 opacity-40' : 'scale-100'} ${isAlert ? 'bg-danger' : 'bg-success'}`}
                style={{ right: '-20%', top: '-20%' }}
            />
            
            <div className="d-flex align-items-center gap-3 mb-4 position-relative z-1">
                <div className={`p-2.5 rounded-3 border d-flex align-items-center justify-content-center ${isAlert ? 'bg-danger bg-opacity-10 border-danger border-opacity-25 text-danger' : 'bg-success bg-opacity-10 border-success border-opacity-25 text-success'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '24px', height: '24px' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <p className="small text-muted font-bold text-uppercase tracking-widest mb-0">{label}</p>
            </div>
            
            <div className="d-flex align-items-center gap-3 position-relative z-1">
                <div className="position-relative d-flex" style={{ width: '12px', height: '12px' }}>
                    {isAlert && <span className="animate-pulse position-absolute w-100 h-100 rounded-circle bg-danger opacity-75 shadow-danger"></span>}
                    <span className={`position-relative rounded-circle w-100 h-100 ${isAlert ? 'bg-danger shadow-danger' : 'bg-success'}`}></span>
                </div>
                <span className={`fs-2 fw-bold tracking-tight transition-colors duration-300 ${isAlert ? 'text-danger' : 'text-success'} ${isPulsing ? 'text-white' : ''}`} style={{ textShadow: isAlert ? '0 0 15px rgba(255, 85, 85, 0.3)' : 'none' }}>
                    {displayValue}
                </span>
            </div>
        </div>
    );
};

export default StatusWidget;
