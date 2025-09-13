import html2canvas from "html2canvas";
import React from "react";
import { createRoot } from "react-dom/client";

export async function drawIconToCanvas(
    canvas: HTMLCanvasElement,
    iconComponent: React.ElementType,
    canvasSize: number,
    color: string
): Promise<void> {
    // Create a hidden container
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "-9999px";
    container.style.width = `${canvasSize}px`;
    container.style.height = `${canvasSize}px`;
    document.body.appendChild(container);

    // Render the icon into the container
    const root = createRoot(container);
    root.render(
        React.createElement(iconComponent, {
            style: {
                width: canvasSize,
                height: canvasSize,
                color,
                fontSize: canvasSize,
                display: "block"
            }
        })
    );

    // Wait for render
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Use html2canvas to capture
    const image = await html2canvas(container, {
        backgroundColor: null,
        width: canvasSize,
        height: canvasSize,
        scale: 1,
    });
    const ctx = canvas.getContext("2d");
    if (ctx) {
        ctx.clearRect(0, 0, canvasSize, canvasSize);
        ctx.drawImage(image, 0, 0, canvasSize, canvasSize);
    }

    // Clean up
    root.unmount();
    document.body.removeChild(container);
}
