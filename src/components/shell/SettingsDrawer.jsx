
import useAnalysisStore from "../../store/analysisStore";

function SettingsDrawer({ onClose }) {
  const showTrace = useAnalysisStore((state) => state.showTrace);
  const showConfidence = useAnalysisStore(
    (state) => state.showConfidence
  );
  const setShowTrace = useAnalysisStore(
    (state) => state.setShowTrace
  );
  const setShowConfidence = useAnalysisStore(
    (state) => state.setShowConfidence
  );

  return (
    <div className="absolute inset-0 z-40">
      <button
        type="button"
        aria-label="Close settings"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
      />

      <aside className="absolute right-0 top-0 flex h-full w-[360px] max-w-[90vw] flex-col border-l border-white/10 bg-[#0b0b0c]/98 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-[9px] tracking-[0.3em] text-white/30">
              SATQUERY
            </p>

            <h2 className="mt-1 text-sm font-medium text-white">
              Settings
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-white/40 transition-colors hover:border-white/20 hover:text-white"
            aria-label="Close settings"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <section>
            <p className="text-[9px] tracking-[0.25em] text-white/30">
              ANALYSIS
            </p>

            <div className="mt-3 space-y-2">
              <SettingToggle
                label="Execution trace"
                description="Show the live analysis execution trace."
                enabled={showTrace}
                onChange={() => setShowTrace(!showTrace)}
              />

              <SettingToggle
                label="Confidence"
                description="Show confidence information in results."
                enabled={showConfidence}
                onChange={() =>
                  setShowConfidence(!showConfidence)
                }
              />
            </div>
          </section>

          <section className="mt-8">
            <p className="text-[9px] tracking-[0.25em] text-white/30">
              DISPLAY
            </p>

            <div className="mt-3 rounded-xl border border-white/8 bg-white/[0.02] p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] tracking-[0.12em] text-white/40">
                  INTERFACE
                </span>

                <span className="text-[9px] text-white/60">
                  Scientific Workstation
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                <span className="text-[10px] tracking-[0.12em] text-white/40">
                  THEME
                </span>

                <span className="text-[9px] text-white/60">
                  Dark
                </span>
              </div>
            </div>
          </section>

          <section className="mt-8">
            <p className="text-[9px] tracking-[0.25em] text-white/30">
              SYSTEM
            </p>

            <div className="mt-3 rounded-xl border border-white/8 bg-white/[0.02] p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] tracking-[0.12em] text-white/40">
                  FRONTEND
                </span>

                <span className="text-[9px] text-emerald-300/70">
                  ONLINE
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                <span className="text-[10px] tracking-[0.12em] text-white/40">
                  ANALYSIS ENGINE
                </span>

                <span className="text-[9px] text-amber-300/70">
                  DEMO MODE
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                <span className="text-[10px] tracking-[0.12em] text-white/40">
                  VERSION
                </span>

                <span className="text-[9px] text-white/40">
                  0.1.0
                </span>
              </div>
            </div>
          </section>
        </div>

        <div className="border-t border-white/10 px-5 py-3">
          <p className="text-[8px] leading-4 tracking-[0.08em] text-white/20">
            SETTINGS · SATQUERY APPLICATION WORKSPACE
          </p>
        </div>
      </aside>
    </div>
  );
}

function SettingToggle({
  label,
  description,
  enabled,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/8 bg-white/[0.02] p-4">
      <div className="min-w-0">
        <p className="text-[10px] text-white/65">{label}</p>

        <p className="mt-1 text-[9px] leading-4 text-white/25">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={onChange}
        aria-pressed={enabled}
        className={`relative h-5 w-9 shrink-0 rounded-full border transition-colors ${
          enabled
            ? "border-amber-400/30 bg-amber-400/20"
            : "border-white/10 bg-white/5"
        }`}
      >
        <span
          className={`absolute top-0.5 h-3.5 w-3.5 rounded-full transition-all ${
            enabled
              ? "left-[17px] bg-amber-300"
              : "left-0.5 bg-white/30"
          }`}
        />
      </button>
    </div>
  );
}

export default SettingsDrawer;