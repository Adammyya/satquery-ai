function NavigationRail() {
  return (
    <aside className="flex w-16 flex-col items-center border-r border-white/10 bg-[#0b0b0c] py-6">
      <button className="mb-8 text-lg text-amber-400">
        ◉
      </button>

      <nav className="flex flex-col items-center gap-6 text-sm text-white/30">
        <button className="transition-colors hover:text-white">
          ◈
        </button>

        <button className="transition-colors hover:text-white">
          ◇
        </button>

        <button className="transition-colors hover:text-white">
          ⌁
        </button>
      </nav>

      <div className="mt-auto">
        <button className="text-sm text-white/30 hover:text-white">
          ⚙
        </button>
      </div>
    </aside>
  );
}

export default NavigationRail;