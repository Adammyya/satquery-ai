import { useState } from "react";
import useAnalysisStore from "../../store/analysisStore";
import ReportButton from "./ReportButton";

function ResultPanel() {
  const [showEvidence, setShowEvidence] = useState(false);

  const status = useAnalysisStore((state) => state.status);
  const task = useAnalysisStore((state) => state.task);
  const result = useAnalysisStore((state) => state.result);
  const confidence = useAnalysisStore((state) => state.confidence);
  const evidence = useAnalysisStore((state) => state.evidence);

  if (status !== "complete" || !result) {
    return null;
  }

  const confidencePercentage = Math.round((confidence ?? 0) * 100);

  const taskLabel = task
    ? task.replaceAll("_", " ").toUpperCase()
    : "ANALYSIS";

  const workflowLabel =
    result.execution?.workflow?.replaceAll("_", " ") || "Analysis workflow";

  return (
    <div
      className="absolute right-6 top-6 z-20 w-[320px] max-h-[calc(100vh-8rem)] overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-[#0b0b0c]/90 p-5 shadow-2xl backdrop-blur-xl"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.45)]" />

            <p className="text-[9px] tracking-[0.3em] text-white/35">
              ANALYSIS COMPLETE
            </p>
          </div>

          <h2 className="mt-2 break-words text-sm font-medium capitalize text-white">
            {task?.replaceAll("_", " ") || "Analysis"}
          </h2>
        </div>

        <div className="shrink-0 rounded-lg border border-amber-400/20 bg-amber-400/[0.04] px-2.5 py-1.5 text-right">
          <p className="text-[8px] tracking-[0.15em] text-white/25">
            CONFIDENCE
          </p>

          <p className="mt-0.5 text-sm font-medium text-amber-300">
            {confidencePercentage}%
          </p>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-amber-300/70 transition-all duration-700"
          style={{ width: `${confidencePercentage}%` }}
        />
      </div>

      {/* Answer */}
      <div className="mt-5 border-t border-white/10 pt-4">
        <p className="mb-2 text-[9px] tracking-[0.25em] text-white/30">
          ANSWER
        </p>

        <p className="text-sm leading-6 text-white/80">
          {result.answer}
        </p>
      </div>

      {/* Analysis details */}
      <div className="mt-5 grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
        <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
          <p className="text-[8px] tracking-[0.2em] text-white/25">
            TASK
          </p>

          <p className="mt-1 text-[9px] leading-4 text-white/55">
            {taskLabel}
          </p>
        </div>

        <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
          <p className="text-[8px] tracking-[0.2em] text-white/25">
            WORKFLOW
          </p>

          <p className="mt-1 text-[9px] capitalize leading-4 text-white/55">
            {workflowLabel}
          </p>
        </div>
      </div>

      {/* Model */}
      {result.execution?.model && (
        <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
          <span className="text-[8px] tracking-[0.2em] text-white/25">
            MODEL
          </span>

          <span className="text-[9px] text-white/45">
            {result.execution.model}
          </span>
        </div>
      )}

      {/* Evidence toggle */}
      <button
        type="button"
        onClick={() => setShowEvidence((current) => !current)}
        className="mt-5 flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-left transition-all hover:border-amber-400/30 hover:bg-white/[0.04]"
      >
        <span className="text-[10px] tracking-[0.15em] text-white/55">
          {showEvidence ? "HIDE EVIDENCE" : "WHY THIS ANSWER"}
        </span>

        <span className="text-xs text-white/30">
          {showEvidence ? "−" : "+"}
        </span>
      </button>

      {/* Evidence */}
      {showEvidence && evidence && (
        <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <div className="flex items-center justify-between">
            <p className="text-[9px] tracking-[0.25em] text-white/30">
              EVIDENCE
            </p>

            <span className="rounded-md border border-cyan-300/15 bg-cyan-300/[0.03] px-2 py-1 text-[8px] uppercase tracking-[0.15em] text-cyan-200/60">
              {evidence.type}
            </span>
          </div>

          <p className="mt-3 text-xs leading-5 text-white/55">
            {evidence.description}
          </p>

          <div className="mt-3 border-t border-white/5 pt-3">
            <p className="text-[8px] uppercase tracking-[0.2em] text-white/20">
              Evidence source
            </p>

            <p className="mt-1 text-[9px] text-white/40">
              {evidence.type} analysis output
            </p>
          </div>
        </div>
      )}

      {/* Report */}
      <div className="mt-3">
        <ReportButton />
      </div>
    </div>
  );
}

export default ResultPanel;