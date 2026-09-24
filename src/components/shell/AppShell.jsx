import { useState } from "react";
import WorkflowVisualizer from "../analysis/WorkflowVisualizer";
import ResultPanel from "../analysis/ResultPanel";
import AnalysisTrace from "../analysis/AnalysisTrace";
import ImageryViewer from "../imagery/ImageryViewer";
import TopBar from "./TopBar";
import NavigationRail from "./NavigationRail";
import QueryDock from "../query/QueryDock";
import SatQueryCore from "../core/SatQueryCore";
import TemporalComparison from "../analysis/TemporalComparison";
import MultimodalComparison from "../analysis/MultimodalComparison";
import HistoryDrawer from "./HistoryDrawer";
import SettingsDrawer from "./SettingsDrawer";

function AppShell() {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("workspace");

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0b0b0c] text-white">
      <TopBar
        onHistoryClick={() => setHistoryOpen(true)}
        onSettingsClick={() => setSettingsOpen(true)}
      />

      <div className="flex min-h-0 flex-1">
        <NavigationRail
          activeSection={activeSection}
          onWorkspaceClick={() => setActiveSection("workspace")}
          onImageryClick={() => setActiveSection("imagery")}
          onAnalysisClick={() => setActiveSection("analysis")}
          onSettingsClick={() => setSettingsOpen(true)}
        />

        <main className="flex min-w-0 flex-1 flex-col">
          <section
            className={`relative flex min-h-0 flex-1 items-center justify-center overflow-hidden transition-all duration-300 ${
              activeSection === "workspace"
                ? "ring-1 ring-inset ring-amber-400/20"
                : ""
            }`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_55%)]" />

            <div
              className={`absolute inset-0 transition-all duration-300 ${
                activeSection === "imagery"
                  ? "ring-1 ring-inset ring-cyan-300/30"
                  : ""
              }`}
            >
              <ImageryViewer />
            </div>

            <SatQueryCore />

            <div
              className={`absolute inset-0 transition-all duration-300 ${
                activeSection === "analysis"
                  ? "ring-1 ring-inset ring-amber-300/30"
                  : ""
              }`}
            >
              <ResultPanel />
              <TemporalComparison />
              <MultimodalComparison />
            </div>

            <AnalysisTrace />
            <WorkflowVisualizer />
            
          </section>

          <div
            className={`transition-all duration-300 ${
              activeSection === "analysis"
                ? "ring-1 ring-inset ring-amber-400/20"
                : ""
            }`}
          >
            <QueryDock />
          </div>
        </main>
      </div>

      {historyOpen && (
        <HistoryDrawer onClose={() => setHistoryOpen(false)} />
      )}

      {settingsOpen && (
        <SettingsDrawer onClose={() => setSettingsOpen(false)} />
      )}
    </div>
  );
}

export default AppShell;