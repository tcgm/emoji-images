import JSZip from "jszip";

export async function zipBlobs(named: Array<{ name: string; blob: Blob }>) {
    const zip = new JSZip();
    const root = zip.folder("emojis")!;
    named.forEach(({ name, blob }) => root.file(name, blob));
    return zip.generateAsync({ type: "blob" });
}
