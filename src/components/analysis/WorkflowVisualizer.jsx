import useAnalysisStore from "../../store/analysisStore";

const stages = [
  {
    key: "input_ready",
    label: "INPUT",
    detail: "Query received",
  },
  {
    key: "understanding",
    label: "UNDERSTAND",
    detail: "Intent identified",
  },
  {
    key: "validating",
    label: "VALIDATE",
    detail: "Input checked",
  },
  {
    key: "routing",
    label: "ROUTE",
    detail: "Workflow selected",
  },
  {
    key: "analyzing",
    label: "ANALYZE",
    detail: "Running analysis",
  },
  {
    key: "evidence",
    label: "EVIDENCE",
    detail: "Evidence collected",
  },
  {
    key: "complete",
    label: "RESULT",
    detail: "Answer generated",
  },
];

const stageOrder = [
  "idle",
  "input_ready",
  "understanding",
  "validating",
  "routing",
  "analyzing",
  "evidence",
  "complete",
];

function WorkflowVisualizer() {
  const status = useAnalysisStore((state) => state.status);

  const currentIndex = stageOrder.indexOf(status);

  const getStageState = (stageKey) => {
    const stageIndex = stageOrder.indexOf(stageKey);

    if (status === "error") {
      return stageIndex <= currentIndex ? "error" : "pending";
    }

    if (stageIndex < currentIndex) {
      return "complete";
    }

    if (stageIndex === currentIndex) {
      return "active";
    }

    return "pending";
  };

  return (
    <div className="pointer-events-none absolute bottom-5 left-1/2 z-30 w-[min(760px,calc(100%-32px))] -translate-x-1/2">
      <div className="rounded-2xl border border-white/10 bg-[#0b0b0c]/85 px-5 py-4 shadow-2xl backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[8px] tracking-[0.3em] text-white/30">
              SATQUERY ANALYSIS PIPELINE
            </p>

            <p className="mt-1 text-[10px] text-white/50">
              Query → Evidence → Explain
            </p>
          </div>

          <span className="text-[8px] tracking-[0.2em] text-white/25">
            {status === "complete" ? "COMPLETE" : "LIVE"}
          </span>
        </div>

        <div className="flex items-start">
          {stages.map((stage, index) => {
            const state = getStageState(stage.key);

            return (
              <div
                key={stage.key}
                className="flex min-w-0 flex-1 items-start"
              >
                <div className="flex min-w-0 flex-col items-center">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full border text-[8px] transition-all duration-500 ${
                      state === "active"
                        ? "border-amber-300/70 bg-amber-300/10 text-amber-200 shadow-[0_0_20px_rgba(251,191,36,0.18)]"
                        : state === "complete"
                          ? "border-cyan-300/40 bg-cyan-300/[0.06] text-cyan-200"
                          : state === "error"
                            ? "border-red-300/50 bg-red-300/[0.06] text-red-200"
                            : "border-white/10 bg-white/[0.02] text-white/20"
                    }`}
                  >
                    {state === "complete" ? "✓" : index + 1}
                  </div>

                  <p
                    className={`mt-2 truncate text-[8px] tracking-[0.14em] transition-colors duration-500 ${
                      state === "active"
                        ? "text-amber-200"
                        : state === "complete"
                          ? "text-cyan-200/70"
                          : state === "error"
                            ? "text-red-200"
                            : "text-white/25"
                    }`}
                  >
                    {stage.label}
                  </p>

                  <p className="mt-1 hidden text-[7px] text-white/20 sm:block">
                    {stage.detail}
                  </p>
                </div>

                {index < stages.length - 1 && (
                  <div className="mx-2 mt-3.5 h-px flex-1 bg-white/10">
                    <div
                      className={`h-full origin-left transition-all duration-700 ${
                        getStageState(stages[index + 1].key) !== "pending"
                          ? "scale-x-100 bg-cyan-300/40"
                          : "scale-x-0 bg-transparent"
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default WorkflowVisualizer;