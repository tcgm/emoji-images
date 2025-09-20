export function drawEmojiToCanvas(
    canvas: HTMLCanvasElement,
    canvasSize: number,
    text: string,
    fontSize: number,
    yOffset: number,
    fontFamily: string,
    fillStyle: string
): boolean {
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const ctx = canvas.getContext("2d");
    if (!ctx) return false;

    ctx.font = `${fontSize}px "${fontFamily}", sans-serif`;
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = fillStyle;

    const metric = ctx.measureText(text);
    const x = (canvasSize - metric.width) / 2;
    const y =
        (canvasSize - metric.actualBoundingBoxAscent) / 2 +
        metric.actualBoundingBoxAscent +
        yOffset;

    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.fillText(text, x, y);

    return ctx.getImageData(canvasSize / 2, canvasSize / 2, 1, 1).data[3] !== 0;
}
