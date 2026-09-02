import { createRoot } from "react-dom/client";
import App from "./App";
import { reloadForStaleChunk } from "./lib/staleChunk";
import "./index.css";

// Vite fires this event when a lazy-loaded page chunk fails to fetch, which
// after a deploy means this tab is running the previous build and the file
// it wants no longer exists. Reloading swaps the tab onto the new build;
// preventDefault stops Vite from also throwing the error into the app.
window.addEventListener("vite:preloadError", (event) => {
  if (reloadForStaleChunk()) event.preventDefault();
});

createRoot(document.getElementById("root")!).render(<App />);
