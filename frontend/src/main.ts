// src/main.ts (controller)
import Konva from "konva"; // ← you need this
import { gameState } from "./model/gameState";
import { isCorrectSelection } from "./map/selection";
import { createMapView } from "./view/mapView";
import { MOCK_LOCATIONS } from "./data/mocklocations";

const app = document.getElementById("app")!;
const view = createMapView(app);

// Background so it’s never blank
view.layer.add(
  new Konva.Rect({
    x: 0,
    y: 0,
    width: 1024,
    height: 640,
    fill: "#e6e6e6",
    listening: false,
  })
);

// ---- draw the dots (markers) ----
function drawMarkers() {
  // clear existing markers if we redraw
  view.layer.find(".marker-dot").forEach((n) => n.destroy());

  for (const loc of MOCK_LOCATIONS) {
    const dot = new Konva.Circle({
      name: "marker-dot",
      x: loc.coord.x,
      y: loc.coord.y,
      radius: 8, // bigger so you can see it
      fill: "#00c853", // bright green
      stroke: "#003300",
      strokeWidth: 2,
      listening: true, // optional; lets you attach per-dot handlers later
    });
    view.layer.add(dot);
    dot.moveToTop(); // make sure it’s above the background
  }
  view.layer.draw(); // force immediate paint
}
drawMarkers();

// Input → decision → feedback
view.stage.on("click", () => {
  const pos = view.stage.getPointerPosition();
  if (!pos) return;

  const ok = isCorrectSelection(pos, gameState.current(), view.getTransform());
  view.pulse(pos, ok ? "good" : "bad");
  if (ok) gameState.advance();
});
