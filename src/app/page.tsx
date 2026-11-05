import { Dashboard } from "@/components/Dashboard";
import { getAllProjects, getLastUpdated } from "@/lib/stats";

export const dynamic = "force-static";
export const revalidate = 3600; // refresh every hour

export default function Page() {
  const projects = getAllProjects();
  const lastUpdated = getLastUpdated();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Dashboard projects={projects} lastUpdated={lastUpdated} />
      <footer className="mt-12 border-t border-gray-800 pt-6 text-xs text-gray-600">
        <p>
          Data compiled from public sources. Capacities are announced/planned
          totals unless noted. This tracker is for informational purposes only.
        </p>
      </footer>
    </main>
  );
}