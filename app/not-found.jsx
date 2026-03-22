'use client'

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 p-4" style={{ backgroundColor: '#282a36' }}>
      <div className="text-center animate-fade-in glass-panel p-5 shadow-lg" style={{ maxWidth: '600px', backgroundColor: '#44475a' }}>
        <div className="display-1 fw-bold text-white mb-4 opacity-75">404</div>
        <h1 className="fw-bold tracking-tight text-white mb-3" style={{ fontSize: '2rem' }}>
          Lost in the <span style={{ color: '#bd93f9' }}>IoT Void?</span>
        </h1>
        <p className="opacity-75 fs-5 mb-5 text-white">
          The node you are looking for has been disconnected or doesn't exist in our global registry.
        </p>
        <div className="d-flex gap-3 justify-content-center">
          <Link href="/dashboard" className="btn btn-primary px-4 py-2 fw-bold shadow-lg">
            <i className="bi bi-speedometer2 me-2"></i> Return to Console
          </Link>
        </div>

        <div className="mt-5 pt-4 border-top border-white border-opacity-10 opacity-25">
          <i className="bi bi-stack fs-1"></i>
          <div className="small fw-bold mt-2">SPLA IOT CORE</div>
        </div>
      </div>
    </div>
  );
}
