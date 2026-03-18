"use client";

import { DashboardContent } from "@/components/dashboard/dashboard-content";

type ClientProps = {
  greeting: string;
  firstName: string;
};

export default function Client({ greeting, firstName }: ClientProps) {
  return (
    <DashboardContent
      greeting={greeting}
      firstName={firstName}
      // Optionally, dashboard content shows FlowCRM copy as standard, or remove mock warning
    />
  );
}