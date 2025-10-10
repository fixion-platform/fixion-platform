// src/pages/admindashboard/usermgt/artisans/ArtisanContext.js
import { createContext, useContext } from "react";

const ArtisanCtx = createContext(null);

function useArtisanContext() {
  const ctx = useContext(ArtisanCtx);
  if (!ctx) {
    throw new Error("useArtisanContext must be used within <ArtisanCtx.Provider>");
  }
  return ctx;
}

export { ArtisanCtx, useArtisanContext };
export default ArtisanCtx; // extra safety: default export too
