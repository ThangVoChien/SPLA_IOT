'use client'

import React, { useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

/**
 * Premium LineChartWidget for Next.js (Bootstrap/Dracula Theme)
 * Real-time telemetry visualization with smooth transitions and glassmorphism.
 */
const LineChartWidget = ({ title, data = [], label, unit, color = '#bd93f9' }) => {
    const chartRef = useRef(null);

    // Prepare data for Chart.js
    const chartData = {
        labels: data.map((_, i) => {
            const d = data[i];
            if (d.timestamp) return new Date(d.timestamp).toLocaleTimeString();
            return `T${i}`;
        }),
        datasets: [
            {
                label: `${label} (${unit})`,
                data: data.map(d => d.value),
                borderColor: color,
                backgroundColor: `${color}15`,
                borderWidth: 2,
                tension: 0.4, // Smooth curve
                fill: true,
                pointRadius: 0,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: color,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: false },
            tooltip: {
                backgroundColor: '#1e1f29', // Dracula Background
                titleColor: '#f8f8f2',    // Dracula Text
                bodyColor: '#94a3b8',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                cornerRadius: 12,
                padding: 12,
                boxPadding: 4,
            },
        },
        scales: {
            x: {
                display: false,
                grid: { display: false },
            },
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.05)', lineWidth: 1 },
                ticks: { color: '#6272a4', font: { size: 11 } },
                border: { display: false }
            },
        },
        interaction: {
            intersect: false,
            mode: 'index',
        },
        animation: {
            duration: 750,
            easing: 'easeInOutQuart'
        }
    };

    return (
        <div className="glass-panel p-4 animate-fade-in-up h-100 d-flex flex-column position-relative overflow-hidden group transition-all hover:scale-105">
            {/* Background Accent Glow */}
            <div 
                className="position-absolute translate-middle opacity-10 blur-2xl transition-opacity duration-500 group-hover:opacity-20 z-0"
                style={{ 
                    backgroundColor: color, 
                    width: '128px', 
                    height: '128px', 
                    borderRadius: '50%',
                    left: '10px',
                    top: '10px'
                }}
            />
            
            <p className="small text-muted mb-4 font-bold text-uppercase tracking-widest position-relative z-1">{title}</p>
            <div className="flex-grow-1 position-relative z-1" style={{ minHeight: '180px' }}>
                <Line ref={chartRef} options={options} data={chartData} />
            </div>
        </div>
    );
};

export default LineChartWidget;
