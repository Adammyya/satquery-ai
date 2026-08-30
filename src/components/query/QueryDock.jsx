function QueryDock() {
  return (
    <div className="border-t border-white/10 bg-[#0b0b0c] p-4">
      <div className="mx-auto flex max-w-4xl items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
        <input
          type="text"
          placeholder="Ask SatQuery about your imagery..."
          className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/25"
        />

        <button className="rounded-xl bg-amber-400 px-5 py-2 text-xs font-medium text-black transition-transform hover:scale-[1.02]">
          ANALYZE
        </button>
      </div>
    </div>
  );
}

export default QueryDock;