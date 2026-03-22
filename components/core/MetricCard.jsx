'use client'

import React, { useEffect, useState } from 'react';

/**
 * Premium MetricCard for Next.js (Bootstrap/Dracula Theme)
 * Displays a single value with status indicators, dynamic icons, and pulse animations.
 */
const getIconPath = (label = '', unit = '') => {
    const text = (label + ' ' + unit).toLowerCase();
    if (text.includes('temp') || text.includes('°c') || text.includes('celsius')) 
        return "M12 2.25a3.75 3.75 0 00-3.75 3.75v8.558a4.5 4.5 0 107.5 0V6a3.75 3.75 0 00-3.75-3.75z M12 6v6"; // Thermometer
    if (text.includes('humid') || text.includes('%')) 
        return "M12 2.25c-3 4.5-6 7.5-6 10.5a6 6 0 1012 0c0-3-3-6-6-10.5z"; // Droplet
    if (text.includes('press') || text.includes('hpa') || text.includes('psi')) 
        return "M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z M12 12l3.5-3.5 M12 12v4.5"; // Gauge
    if (text.includes('gas') || text.includes('pm')) 
        return "M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z"; // Cloud
    if (text.includes('vibra') || text.includes('motion') || text.includes('speed'))
        return "M3 13.5l4.5-4.5 4.5 4.5 6-6 3 3"; // Wave/Activity
    
    // Default chart bar
    return "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z";
};

const MetricCard = ({ label, value, unit, status }) => {
    const [isPulsing, setIsPulsing] = useState(false);
    
    // Animate on value change
    useEffect(() => {
        setIsPulsing(true);
        const timer = setTimeout(() => setIsPulsing(false), 500);
        return () => clearTimeout(timer);
    }, [value]);

    const statusStyle = 
        status === 'critical' ? {
            color: 'text-danger',
            bg: 'bg-danger bg-opacity-10',
            border: 'border-danger border-opacity-25',
            iconColor: 'text-danger',
            dot: 'bg-danger shadow-danger animate-pulse'
        } : status === 'warning' ? {
            color: 'text-warning',
            bg: 'bg-warning bg-opacity-10',
            border: 'border-warning border-opacity-25',
            iconColor: 'text-warning',
            dot: 'bg-warning shadow-warning'
        } : {
            color: 'text-success',
            bg: 'bg-success bg-opacity-10',
            border: 'border-success border-opacity-25',
            iconColor: 'text-primary',
            dot: 'bg-success'
        };

    const iconPath = getIconPath(label, unit);

    return (
        <div className={`glass-panel p-4 animate-fade-in-up position-relative overflow-hidden group ${status === 'critical' ? 'border-danger border-opacity-50' : ''}`}>
            {/* Background Glow */}
            <div 
              className={`position-absolute end-0 top-0 translate-middle w-50 h-50 rounded-circle blur-2xl transition-all duration-500 opacity-20 group-hover:opacity-30 ${isPulsing ? 'scale-125 opacity-40' : 'scale-100'} ${statusStyle.bg.split(' ')[0]}`}
              style={{ right: '-20%', top: '-20%' }}
            />
            
            <div className="d-flex justify-content-between align-items-start mb-4 position-relative z-1">
                <div className="d-flex align-items-center gap-3">
                    <div className={`p-2 rounded-3 ${statusStyle.bg} border ${statusStyle.border} d-flex align-items-center justify-content-center`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '24px', height: '24px' }} className={statusStyle.iconColor}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
                        </svg>
                    </div>
                    <p className="small text-muted font-bold text-uppercase tracking-widest mb-0">{label}</p>
                </div>
                {status && (
                    <div className={`d-flex align-items-center gap-2 px-2 py-1 rounded-pill border ${statusStyle.bg} ${statusStyle.border} ${statusStyle.color}`}>
                        <div className={`rounded-circle ${statusStyle.dot}`} style={{ width: '6px', height: '6px' }} />
                        <span className="fw-bold text-uppercase tracking-widest" style={{ fontSize: '10px' }}>{status}</span>
                    </div>
                )}
            </div>
            
            <div className="d-flex align-items-baseline gap-2 position-relative z-1">
                <span className={`fs-1 fw-bold tracking-tight transition-all duration-300 ${isPulsing ? 'text-white' : 'text-slate-100'}`}>
                    {typeof value === 'number' ? value.toFixed(1) : (value || '--')}
                </span>
                <span className="small font-medium text-muted opacity-50">{unit}</span>
            </div>
        </div>
    );
};

export default MetricCard;
