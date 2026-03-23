"use client";

import React from "react";
import GroupDashboard from "@/components/core/GroupDashboard";

/**
 * Home Dashboard Page
 * Manages zones/rooms and device assignments in the home domain.
 */
export default function HomePage() {
  return (
    <div className="container-fluid p-4">
      <GroupDashboard
        title="Home Zones"
        description="Organize and manage household devices by room or area."
        icon="bi-house"
        emptyMessage="No home zones configured yet."
        addLabel="New Home Zone"
        cardActionLabel="Manage Zone"
      />
    </div>
  );
}
