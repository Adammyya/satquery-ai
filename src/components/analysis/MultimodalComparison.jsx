import useAnalysisStore from "../../store/analysisStore";
import useImageryStore from "../../store/imageryStore";

function MultimodalComparison() {
  const status = useAnalysisStore((state) => state.status);
  const task = useAnalysisStore((state) => state.task);
  const image = useImageryStore((state) => state.image);

  if (
    (task !== "optical_sar_analysis" && task !== "multimodal_analysis") ||
    status !== "complete"
  ) {
    return null;
  }

  return (
    <div className="absolute left-1/2 top-4 z-20 w-[280px] -translate-x-1/2 rounded-xl border border-white/10 bg-[#0b0b0c]/90 p-3 shadow-2xl backdrop-blur-xl">
      <p className="mb-2 text-[8px] tracking-[0.2em] text-white/40 font-mono">
        MULTIMODAL CONTEXT
      </p>
      
      <div className="flex flex-col gap-1.5 border-l-2 border-cyan-400/50 pl-2">
        <div className="flex items-center justify-between text-[9px] font-mono">
          <span className="text-white/80">OPTICAL SENSOR</span>
          <span className="text-cyan-300">● LOADED</span>
        </div>
        <div className="flex items-center justify-between text-[9px] font-mono">
          <span className="text-white/40">SAR SENSOR</span>
          <span className="text-white/40">○ REQUIRED</span>
        </div>
      </div>

      <p className="mt-2 text-[7.5px] leading-relaxed text-white/40 font-mono">
        Full multimodal analysis requires SAR input. Evaluated optical reflectivity without fabricating synthetic radar backscatter.
      </p>
    </div>
  );
}

export default MultimodalComparison;