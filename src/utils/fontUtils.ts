export const getFontForSource = (source: string): string => {
    switch (source) {
        case "twemoji":
            return "Twemoji, Segoe UI Emoji, Apple Color Emoji, Times New Roman, Arial, sans-serif";
        case "notoemoji":
            // Ensure Noto Emoji is prioritized explicitly
            return "Noto Emoji, NotoColorEmoji, Segoe UI Emoji, Apple Color Emoji, Times New Roman, Arial, sans-serif";
        case "openmoji":
            return "OpenMojiBlack, Segoe UI Emoji, Apple Color Emoji, Times New Roman, Arial, sans-serif";
        default:
            return "Segoe UI Emoji, Apple Color Emoji, Times New Roman, Arial, sans-serif";
    }
};