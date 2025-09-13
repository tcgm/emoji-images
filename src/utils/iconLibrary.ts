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

export type IconType = "openmoji" | "fontawesome" | "gameicons" | "react-icons";

export type IconItem = {
    type: IconType;
    name: string;
    keywords: string[];
    // For OpenMoji
    char?: string;
    filename?: string;
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
                    iconComponent: icon,
                });
            });
    });
    return icons;
};

import { openmojiFilenames } from "./openmojiFilenames";

const loadOpenMoji = (): IconItem[] => {
    return openmojiFilenames.map(filename => {
        const base = filename.replace(/\.png$/, "");
        let char = "";
        try {
            char = base.split("-").map(cp => String.fromCodePoint(parseInt(cp, 16))).join("");
        } catch (e) {
            char = "";
        }
        return {
            type: "openmoji",
            name: base,
            keywords: [base],
            char,
            filename,
        };
    });
};

export const loadAllIcons = (): IconItem[] => {
    const openmoji = loadOpenMoji();
    // Only use react-icons/fa for FontAwesome
    const fontawesome = extractFAIcons(faIcons, "fontawesome", "fa");
    // const gameicons = extractGameIcons();
    const reacticons = extractReactIcons();
    return [...openmoji, ...fontawesome, /* ...gameicons, */ ...reacticons];
};

export const searchIcons = (query: string, icons: IconItem[]): IconItem[] => {
    const q = query.toLowerCase();
    return icons.filter(icon =>
        icon.name.toLowerCase().includes(q) ||
        icon.keywords.some(k => k.toLowerCase().includes(q))
    );
};
