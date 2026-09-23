import useAnalysisStore from "../../store/analysisStore";
import { downloadAnalysisReport } from "../../services/reports/reportService";

function ReportButton() {
  const query = useAnalysisStore((state) => state.query);
  const task = useAnalysisStore((state) => state.task);
  const result = useAnalysisStore((state) => state.result);
  const confidence = useAnalysisStore((state) => state.confidence);
  const evidence = useAnalysisStore((state) => state.evidence);

  const handleDownload = () => {
    downloadAnalysisReport({
      query,
      task,
      result,
      confidence,
      evidence,
    });
  };

  if (!result) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="mt-2 w-full rounded-xl border border-white/10 px-4 py-2 text-[10px] tracking-[0.15em] text-white/50 transition-colors hover:border-amber-400/30 hover:text-white"
    >
      DOWNLOAD REPORT
    </button>
  );
}

export default ReportButton;