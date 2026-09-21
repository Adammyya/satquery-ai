import { useState } from "react";
import useAnalysisStore from "../../store/analysisStore";

function AnalysisTrace() {
  const [expanded, setExpanded] = useState(false);

  const executionTrace = useAnalysisStore(
    (state) => state.executionTrace
  );

  const status = useAnalysisStore((state) => state.status);

  if (!executionTrace.length) {
    return null;
  }

  const visibleEvents = expanded
    ? executionTrace
    : executionTrace.slice(-4);

  return (
    <div className="absolute bottom-6 left-6 z-20 w-[300px] overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0c]/90 shadow-2xl backdrop-blur-xl">
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className="flex w-full items-center justify-between border-b border-white/10 px-4 py-3 text-left transition-colors hover:bg-white/[0.03]"
      >
        <div>
          <p className="text-[9px] tracking-[0.3em] text-white/30">
            EXECUTION
          </p>

          <p className="mt-1 text-xs font-medium text-white/70">
            ANALYSIS TRACE
          </p>
        </div>

        <span className="text-xs text-white/30">
          {expanded ? "−" : "+"}
        </span>
      </button>

      <div className="max-h-72 overflow-y-auto px-4 py-3">
        <div className="space-y-3">
          {visibleEvents.map((event, index) => {
            const isProcessing = event.type === "processing";

            return (
              <div
                key={`${event.label}-${index}`}
                className="flex gap-3"
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`mt-1 flex h-4 w-4 items-center justify-center rounded-full border ${
                      isProcessing
                        ? "border-amber-400/50"
                        : "border-emerald-400/30"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isProcessing
                          ? "bg-amber-400"
                          : "bg-emerald-400"
                      }`}
                    />
                  </div>

                  {index < visibleEvents.length - 1 && (
                    <div className="mt-1 h-full min-h-5 w-px bg-white/10" />
                  )}
                </div>

                <div className="min-w-0 pb-1">
                  <p
                    className={`text-[9px] tracking-[0.15em] ${
                      isProcessing
                        ? "text-amber-300/70"
                        : "text-white/50"
                    }`}
                  >
                    {event.label}
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-white/30">
                    {event.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {!expanded && executionTrace.length > 4 && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="mt-3 text-[9px] tracking-[0.15em] text-white/30 transition-colors hover:text-white/60"
          >
            SHOW FULL TRACE →
          </button>
        )}
      </div>

      <div className="border-t border-white/5 px-4 py-2">
        <p className="text-[8px] tracking-[0.2em] text-white/20">
          STATUS: {status.replaceAll("_", " ").toUpperCase()}
        </p>
      </div>
    </div>
  );
}

export default AnalysisTrace;