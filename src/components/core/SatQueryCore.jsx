function SatQueryCore() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full border border-amber-400/30 bg-white/[0.03] shadow-[0_0_60px_rgba(251,191,36,0.08)]">
        <div className="h-10 w-10 rounded-full border border-white/20 bg-white/[0.04]" />
      </div>

      <p className="mt-5 text-[9px] tracking-[0.35em] text-white/30">
        SATQUERY CORE
      </p>

      <p className="mt-2 text-xs text-white/40">
        Awaiting imagery
      </p>
    </div>
  );
}

export default SatQueryCore;