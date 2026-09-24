import { useState } from "react";
import useAnalysisStore from "../../store/analysisStore";
import useImageryStore from "../../store/imageryStore";
import { analyzeQuery } from "../../services/api/queryApi";
import { runMockAnalysis } from "../../services/websocket/analysisSocket";

const suggestedQueries = [
  {
    label: "DESCRIBE SCENE",
    query: "Describe this scene.",
  },
  {
    label: "DETECT CHANGE",
    query: "What changed between these two observations?",
  },
  {
    label: "LOCATE REGION",
    query: "Where is the built-up region?",
  },
  {
    label: "OPTICAL + SAR",
    query: "Compare optical and SAR observations.",
  },
];

const processingStates = [
  "understanding",
  "validating",
  "routing",
  "analyzing",
  "evidence",
];

function QueryDock() {
  const [input, setInput] = useState("");

  const status = useAnalysisStore((state) => state.status);

  const setQuery = useAnalysisStore((state) => state.setQuery);
  const setStatus = useAnalysisStore((state) => state.setStatus);
  const setTask = useAnalysisStore((state) => state.setTask);
  const setResult = useAnalysisStore((state) => state.setResult);
  const setConfidence = useAnalysisStore((state) => state.setConfidence);
  const setEvidence = useAnalysisStore((state) => state.setEvidence);

  const setOverlays = useImageryStore((state) => state.setOverlays);

  const addTraceEvent = useAnalysisStore(
    (state) => state.addTraceEvent
  );
  const addHistoryEntry = useAnalysisStore(
  (state) => state.addHistoryEntry
);

  const clearExecutionTrace = useAnalysisStore(
    (state) => state.clearExecutionTrace
  );

  const isProcessing = processingStates.includes(status);

  const handleEvent = (event, currentQuery) => { 

    switch (event.type) {
      case "task_detected":
        setTask(event.task);
        setStatus("understanding");

        addTraceEvent({
          type: "success",
          label: "TASK DETECTED",
          detail: event.task.replaceAll("_", " "),
        });

        break;

      case "input_validated":
        setStatus("validating");

        addTraceEvent({
          type: "success",
          label: "INPUT VALIDATED",
          detail: "Imagery and query are compatible",
        });

        break;

      case "workflow_selected":
        setStatus("routing");

        addTraceEvent({
          type: "success",
          label: "WORKFLOW SELECTED",
          detail: event.workflow.replaceAll("_", " "),
        });

        break;

      case "agent_started":
        setStatus("analyzing");

        addTraceEvent({
          type: "success",
          label: "AGENT STARTED",
          detail: event.agent,
        });

        break;

      case "processing":
        setStatus("analyzing");

        addTraceEvent({
          type: "processing",
          label: "PROCESSING",
          detail: `Analysis progress ${event.progress}%`,
        });

        break;

      case "agent_completed":
        setStatus("analyzing");

        addTraceEvent({
          type: "success",
          label: "AGENT COMPLETED",
          detail: event.agent,
        });

        break;

      case "evidence_ready":
        setEvidence(event.evidence);

        if (event.evidence?.overlay) {
          setOverlays([event.evidence.overlay]);
        }

        setStatus("evidence");

        addTraceEvent({
          type: "success",
          label: "EVIDENCE READY",
          detail: "Analytical evidence collected",
        });

        break;

      case "result":
        setResult(event.result);
        setConfidence(event.result.confidence);
        addHistoryEntry({
  query: currentQuery,
  task: event.result.task,
  answer: event.result.answer,
  confidence: event.result.confidence,
});

        addTraceEvent({
          type: "success",
          label: "RESULT GENERATED",
          detail: "Explainable analysis result ready",
        });

        break;

      case "complete":
        setStatus("complete");
        break;

      default:
        break;
    }
  };

  const handleAnalyze = async () => {
    const query = input.trim();

    if (!query || isProcessing) {
      return;
    }

    setQuery(query);
    setOverlays([]);
    clearExecutionTrace();
    setStatus("understanding");

    try {
      const analysis = await analyzeQuery(query);

      await runMockAnalysis({
  query,
  analysis,
  onEvent: (event) => handleEvent(event, query),
});
    } catch (error) {
      console.error("Analysis failed:", error);
      setStatus("error");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleAnalyze();
    }
  };

  const getButtonLabel = () => {
    if (status === "understanding") {
      return "UNDERSTANDING...";
    }

    if (status === "validating") {
      return "VALIDATING...";
    }

    if (status === "routing") {
      return "ROUTING...";
    }

    if (status === "analyzing") {
      return "ANALYZING...";
    }

    if (status === "evidence") {
      return "EVIDENCE...";
    }

    return "ANALYZE";
  };

  return (
    <div className="border-t border-white/10 bg-[#0b0b0c] p-4">
      <div className="mx-auto max-w-5xl">
        <div className="mb-2 flex items-center justify-between px-1">
          <p className="text-[9px] tracking-[0.3em] text-white/30">
            ASK SATQUERY
          </p>

          <p className="text-[9px] tracking-[0.15em] text-white/20">
            {input.length}/300
          </p>
        </div>

        <div
          className={`rounded-2xl border bg-white/[0.03] px-4 py-3 transition-colors ${
            isProcessing
              ? "border-amber-400/20"
              : "border-white/10 focus-within:border-white/20"
          }`}
        >
          <div className="flex items-end gap-3">
            <textarea
              value={input}
              onChange={(event) => {
                if (event.target.value.length <= 300) {
                  setInput(event.target.value);
                }
              }}
              onKeyDown={handleKeyDown}
              disabled={isProcessing}
              rows={1}
              placeholder="Ask about your imagery..."
              className="max-h-24 min-h-8 flex-1 resize-none bg-transparent py-1 text-sm leading-6 text-white outline-none placeholder:text-white/25 disabled:cursor-not-allowed disabled:opacity-50"
            />

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!input.trim() || isProcessing}
              className="shrink-0 rounded-xl bg-amber-400 px-5 py-2.5 text-xs font-medium text-black transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
            >
              {getButtonLabel()}
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 border-t border-white/5 pt-3">
            {suggestedQueries.map((suggestion) => (
              <button
                key={suggestion.label}
                type="button"
                disabled={isProcessing}
                onClick={() => setInput(suggestion.query)}
                className="rounded-lg border border-white/8 bg-white/[0.02] px-3 py-1.5 text-[9px] tracking-[0.12em] text-white/35 transition-colors hover:border-white/15 hover:bg-white/[0.04] hover:text-white/70 disabled:cursor-not-allowed disabled:opacity-30"
              >
                {suggestion.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between px-1">
          <p className="text-[9px] text-white/20">
            Press Enter to analyze · Shift + Enter for a new line
          </p>

          {status === "complete" && (
            <p className="text-[9px] tracking-[0.15em] text-emerald-400/60">
              ANALYSIS READY
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default QueryDock;