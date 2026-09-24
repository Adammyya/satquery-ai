import useAnalysisStore from "../../store/analysisStore";

function HistoryDrawer({ onClose }) {
  const history = useAnalysisStore((state) => state.history);
  const setQuery = useAnalysisStore((state) => state.setQuery);
  const setTask = useAnalysisStore((state) => state.setTask);
  const setResult = useAnalysisStore((state) => state.setResult);
  const setConfidence = useAnalysisStore((state) => state.setConfidence);
  const setStatus = useAnalysisStore((state) => state.setStatus);

  const handleRestore = (entry) => {
    setQuery(entry.query);
    setTask(entry.task);
    setConfidence(entry.confidence);

    setResult({
      task: entry.task,
      answer: entry.answer,
      confidence: entry.confidence,
      execution: {
        model: "SatQuery Demo Model",
        workflow: entry.task,
      },
    });

    setStatus("complete");
    onClose();
  };

  const formatTask = (task) => {
    if (!task) {
      return "ANALYSIS";
    }

    return task.replaceAll("_", " ").toUpperCase();
  };

  const formatTime = (timestamp) => {
    if (!timestamp) {
      return "";
    }

    return new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(timestamp));
  };

  return (
    <div className="absolute inset-0 z-40">
      <button
        type="button"
        aria-label="Close history"
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
              Analysis History
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-white/40 transition-colors hover:border-white/20 hover:text-white"
            aria-label="Close history"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {history.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-white/20">
                  ◇
                </div>

                <p className="mt-4 text-[9px] tracking-[0.25em] text-white/30">
                  NO ANALYSIS HISTORY
                </p>

                <p className="mt-2 max-w-[220px] text-xs leading-5 text-white/25">
                  Completed analyses will appear here during this session.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => handleRestore(entry)}
                  className="w-full rounded-xl border border-white/8 bg-white/[0.02] p-4 text-left transition-all hover:border-amber-400/20 hover:bg-white/[0.04]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="line-clamp-2 text-xs leading-5 text-white/75">
                      {entry.query}
                    </p>

                    <span className="shrink-0 text-[8px] text-white/25">
                      {formatTime(entry.timestamp)}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                    <span className="text-[8px] tracking-[0.15em] text-white/30">
                      {formatTask(entry.task)}
                    </span>

                    <span className="text-[9px] text-amber-300/70">
                      {Math.round((entry.confidence ?? 0) * 100)}%
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-white/10 px-5 py-3">
          <p className="text-[8px] leading-4 tracking-[0.08em] text-white/20">
            SESSION HISTORY · LAST {history.length} ANALYSES
          </p>
        </div>
      </aside>
    </div>
  );
}

export default HistoryDrawer;