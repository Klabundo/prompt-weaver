import { useState, useCallback } from "react";

interface UseUndoRedoReturn<T> {
    state: T;
    setState: (newState: T | ((prev: T) => T)) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    reset: (initialState: T) => void;
}

export function useUndoRedo<T>(initialState: T | (() => T), maxHistory = 50): UseUndoRedoReturn<T> {
    const [state, _setState] = useState<T>(initialState);
    const [past, setPast] = useState<T[]>([]);
    const [future, setFuture] = useState<T[]>([]);

    const setState = useCallback(
        (newStateOrFn: T | ((prev: T) => T)) => {
            _setState((currentState) => {
                const newState = typeof newStateOrFn === 'function'
                    ? (newStateOrFn as (prev: T) => T)(currentState)
                    : newStateOrFn;

                // Only update history if state actually changed
                if (JSON.stringify(currentState) === JSON.stringify(newState)) {
                    return currentState;
                }

                setPast((prev) => {
                    const newPast = [...prev, currentState];
                    if (newPast.length > maxHistory) {
                        return newPast.slice(newPast.length - maxHistory);
                    }
                    return newPast;
                });
                setFuture([]); // Clear future on new action
                return newState;
            });
        },
        [maxHistory]
    );

    // Helper to reset state without history (e.g. initial load)
    const reset = useCallback((newState: T) => {
        _setState(newState);
        setPast([]);
        setFuture([]);
    }, []);

    const undo = useCallback(() => {
        setPast((prevPast) => {
            if (prevPast.length === 0) return prevPast;

            const previous = prevPast[prevPast.length - 1];
            const newPast = prevPast.slice(0, prevPast.length - 1);

            setFuture((prevFuture) => [state, ...prevFuture]);
            _setState(previous);

            return newPast;
        });
    }, [state]);

    const redo = useCallback(() => {
        setFuture((prevFuture) => {
            if (prevFuture.length === 0) return prevFuture;

            const next = prevFuture[0];
            const newFuture = prevFuture.slice(1);

            setPast((prevPast) => [...prevPast, state]);
            _setState(next);

            return newFuture;
        });
    }, [state]);

    return {
        state,
        setState,
        undo,
        redo,
        canUndo: past.length > 0,
        canRedo: future.length > 0,
        reset,
    };
}
