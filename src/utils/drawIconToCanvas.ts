import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Canvg } from "canvg";

export async function drawIconToCanvas(
    canvas: HTMLCanvasElement,
    iconComponent: React.ElementType,
    canvasSize: number,
    color: string
): Promise<void> {
    try {
        // Render the icon as SVG markup (not nested)
        let svgMarkup = renderToStaticMarkup(
            React.createElement(iconComponent, {
                width: canvasSize,
                height: canvasSize,
                color,
                fontSize: canvasSize,
                style: {
                    width: canvasSize,
                    height: canvasSize,
                    color,
                    fontSize: canvasSize,
                    display: 'block',
                },
            })
        );
        // If markup does not start with <svg, wrap it
        if (!svgMarkup.trim().startsWith('<svg')) {
            svgMarkup = `<svg xmlns='http://www.w3.org/2000/svg' width='${canvasSize}' height='${canvasSize}'>${svgMarkup}</svg>`;
        }
        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.clearRect(0, 0, canvasSize, canvasSize);
            const v = await Canvg.fromString(ctx, svgMarkup);
            await v.render();
        }
    } catch (e) {
        // fallback: do nothing
    }
}
