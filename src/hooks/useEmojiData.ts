import { useEffect, useMemo, useState } from "react";
import type { EmojiMeta, EmojiItem } from "../utils/types";
import { openmojiSequences } from "../utils/openmojiSequences";

async function loadMeta(): Promise<EmojiMeta> {
    const result: EmojiMeta = {
        emojis: [],
        sequencesDate: "2025-09-19", // Current date
        sequencesVersion: "15.1", // Updated to the most recent Unicode Emoji version
        sequencesCount: openmojiSequences.length,
        supplementCount: 0,
    };

    result.emojis = openmojiSequences.map((seq) => seq.map((s) => parseInt(s, 16)));

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
