'use client'

import React from 'react';
import GroupDashboard from '@/components/core/GroupDashboard';

/**
 * Factory Dashboard Page
 * Manages production areas and device assignments in the factory domain
 */
export default function FactoryPage() {
  return (
    <div className="container-fluid p-4">
      <GroupDashboard
        title="Production Areas"
        description="Organize and manage devices across factory production areas."
        icon="bi-factory"
        emptyMessage="No production areas configured yet."
        addLabel="New Production Area"
        cardActionLabel="Manage Area"
      />
    </div>
  );
}
