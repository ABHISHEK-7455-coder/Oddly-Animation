import { DemoMixer } from "../mixer/DemoMixer";
import { resetWorld } from "../matter/resetWorld";

export default function DemoRenderer(ctx, demos) {
  let index = 0;
  let cleanup = null;

  function playNext() {
    if (cleanup) cleanup();
    resetWorld(ctx);

    const demo = demos[index];
    cleanup = DemoMixer(ctx, demo);

    index = (index + 1) % demos.length;
  }

  return { playNext };
}
