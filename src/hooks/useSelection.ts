import { useRef, useState } from "react";

export function useSelection() {
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const lastIndexRef = useRef<number | null>(null);

    const toggle = (key: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(key) ? next.delete(key) : next.add(key);
            return next;
        });
    };

    const rangeAdd = (from: number, to: number, keys: string[]) => {
        const [a, b] = from <= to ? [from, to] : [to, from];
        setSelected((prev) => {
            const next = new Set(prev);
            for (let i = a; i <= b; i++) next.add(keys[i]!);
            return next;
        });
    };

    const rememberIndex = (i: number) => { lastIndexRef.current = i; };
    const lastIndex = () => lastIndexRef.current;

    const clear = () => setSelected(new Set());
    const selectAll = (keys: string[]) => setSelected(new Set(keys));

    return { selected, toggle, rangeAdd, rememberIndex, lastIndex, clear, selectAll, setSelected };
}
