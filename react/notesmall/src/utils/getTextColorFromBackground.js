import hexToRgb from "./hexToRgb";
export default function getTextColorFromBackground(bgColor) {
    let rgbColor = hexToRgb(bgColor);
    let gray =
        0.2126 * rgbColor.r + 0.7152 * rgbColor.g + 0.0722 * rgbColor.b;

    let threshold = 128;
    return gray < threshold ? "#ffffff" : "#000000";
}