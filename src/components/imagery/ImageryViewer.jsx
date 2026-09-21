import { useRef, useState } from "react";
import useImageryStore from "../../store/imageryStore";

function ImageryViewer() {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const resetView = () => {
  setZoom(1);
  setPan({ x: 0, y: 0 });
};
const fileInputRef = useRef(null);

const handleUpload = (event) => {
  const file = event.target.files?.[0];

  if (!file) {
    return;
  }

  if (!file.type.startsWith("image/")) {
    return;
  }

  const assetUrl = URL.createObjectURL(file);

  setImage({
    id: `upload-${Date.now()}`,
    source: "LOCAL UPLOAD",
    filename: file.name,
    assetUrl,
    acquisitionDate: null,
    modality: "unknown",
  });

  setZoom(1);
  setPan({ x: 0, y: 0 });

  event.target.value = "";
};

  const image = useImageryStore((state) => state.image);
const setImage = useImageryStore((state) => state.setImage);

  const handleMouseDown = (event) => {
    if (zoom === 1) {
      return;
    }

    setDragging(true);

    setDragStart({
      x: event.clientX - pan.x,
      y: event.clientY - pan.y,
    });
  };

  const handleMouseMove = (event) => {
    if (!dragging) {
      return;
    }

    setPan({
      x: event.clientX - dragStart.x,
      y: event.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  if (!image) {
    return (
      <div className="absolute inset-6 z-0 flex items-center justify-center rounded-2xl border border-white/10 bg-black">
        <p className="text-xs tracking-[0.2em] text-white/30">
          NO IMAGERY LOADED
        </p>
      </div>
    );
  }

  return (
    <div
      className={`absolute inset-6 z-0 overflow-hidden rounded-2xl border border-white/10 bg-black ${
        zoom > 1
          ? dragging
            ? "cursor-grabbing"
            : "cursor-grab"
          : ""
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <img
        src={image.assetUrl}
        alt={`${image.source} satellite imagery`}
        className="pointer-events-none h-full w-full select-none object-cover transition-transform duration-200"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        }}
        draggable={false}
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(11,11,12,0.5),transparent_30%)]" />
      <input
  ref={fileInputRef}
  type="file"
  accept=".jpg,.jpeg,.png,.webp"
  onChange={handleUpload}
  className="hidden"
/>

<button
  type="button"
  onClick={() => fileInputRef.current?.click()}
  className="absolute right-5 top-5 z-10 rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-[9px] tracking-[0.2em] text-white/60 backdrop-blur-md transition-colors hover:border-amber-400/30 hover:text-white"
>
  UPLOAD IMAGERY
</button>

      <div className="pointer-events-none absolute left-5 top-5 rounded-lg border border-white/10 bg-black/50 px-3 py-2 backdrop-blur-md">
        <p className="text-[9px] tracking-[0.25em] text-white/40">
          EARTH OBSERVATION
        </p>

        <p className="mt-1 text-xs text-white/70">
          {image.source}
        </p>
      </div>

      <div
        className="absolute bottom-5 right-5 z-10 flex overflow-hidden rounded-lg border border-white/10 bg-black/60 backdrop-blur-md"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={() =>
            setZoom((current) => Math.min(current + 0.25, 3))
          }
          className="px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          +
        </button>

        <div className="w-px bg-white/10" />

        <button
          type="button"
          onClick={() =>
            setZoom((current) => Math.max(current - 0.25, 1))
          }
          className="px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          −
        </button>
        <div className="w-px bg-white/10" />

<button
  type="button"
  onClick={resetView}
  className="px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/10 hover:text-white"
  title="Reset view"
>
  ↺
</button>
      </div>
    </div>
  );
}

export default ImageryViewer;