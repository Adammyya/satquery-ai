import { useState } from "react";
import useAnalysisStore from "../../store/analysisStore";
import { analyzeQuery } from "../../services/api/queryApi";
import { runMockAnalysis } from "../../services/websocket/analysisSocket";

function QueryDock() {
  const [input, setInput] = useState("");

  const setQuery = useAnalysisStore((state) => state.setQuery);
  const setStatus = useAnalysisStore((state) => state.setStatus);
  const setTask = useAnalysisStore((state) => state.setTask);
  const setResult = useAnalysisStore((state) => state.setResult);
  const setConfidence = useAnalysisStore((state) => state.setConfidence);

  const handleEvent = (event) => {
    switch (event.type) {
      case "task_detected":
        setTask(event.task);
        setStatus("understanding");
        break;

      case "input_validated":
        setStatus("validating");
        break;

      case "workflow_selected":
        setStatus("routing");
        break;

      case "agent_started":
        setStatus("analyzing");
        break;

      case "processing":
        setStatus("analyzing");
        break;

      case "agent_completed":
        setStatus("analyzing");
        break;

      case "evidence_ready":
        setStatus("evidence");
        break;

      case "result":
        setResult(event.result);
        setConfidence(event.result.confidence);
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

    if (!query) {
      return;
    }

    setQuery(query);
    setStatus("understanding");

    try {
      const analysis = await analyzeQuery(query);

      await runMockAnalysis({
        query,
        analysis,
        onEvent: handleEvent,
      });
    } catch (error) {
      console.error("Analysis failed:", error);
      setStatus("error");
    }
  };

  return (
    <div className="border-t border-white/10 bg-[#0b0b0c] p-4">
      <div className="mx-auto flex max-w-4xl items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleAnalyze();
            }
          }}
          placeholder="Ask SatQuery about your imagery..."
          className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/25"
        />

        <button
          onClick={handleAnalyze}
          disabled={!input.trim()}
          className="rounded-xl bg-amber-400 px-5 py-2 text-xs font-medium text-black transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
        >
          ANALYZE
        </button>
      </div>
    </div>
  );
}

export default QueryDock;