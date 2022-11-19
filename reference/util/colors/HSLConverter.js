class HSLConverter {
    convert = (rgb) => {
        let max = Math.max(rgb.r, rgb.g, rgb.b);
        let min = Math.min(rgb.r, rgb.g, rgb.b);
        
        // color lightness
        let hsl = { 
            h: 0,
            s: 0,
            l: (max + min) / 2
        };

        // color hue
        switch (max) {
            case min:
                hsl.h = 0;
                break;
            case rgb.r:
                if (rgb.g >= rgb.b) {
                    hsl.h = 60 * (rgb.g - rgb.b) / (max - min);
                } else {
                    hsl.h = 60 * (rgb.g - rgb.b) / (max - min) + 360;
                }
                break;
            case rgb.g:
                hsl.h = 60 * (rgb.b - rgb.r) / (max - min) + 120;
                break;
            default:
                hsl.h = 60 * (rgb.r - rgb.g) / (max - min) + 240;
                break;
        }

        // color saturation
        if (max !== min)
            hsl.s = (max - min) / (1 - Math.abs(max + min - 1));

        return hsl;
    }

    convertBack = (hsl) => {
        let rgb = { r: 0, g: 0, b: 0 };

        // calculate helper constants
        const c = (1 - Math.abs(2 * hsl.l - 1)) * hsl.s;
        const h = hsl.h / 60;
        const x = c * (1 - Math.abs(h % 2 - 1));
        const m = hsl.l - c / 2;

        // arrange constants
        if (h < 1)
            rgb = { r: c, g: x, b: 0 };
        else if (h < 2)
            rgb = { r: x, g: c, b: 0 };
        else if (h < 3)
            rgb = { r: 0, g: c, b: x };
        else if (h < 4)
            rgb = { r: 0, g: x, b: c };
        else if (h < 5)
            rgb = { r: x, g: 0, b: c };
        else 
            rgb = { r: c, g: 0, b: x };
        rgb.r += m; rgb.g += m; rgb.b += m;
        
        return rgb;
    }

    updateColor = (rgb) => {
        return this.convertBack(this.convert(rgb));
    }
}

export default HSLConverter;