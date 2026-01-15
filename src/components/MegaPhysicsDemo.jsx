

import { useEffect, useRef } from "react";
import { MatterProvider } from "../matter/MatterProvider";
import { useMatter } from "../matter/useMatter";
import  DemoRenderer  from "../renderer/DemoRenderer";
import { demos } from "../demos/demoList";

function DemoController({ rendererRef }) {
  const ctx = useMatter();

  useEffect(() => {
    rendererRef.current = DemoRenderer(ctx, demos);
    rendererRef.current.playNext(); // start first demo
  }, []);

  return null;
}

export default function MegaPhysicsDemo() {
  const rendererRef = useRef(null);

  return (
    <MatterProvider>
      <DemoController rendererRef={rendererRef} />

      {/* ✅ NEXT BUTTON GOES HERE */}
      <button
        style={{ position: "absolute", top: 20, right: 20, zIndex: 10, color:"black" }}
        onClick={() => rendererRef.current.playNext()}
      >
        Next Demo
      </button>
    </MatterProvider>
  );
}
