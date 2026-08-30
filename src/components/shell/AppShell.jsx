import TopBar from "./TopBar";
import NavigationRail from "./NavigationRail";
import QueryDock from "../query/QueryDock";
import SatQueryCore from "../core/SatQueryCore";

function AppShell() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0b0b0c] text-white">
      <TopBar />

      <div className="flex min-h-0 flex-1">
        <NavigationRail />

        <main className="flex min-w-0 flex-1 flex-col">
          <section className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_55%)]" />

            <SatQueryCore />
          </section>

          <QueryDock />
        </main>
      </div>
    </div>
  );
}

export default AppShell;