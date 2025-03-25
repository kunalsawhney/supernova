import { AnalyticsCommand } from "./AnalyticsCommand";
// import { SystemHealthMonitor } from "./SystemHealthMonitor";

export function ExploreMode() {
  return (
    <div className="space-y-6">
      <AnalyticsCommand />
      {/* <SystemHealthMonitor /> */}
    </div>
  );
}