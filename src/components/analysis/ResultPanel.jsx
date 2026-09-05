import useAnalysisStore from "../../store/analysisStore";

function ResultPanel() {
  const status = useAnalysisStore((state) => state.status);
  const task = useAnalysisStore((state) => state.task);
  const result = useAnalysisStore((state) => state.result);
  const confidence = useAnalysisStore((state) => state.confidence);

  if (status !== "complete" || !result) {
    return null;
  }

  const confidencePercentage = Math.round((confidence ?? 0) * 100);

  return (
    <div className="absolute right-6 top-6 z-20 w-[320px] rounded-2xl border border-white/10 bg-[#0b0b0c]/90 p-5 shadow-2xl backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[9px] tracking-[0.3em] text-white/30">
            ANALYSIS RESULT
          </p>

          <h2 className="mt-1 text-sm font-medium text-white">
            {task?.replaceAll("_", " ")}
          </h2>
        </div>

        <div className="rounded-full border border-amber-400/30 px-2 py-1">
          <span className="text-[10px] text-amber-300">
            {confidencePercentage}%
          </span>
        </div>
      </div>

      <div className="border-t border-white/10 pt-4">
        <p className="text-xs leading-6 text-white/65">
          {result.answer}
        </p>
      </div>

      {result.execution && (
        <div className="mt-5 border-t border-white/10 pt-4">
          <p className="text-[9px] tracking-[0.25em] text-white/30">
            WORKFLOW
          </p>

          <p className="mt-2 text-xs text-white/50">
            {result.execution.workflow?.replaceAll("_", " ")}
          </p>
        </div>
      )}

      <button
        type="button"
        className="mt-5 w-full rounded-xl border border-white/10 px-4 py-2 text-[10px] tracking-[0.15em] text-white/50 transition-colors hover:border-amber-400/30 hover:text-white"
      >
        WHY THIS ANSWER
      </button>
    </div>
  );
}

export default ResultPanel;