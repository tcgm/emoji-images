// Unified icon library loader and search
import { EmojiItem } from "./types";
import * as solidIcons from "@fortawesome/free-solid-svg-icons";
import * as regularIcons from "@fortawesome/free-regular-svg-icons";
import * as brandsIcons from "@fortawesome/free-brands-svg-icons";
// import * as gameIcons from "react-game-icons";
import * as faIcons from "react-icons/fa";
import * as mdIcons from "react-icons/md";
import * as giIcons from "react-icons/gi";
import * as aiIcons from "react-icons/ai";
import * as ioIcons from "react-icons/io";
import * as tiIcons from "react-icons/ti";
import * as goIcons from "react-icons/go";
import * as fiIcons from "react-icons/fi";
import * as bsIcons from "react-icons/bs";
import * as riIcons from "react-icons/ri";
import * as cgIcons from "react-icons/cg";
import * as biIcons from "react-icons/bi";
import * as siIcons from "react-icons/si";
import * as ionIcons from 'react-icons/io5';
import * as tbIcons from 'react-icons/tb';
import * as wiIcons from 'react-icons/wi';
import * as rxIcons from 'react-icons/rx';
import * as luIcons from 'react-icons/lu';
import * as piIcons from 'react-icons/pi';
import * as hiIcons from 'react-icons/hi';
import * as hi2Icons from 'react-icons/hi2';
import twemoji from 'twemoji';
import emojiData from 'unicode-emoji-json';
// Noto Emoji font: @notofonts/emoji (add to your CSS/font loader)

// Add missing imports for React Icons sublibraries
import * as ciIcons from "react-icons/ci"; // Circum Icons
import * as vscIcons from "react-icons/vsc"; // VS Code Icons
import * as laIcons from "react-icons/lia"; // Line Awesome
import * as themifyIcons from "react-icons/tfi"; // Themify Icons
import * as imIcons from "react-icons/im";
import * as bs2Icons from "react-icons/bs";
import * as bi2Icons from "react-icons/bi";
import * as cg2Icons from "react-icons/cg";
import * as diIcons from "react-icons/di";
import * as fcIcons from "react-icons/fc";
import * as fa6Icons from "react-icons/fa6";
import * as grIcons from "react-icons/gr";
import * as ri2Icons from "react-icons/ri";
import * as slIcons from "react-icons/sl";




import { openmojiSequences } from './openmojiSequences';
import * as iconifyIcons from "@iconify/react"; // Import Iconify icons
import { LIBRARIES } from "../libraries";
// import * as gameIcons from "react-game-icons"; // Import GameIcons

export type IconType = "openmoji" | "fontawesome" | "gameicons" | "react-icons" | "twemoji" | "notoemoji";

export type IconItem = {
    type: IconType;
    name: string;
    keywords: string[];
    source: string;
    // For OpenMoji, Twemoji, NotoEmoji
    char?: string;
    filename?: string;
    svgUrl?: string; // For Twemoji
    // For FontAwesome, GameIcons, React-Icons
    iconComponent?: any;
};

// Helper to extract FontAwesome icons (from react-icons/fa)
const extractFAIcons = (iconSet: any, type: IconType, prefix: string): IconItem[] => {
    return Object.keys(iconSet)
        .filter(key => typeof iconSet[key] === "function")
        .map(key => {
            const icon = iconSet[key];
            return {
                type,
                name: `fa-source-${prefix}-${key}`,
                keywords: [key],
                source: `fontawesome-${prefix}`,
                iconComponent: icon,
            };
        });
};

