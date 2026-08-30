function App() {
  return (
    <div className="min-h-screen bg-[#0b0b0c] text-white">
      <header className="flex h-16 items-center justify-between border-b border-white/10 px-6">
        <div>
          <h1 className="text-lg font-semibold tracking-[0.2em]">
            SATQUERY
          </h1>
          <p className="text-[10px] tracking-[0.25em] text-white/40">
            REMOTE-SENSING INTELLIGENCE
          </p>
        </div>

        <div className="flex items-center gap-6 text-sm text-white/50">
          <button className="transition-colors hover:text-white">
            History
          </button>

          <button className="transition-colors hover:text-white">
            Settings
          </button>
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <p className="mb-3 text-xs tracking-[0.35em] text-amber-400/70">
            REMOTE-SENSING INTELLIGENCE
          </p>

          <h2 className="text-5xl font-semibold tracking-tight">
            Ask anything about
            <br />
            your satellite imagery.
          </h2>

          <button className="mt-8 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm transition-all hover:border-amber-400/40 hover:bg-white/10">
            Upload imagery
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;