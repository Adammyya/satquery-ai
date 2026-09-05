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
    label: "ANALYSIS ERROR",
    message: "Something went wrong",
  },
};

function SatQueryCore() {
  const status = useAnalysisStore((state) => state.status);

  const currentStatus = statusMessages[status] ?? statusMessages.idle;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full border border-amber-400/30 bg-white/[0.03] shadow-[0_0_60px_rgba(251,191,36,0.08)]">
        <div className="h-10 w-10 rounded-full border border-white/20 bg-white/[0.04]" />
      </div>

      <p className="mt-5 text-[9px] tracking-[0.35em] text-white/30">
        {currentStatus.label}
      </p>

      <p className="mt-2 text-xs text-white/40">
        {currentStatus.message}
      </p>
    </div>
  );
}

export default SatQueryCore;