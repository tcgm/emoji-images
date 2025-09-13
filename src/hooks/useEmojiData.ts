import { useEffect, useMemo, useState } from "react";
import type { EmojiMeta, EmojiItem } from "../utils/types";

async function fetchText(path: string): Promise<string> {
    const r = await fetch(path);
    if (!r.ok) throw new Error(`Failed to fetch ${path}`);
    return r.text();
}

async function loadMeta(): Promise<EmojiMeta> {
    const result: EmojiMeta = {
        emojis: [],
        sequencesDate: "",
        sequencesVersion: "",
        sequencesCount: 0,
        supplementCount: 0,
    };

    const seq = await fetchText("/emoji-sequences.txt");
    seq
        .split("\n")
        .filter((line) => {
            const dp = "# Date: ";
            if (line.startsWith(dp)) result.sequencesDate = line.slice(dp.length).split(", ")[0]!;
            const vp = "# Version: ";
            if (line.startsWith(vp)) result.sequencesVersion = line.slice(vp.length);
            return !line.startsWith("#");
        })
        .filter((l) => l.trim() !== "")
        .forEach((line) => {
            const points = line.split(";")[0]!.trim();
            if (points.includes("..")) {
                const [left, right] = points.split("..");
                const L = parseInt(left!, 16), R = parseInt(right!, 16);
                for (let i = L; i <= R; i++) {
                    result.sequencesCount++;
                    result.emojis.push([i]);
                }
            } else if (points.includes(" ")) {
                result.sequencesCount++;
                result.emojis.push(points.split(" ").map((s) => parseInt(s, 16)));
            } else {
                result.sequencesCount++;
                result.emojis.push([parseInt(points, 16)]);
            }
        });

    if (!result.sequencesDate || !result.sequencesVersion) {
        throw new Error("Could not parse date/version");
    }

    const sup = await fetchText("/supplement.txt");
    sup.split("\n").filter(Boolean).forEach((line) => {
        result.supplementCount++;
        result.emojis.push(line.split(";")[0]!.trim().split(" ").map((s) => parseInt(s, 16)));
    });

    return result;
}

export function useEmojiData() {
    const [meta, setMeta] = useState<EmojiMeta | null>(null);
    const [items, setItems] = useState<EmojiItem[]>([]);
    const totalCount = useMemo(
        () => (meta ? meta.sequencesCount + meta.supplementCount : 0),
        [meta]
    );

    useEffect(() => {
        (async () => {
            try {
                const m = await loadMeta();
                setMeta(m);
                setItems(
                    m.emojis.map((points) => {
                        const filename = points.map((n) => n.toString(16)).join("-") + ".png";
                        const char = String.fromCodePoint(...points);
                        return { points, filename, char };
                    })
                );
            } catch {
                alert("Could not load emoji-sequences.txt");
            }
        })();
    }, []);

    return { meta, items, setItems, totalCount };
}
