import useAnalysisStore from "../../store/analysisStore";

function TemporalComparison() {
  const status = useAnalysisStore((state) => state.status);
  const task = useAnalysisStore((state) => state.task);

  if (
    task !== "multitemporal_change_analysis" ||
    status !== "complete"
  ) {
    return null;
  }

  return (
    <div className="absolute left-1/2 top-5 z-20 w-[440px] -translate-x-1/2 rounded-2xl border border-white/10 bg-[#0b0b0c]/95 p-3 shadow-2xl backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between px-1">
        <div>
          <p className="text-[8px] tracking-[0.3em] text-white/30">
            TEMPORAL ANALYSIS
          </p>

          <p className="mt-1 text-[10px] text-white/55">
            Demo observation comparison
          </p>
        </div>

        <div className="rounded-full border border-cyan-300/20 px-2 py-1">
          <span className="text-[8px] tracking-[0.15em] text-cyan-200/70">
            CHANGE DETECTED
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* Observation A */}
        <div className="overflow-hidden rounded-xl border border-white/10 bg-black">
          <div className="relative aspect-video overflow-hidden">
            <img
              src="/imagery/earthdata.jpeg"
              alt="Demo observation A"
              className="h-full w-full object-cover"
            />

            <div className="absolute bottom-2 left-2 rounded-md border border-white/10 bg-black/75 px-2 py-1 backdrop-blur-md">
              <p className="text-[8px] tracking-[0.15em] text-white/60">
                OBSERVATION A
              </p>

              <p className="mt-0.5 text-[7px] text-white/30">
                BASELINE
              </p>
            </div>
          </div>
        </div>

        {/* Observation B */}
        <div className="overflow-hidden rounded-xl border border-cyan-300/10 bg-black">
          <div className="relative aspect-video overflow-hidden">
            <img
              src="/imagery/earthdata.jpeg"
              alt="Demo observation B"
              className="h-full w-full object-cover brightness-[0.9] contrast-[1.08]"
            />

            {/* Simulated temporal change */}
            <div
              className="absolute left-[52%] top-[38%] h-[32%] w-[24%] border border-cyan-300/70 bg-cyan-300/[0.12]"
              style={{
                boxShadow: "0 0 18px rgba(103, 232, 249, 0.15)",
              }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_45%,rgba(103,232,249,0.18)_45%,rgba(103,232,249,0.18)_55%,transparent_55%)]" />
            </div>

            <div className="absolute bottom-2 left-2 rounded-md border border-cyan-300/20 bg-black/75 px-2 py-1 backdrop-blur-md">
              <p className="text-[8px] tracking-[0.15em] text-cyan-200/70">
                OBSERVATION B
              </p>

              <p className="mt-0.5 text-[7px] text-cyan-200/40">
                DEMO CHANGE
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2">
        <span className="h-px w-8 bg-white/10" />

        <span className="text-[8px] tracking-[0.2em] text-white/25">
          TEMPORAL COMPARISON
        </span>

        <span className="h-px w-8 bg-white/10" />
      </div>

      <p className="mt-2 text-center text-[8px] leading-4 text-white/25">
        Demonstration pair · simulated change region
      </p>
    </div>
  );
}

export default TemporalComparison;