import { parseColorHexRGB } from "https://unpkg.com/@microsoft/fast-colors";
import { createColorPalette } from "https://unpkg.com/@microsoft/fast-components";

(function () {
    const teamsPrimaryColor = "#6264a7";
    const palette = createColorPalette(parseColorHexRGB(teamsPrimaryColor));
    const provider = document.querySelector("fluent-design-system-provider");

    provider.accentPalette = palette;
})();