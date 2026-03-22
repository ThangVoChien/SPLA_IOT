'use client'

import React, { Suspense } from 'react';
import DashboardContent from '@/components/core/DashboardContent';

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading Core Framework...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
