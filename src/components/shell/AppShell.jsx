import ResultPanel from "../analysis/ResultPanel";
import AnalysisTrace from "../analysis/AnalysisTrace";
import ImageryViewer from "../imagery/ImageryViewer";
import TopBar from "./TopBar";
import NavigationRail from "./NavigationRail";
import QueryDock from "../query/QueryDock";
import SatQueryCore from "../core/SatQueryCore";
import TemporalComparison from "../analysis/TemporalComparison";
import MultimodalComparison from "../analysis/MultimodalComparison";

function AppShell() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0b0b0c] text-white">
      <TopBar />

      <div className="flex min-h-0 flex-1">
        <NavigationRail />

        <main className="flex min-w-0 flex-1 flex-col">
          <section className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_55%)]" />

            <ImageryViewer />
            <SatQueryCore />
            <ResultPanel />
            <AnalysisTrace />
            <TemporalComparison />
            <MultimodalComparison />
          </section>

          <QueryDock />
        </main>
      </div>
    </div>
  );
}

export default AppShell;