// Helper to extract GameIcons
// const extractGameIcons = (): IconItem[] => {
//     return Object.keys(gameIcons)
//         .filter(key => typeof (gameIcons as any)[key] === "function")
//         .map(key => {
//             const icon = (gameIcons as any)[key];
//             return {
//                 type: "gameicons",
//                 name: `gi-${key}`,
//                 keywords: [key],
//                 source: "gameicons", // Added source property
//                 iconComponent: icon,
//             };
//         });
// };
// Helper to extract React-Icons from multiple sub-packages
const extractReactIcons = (): IconItem[] => {
    const allIconSets = [
        { set: faIcons, prefix: "react-fa" },
        { set: mdIcons, prefix: "react-md" },
        { set: giIcons, prefix: "react-gi" },
        { set: aiIcons, prefix: "react-ai" },
        { set: ioIcons, prefix: "react-io" },
        { set: tiIcons, prefix: "react-ti" },
        { set: goIcons, prefix: "react-go" },
        { set: fiIcons, prefix: "react-fi" },
        { set: bsIcons, prefix: "react-bs" },
        { set: riIcons, prefix: "react-ri" },
        { set: cgIcons, prefix: "react-cg" },
        { set: biIcons, prefix: "react-bi" },
        { set: siIcons, prefix: "react-si" },
        { set: ionIcons, prefix: "react-ion" },
        { set: tbIcons, prefix: "react-tb" },
        { set: wiIcons, prefix: "react-wi" },
        { set: rxIcons, prefix: "react-rx" },
        { set: luIcons, prefix: "react-lu" },
        { set: piIcons, prefix: "react-pi" },
        { set: hiIcons, prefix: "react-hi" },
        { set: hi2Icons, prefix: "react-hi2" },
        { set: ciIcons, prefix: "react-ci" }, // Circum Icons
        { set: vscIcons, prefix: "react-vsc" }, // VS Code Icons
        { set: laIcons, prefix: "react-lia" }, // Line Awesome
        { set: themifyIcons, prefix: "react-tfi" }, // Themify Icons
        { set: imIcons, prefix: "react-im" },
        { set: bs2Icons, prefix: "react-bs" },
        { set: bi2Icons, prefix: "react-bi" },
        { set: cg2Icons, prefix: "react-cg" },
        { set: diIcons, prefix: "react-di" },
        { set: fcIcons, prefix: "react-fc" },
        { set: fa6Icons, prefix: "react-fa6" },
        { set: grIcons, prefix: "react-gr" },
        { set: ri2Icons, prefix: "react-ri" },
        { set: slIcons, prefix: "react-sl" },
    ];
    const icons: IconItem[] = [];
    allIconSets.forEach(({ set, prefix }) => {
        Object.keys(set)
            .filter(key => typeof (set as any)[key] === "function")
            .forEach(key => {
                const icon = (set as any)[key];
                icons.push({
                    type: "react-icons",
                    name: `${prefix}-${key}`,
                    keywords: [key],
                    source: prefix,
                    iconComponent: icon,
                });
            });
    });
    return icons;
};

const extractIconifyIcons = (): IconItem[] => {
    return Object.keys(iconifyIcons).map(key => {
        const icon = (iconifyIcons as any)[key];
        return {
            type: "react-icons",
            name: `iconify-${key}`,
            keywords: [key],
            source: "iconify",
            iconComponent: icon,
        };
    });
};



function parseEmojiSequences(text: string): string[][] {
    const lines = text.split(/\r?\n/);
    const codepoints: string[][] = [];
    for (const line of lines) {
        if (line.trim().startsWith('#') || !line.trim()) continue;
        // Format: code_point(s) ; ...
        const match = line.match(/^([0-9A-Fa-f ]+)\s*;/);
        if (match) {
            const cps = match[1].trim().split(/\s+/);
            codepoints.push(cps);
        } else if (line.includes('..')) {
            // Range, e.g. 231A..231B
            const rangeMatch = line.match(/^([0-9A-Fa-f]+)\.\.([0-9A-Fa-f]+)\s*;/);
            if (rangeMatch) {
                const start = parseInt(rangeMatch[1], 16);
                const end = parseInt(rangeMatch[2], 16);
                for (let cp = start; cp <= end; cp++) {
                    codepoints.push([cp.toString(16).toUpperCase()]);
                }
            }
        }
    }
    return codepoints;
}

function parseSupplement(text: string): string[][] {
    const lines = text.split(/\r?\n/);
    const codepoints: string[][] = [];
    for (const line of lines) {
        if (!line.trim() || line.trim().startsWith('#')) continue;
        // Format: codepoints ; ...
        const match = line.match(/^([0-9a-fA-F ]+)\s*;/);
        if (match) {
            const cps = match[1].trim().split(/\s+/);
            codepoints.push(cps);
        }
    }
    return codepoints;
}

