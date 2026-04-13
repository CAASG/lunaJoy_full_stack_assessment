/**
 * @module DashboardPage
 * @description Main dashboard showing mental health trends and summaries.
 * Charts and data visualization will be implemented in Phase 4.
 */

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-luna-dark">Dashboard</h1>
        <p className="text-luna-warm-gray mt-1">
          Your mental health overview at a glance.
        </p>
      </div>

      <div className="rounded-xl bg-white border border-luna-cream-dark p-8 text-center">
        <p className="text-luna-warm-gray">
          Charts and trends will appear here once you start logging.
        </p>
        <p className="text-sm text-luna-warm-gray mt-2">
          Coming in Phase 4.
        </p>
      </div>
    </div>
  );
}
