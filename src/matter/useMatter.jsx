// src/matter/useMatter.js

import { useContext } from "react";
import { MatterContext } from "./MatterProvider";

export function useMatter() {
  const ctx = useContext(MatterContext);

  if (!ctx) {
    throw new Error("useMatter must be used inside MatterProvider");
  }

  return ctx;
}
