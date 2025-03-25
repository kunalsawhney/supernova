import { OperationalControlCenter } from "./OperationalControlCenter";
import { OverviewStats } from "./OverviewStats";

export function FocusMode() {
  return (
    <div className="space-y-6">
      <OverviewStats />
      <OperationalControlCenter />
    </div>
  );
}