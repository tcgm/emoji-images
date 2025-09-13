import { useCallback } from "react";

export function useEnsureFont() {
    return useCallback(async (family: string, px: number) => {
        const fonts = (document as Document).fonts as any;
        if (fonts?.load) {
            try {
                await fonts.load(`${px}px "${family}"`);
                await fonts.ready;
            } catch { /* ignore */ }
        }
    }, []);
}
