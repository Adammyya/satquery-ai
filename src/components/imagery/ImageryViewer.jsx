function ImageryViewer() {
  return (
    <div className="absolute inset-6 z-0 overflow-hidden rounded-2xl border border-white/10 bg-black">
      <img
        src="/imagery/earthdata.jpeg"
        alt="NASA Earth observation satellite imagery"
        className="h-full w-full object-cover"
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(11,11,12,0.5),transparent_30%)]" />

      <div className="pointer-events-none absolute left-5 top-5 rounded-lg border border-white/10 bg-black/50 px-3 py-2 backdrop-blur-md">
        <p className="text-[9px] tracking-[0.25em] text-white/40">
          EARTH OBSERVATION
        </p>

        <p className="mt-1 text-xs text-white/70">
          NASA DEMO IMAGERY
        </p>
      </div>
    </div>
  );
}

export default ImageryViewer;