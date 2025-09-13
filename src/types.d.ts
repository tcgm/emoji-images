declare interface Document {
    fonts: FontFaceSet & { load: (font: string) => Promise<FontFace[]> };
}
