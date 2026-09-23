import useAnalysisStore from "../../store/analysisStore";

const statusMessages = {
  idle: {
    label: "SATQUERY CORE",
    message: "Awaiting query",
  },

  input_ready: {
    label: "INPUT READY",
    message: "Query ready for analysis",
  },

  understanding: {
    label: "UNDERSTANDING",
    message: "Understanding query",
  },

  validating: {
    label: "VALIDATING",
    message: "Validating input",
  },

  routing: {
    label: "ROUTING",
    message: "Selecting analysis workflow",
  },

  analyzing: {
    label: "ANALYZING",
    message: "Running analysis",
  },

  evidence: {
    label: "EVIDENCE",
    message: "Collecting evidence",
  },

  complete: {
    label: "ANALYSIS COMPLETE",
    message: "Analysis ready",
  },

  error: {
    label: "ANALYSIS INTERRUPTED",
    message: "Analysis failed — try again",
  },
};

function SatQueryCore() {
  const status = useAnalysisStore((state) => state.status);

  const currentStatus = statusMessages[status] ?? statusMessages.idle;
  const isError = status === "error";
  const isComplete = status === "complete";

  return (
    <div className="relative z-10 flex flex-col items-center justify-center">
      <div
        className={`flex h-24 w-24 items-center justify-center rounded-full border bg-white/[0.03] transition-all duration-500 ${
          isError
            ? "border-red-400/40 shadow-[0_0_60px_rgba(248,113,113,0.12)]"
            : isComplete
              ? "border-emerald-400/30 shadow-[0_0_60px_rgba(52,211,153,0.08)]"
              : "border-amber-400/30 shadow-[0_0_60px_rgba(251,191,36,0.08)]"
        }`}
      >
        <div
          className={`h-10 w-10 rounded-full border bg-white/[0.04] transition-all duration-500 ${
            isError
              ? "border-red-300/30"
              : isComplete
                ? "border-emerald-300/20"
                : "border-white/20"
          }`}
        />
      </div>

      <p
        className={`mt-5 text-[9px] tracking-[0.35em] ${
          isError
            ? "text-red-300/70"
            : isComplete
              ? "text-emerald-300/60"
              : "text-white/30"
        }`}
      >
        {currentStatus.label}
      </p>

      <p
        className={`mt-2 text-xs ${
          isError ? "text-red-200/60" : "text-white/40"
        }`}
      >
        {currentStatus.message}
      </p>
    </div>
  );
}

export default SatQueryCore;