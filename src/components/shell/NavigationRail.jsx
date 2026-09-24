function NavigationRail({
  activeSection,
  onWorkspaceClick,
  onImageryClick,
  onAnalysisClick,
  onSettingsClick,
}) {
  const getButtonClass = (section) =>
    `transition-all duration-200 ${
      activeSection === section
        ? "text-white"
        : "text-white/30 hover:text-white"
    }`;

  return (
    <aside className="flex w-16 flex-col items-center border-r border-white/10 bg-[#0b0b0c] py-6">
      <button
        type="button"
        onClick={onWorkspaceClick}
        aria-label="Workspace"
        className={`mb-8 text-lg transition-all duration-200 ${
          activeSection === "workspace"
            ? "text-amber-400"
            : "text-white/30 hover:text-amber-400"
        }`}
      >
        ◉
      </button>

      <nav className="flex flex-col items-center gap-6 text-sm">
        <button
          type="button"
          onClick={onWorkspaceClick}
          aria-label="Workspace"
          className={getButtonClass("workspace")}
        >
          ◈
        </button>

        <button
          type="button"
          onClick={onImageryClick}
          aria-label="Imagery"
          className={getButtonClass("imagery")}
        >
          ◇
        </button>

        <button
          type="button"
          onClick={onAnalysisClick}
          aria-label="Analysis"
          className={getButtonClass("analysis")}
        >
          ⌁
        </button>
      </nav>

      <div className="mt-auto">
        <button
          type="button"
          onClick={onSettingsClick}
          aria-label="Settings"
          className="text-sm text-white/30 transition-colors hover:text-white"
        >
          ⚙
        </button>
      </div>
    </aside>
  );
}

export default NavigationRail;