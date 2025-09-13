export type EmojiMeta = {
    emojis: number[][];
    sequencesDate: string;
    sequencesVersion: string;
    sequencesCount: number;
    supplementCount: number;
};

export type EmojiItem = {
    points: number[];
    char: string;
    filename: string; // "1f468-200d-1f467.png"
};
