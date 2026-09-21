import useAnalysisStore from "../../store/analysisStore";

function MultimodalComparison() {
  const status = useAnalysisStore((state) => state.status);
  const task = useAnalysisStore((state) => state.task);

  if (task !== "optical_sar_analysis" || status !== "complete") {
    return null;
  }

  return (
    <div className="absolute left-1/2 top-5 z-20 w-[440px] -translate-x-1/2 rounded-2xl border border-white/10 bg-[#0b0b0c]/95 p-3 shadow-2xl backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between px-1">
        <div>
          <p className="text-[8px] tracking-[0.3em] text-white/30">
            MULTIMODAL ANALYSIS
          </p>

          <p className="mt-1 text-[10px] text-white/55">
            Complementary sensor observations
          </p>
        </div>

        <div className="rounded-full border border-cyan-300/20 px-2 py-1">
          <span className="text-[8px] tracking-[0.15em] text-cyan-200/70">
            OPTICAL + SAR
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* Optical */}
        <div className="overflow-hidden rounded-xl border border-white/10 bg-black">
          <div className="relative aspect-video overflow-hidden">
            <img
              src="/imagery/earthdata.jpeg"
              alt="Optical satellite observation"
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-[rgba(255,255,255,0.03)]" />

            <div className="absolute bottom-2 left-2 rounded-md border border-white/10 bg-black/75 px-2 py-1 backdrop-blur-md">
              <p className="text-[8px] tracking-[0.15em] text-white/70">
                OPTICAL
              </p>

              <p className="mt-0.5 text-[7px] text-white/35">
                SURFACE / SPECTRAL
              </p>
            </div>
          </div>
        </div>

        {/* SAR */}
        <div className="overflow-hidden rounded-xl border border-cyan-300/10 bg-black">
          <div className="relative aspect-video overflow-hidden">
            <img
              src="/imagery/earthdata.jpeg"
              alt="SAR satellite observation"
              className="h-full w-full object-cover grayscale contrast-[1.35] brightness-[0.8]"
            />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(103,232,249,0.08),transparent_60%)]" />

            <div className="absolute bottom-2 left-2 rounded-md border border-cyan-300/20 bg-black/75 px-2 py-1 backdrop-blur-md">
              <p className="text-[8px] tracking-[0.15em] text-cyan-200/80">
                SAR
              </p>

              <p className="mt-0.5 text-[7px] text-cyan-200/40">
                RADAR / STRUCTURE
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.02] p-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[8px] tracking-[0.2em] text-white/30">
              OPTICAL
            </p>

            <p className="mt-1 text-[9px] leading-4 text-white/45">
              Surface appearance and spectral information.
            </p>
          </div>

          <div>
            <p className="text-[8px] tracking-[0.2em] text-cyan-200/40">
              SAR
            </p>

            <p className="mt-1 text-[9px] leading-4 text-white/45">
              Radar-based structural and surface response.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2">
        <span className="h-px w-8 bg-white/10" />

        <span className="text-[8px] tracking-[0.2em] text-white/25">
          COMPLEMENTARY EVIDENCE
        </span>

        <span className="h-px w-8 bg-white/10" />
      </div>

      <p className="mt-2 text-center text-[8px] leading-4 text-white/25">
        Demonstration sensor pair · simulated SAR rendering
      </p>
    </div>
  );
}

export default MultimodalComparison;