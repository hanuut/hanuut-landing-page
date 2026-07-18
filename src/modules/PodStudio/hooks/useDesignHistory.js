import { useState, useCallback } from "react";

/**
 * Custom State History Hook (Undo / Redo)
 * Tracks custom design variables (x, y, scale, rotation) inside the editor.
 */
export const useDesignHistory = (initialPresent) => {
  const [state, setState] = useState({
    past: [],
    present: initialPresent,
    future: []
  });

  const updateState = useCallback((newPresent) => {
    setState((prev) => {
      const p = prev.present;
      const n = typeof newPresent === "function" ? newPresent(p) : newPresent;
      
      // S2: SYSTEM 2 SAFETY GUARD - Only check layout coords if the uploaded asset itself is identical
      if (p.previewUrl === n.previewUrl && p.file === n.file) {
        // If the design image is identical and layout positions haven't moved, skip to prevent spam
        if (p.x === n.x && p.y === n.y && p.scale === n.scale && p.rotation === n.rotation) {
          return prev;
        }
      }

      return {
        past: [...prev.past.slice(-20), p], // Keep only the last 20 steps to avoid memory leaks
        present: n,
        future: [] // Clear future redos on new actions
      };
    });
  }, []);

  const undo = useCallback(() => {
    setState((prev) => {
      if (prev.past.length === 0) return prev;
      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, prev.past.length - 1);
      
      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future]
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((prev) => {
      if (prev.future.length === 0) return prev;
      const next = prev.future[0];
      const newFuture = prev.future.slice(1);
      
      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture
      };
    });
  }, []);

  const resetHistory = useCallback((newPresent) => {
    setState({
      past: [],
      present: newPresent,
      future: []
    });
  }, []);

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  return [state.present, updateState, undo, redo, canUndo, canRedo, resetHistory];
};