const sequenceToEmoji = (seq: string[]): string => seq.map(cp => String.fromCodePoint(parseInt(cp, 16))).join("");

const getEmojiMeta = (emoji: string) => {
    return emojiData[emoji] || null;
};

function isFlagEmoji(emoji: string): boolean {
    // Flags are two regional indicator symbols (U+1F1E6 to U+1F1FF)
    return emoji.length === 2 &&
        emoji.codePointAt(0)! >= 0x1F1E6 && emoji.codePointAt(0)! <= 0x1F1FF &&
        emoji.codePointAt(1)! >= 0x1F1E6 && emoji.codePointAt(1)! <= 0x1F1FF;
}

function flagCodepoints(emoji: string): string {
    // Return codepoints for Twemoji SVG URL
    return Array.from(emoji).map(c => c.codePointAt(0)?.toString(16).toLowerCase()).join('-');
}

const loadTwemoji = (): IconItem[] => {
    return Object.keys(emojiData).map(emoji => {
        const meta = emojiData[emoji];
        let svgUrl = '';
        if (isFlagEmoji(emoji)) {
            svgUrl = `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${flagCodepoints(emoji)}.svg`;
        } else {
            const codepoints = twemoji.convert.toCodePoint(emoji);
            svgUrl = `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${codepoints}.svg`;
        }
        return {
            type: "twemoji",
            name: meta.name,
            keywords: meta.keywords,
            source: "twemoji",
            char: emoji,
            svgUrl,
        };
    });
};

const loadOpenMoji = (): IconItem[] => {
    return openmojiSequences.map(seq => {
        const char = sequenceToEmoji(seq);
        const meta = getEmojiMeta(char);
        // For flags, ensure char is two regional indicators
        let displayChar = char;
        if (isFlagEmoji(char)) {
            displayChar = char;
        }
        return {
            type: "openmoji",
            name: meta?.name || seq.join("-"),
            keywords: meta?.keywords || [seq.join("-")],
            source: "openmoji",
            char: displayChar,
        };
    });
};

const loadNotoEmoji = (): IconItem[] => {
    return Object.keys(emojiData).map(emoji => {
        const meta = emojiData[emoji];
        let displayChar = emoji;
        if (isFlagEmoji(emoji)) {
            displayChar = emoji;
        }
        return {
            type: "notoemoji",
            name: meta.name,
            keywords: meta.keywords,
            source: "notoemoji",
            char: displayChar,
        };
    });
};

export const loadAllIcons = (): IconItem[] => {
    const openmoji = loadOpenMoji();
    const twemojis = loadTwemoji();
    const notoemojis = loadNotoEmoji();
    const fontawesome = extractFAIcons(faIcons, "fontawesome", "fa");
    const reacticons = extractReactIcons();
    const iconify = extractIconifyIcons();
    // const gameicons = extractGameIcons(); // Include GameIcons

    return [
        ...openmoji,
        ...twemojis,
        ...notoemojis,
        ...fontawesome,
        ...reacticons,
        ...iconify,
        // ...gameicons, // Add GameIcons to the list
    ];
};

export const searchIcons = (query: string, icons: IconItem[]): IconItem[] => {
    const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    return icons.filter(icon => {
        return tokens.every(token => {
            if (token.startsWith('#')) {
                const tag = token.slice(1);
                return icon.source && icon.source.toLowerCase().includes(tag);
            } else if (token.includes('..')) {
                // Handle range queries like 1F600..1F64F
                const [start, end] = token.split('..').map(cp => parseInt(cp, 16));
                const iconCode = icon.char?.codePointAt(0);
                return iconCode && iconCode >= start && iconCode <= end;
            }
            return (
                icon.name?.toLowerCase().includes(token) ||
                (Array.isArray(icon.keywords) && icon.keywords.some(k => k.toLowerCase().includes(token))) ||
                (icon.char && icon.char.toLowerCase().includes(token))
            );
        });
    });
};
