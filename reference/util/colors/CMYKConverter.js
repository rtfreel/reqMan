class CMYKConverter {
    convert = (rgb) => {    
        // color lightness
        let cmyk = { 
            c: 1 - rgb.r,
            m: 1 - rgb.g,
            y: 1 - rgb.b,
            k: 0
        };
        cmyk.k = Math.min(cmyk.c, cmyk.m, cmyk.y);

        if (cmyk.k === 1) return { c: 0, m: 0, y: 0, k: 1 };

        cmyk.c = (cmyk.c - cmyk.k) / (1 - cmyk.k);
        cmyk.m = (cmyk.m - cmyk.k) / (1 - cmyk.k);
        cmyk.y = (cmyk.y - cmyk.k) / (1 - cmyk.k);

        return cmyk;
    }

    convertBack = (cmyk) => {
        return { 
            r: (1 - cmyk.c) * (1 - cmyk.k), 
            g: (1 - cmyk.m) * (1 - cmyk.k), 
            b: (1 - cmyk.y) * (1 - cmyk.k) 
        };
    }

    updateColor = (rgb) => {
        return this.convertBack(this.convert(rgb));
    }
}

export default CMYKConverter;