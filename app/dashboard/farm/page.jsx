'use client'

import GroupDashboard from '@/components/core/GroupDashboard';

export default function FarmPage() {
  return (
    <GroupDashboard
      title="Field Management"
      description="Manage your agricultural fields and assign monitoring devices to each field."
      icon="bi-tree"
      emptyMessage="No fields created yet. Start by adding a new field to organize your devices."
      addLabel="New Field"
      cardActionLabel="Manage Devices"
    />
  );
}
