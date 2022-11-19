import React, { Component } from 'react';
import DisplayTest from "../../images/broken_tv.png";

const __SHADOW_WIDTH_PX = 8;

class ImageCanvas extends Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.colorConverter = props.colorConverter ? props.colorConverter : null;

        this.desired = {}; // desired canvas size

        // set up cache
        this.reconvert = true;
        this.convertedCache = null;

        // set up default image
        this.img = new Image();
        this.img.onload = this.onImageLoaded;
        this.img.src = DisplayTest;

        this.sendInitial = props.sendInitial;
        this.updatePixelPos = props.updatePixelPos;

        this.fixedColor = false;

        this.lastPos = { x: -1, y: -1 }

        this.state = {
            convert: true,
            modification: null
        };
    }

    // incapsulation 
    getLastPos = () => {
        return this.lastPos;
    }

    convert = (shouldConvert) => {
        this.setState({convert: shouldConvert});
        this.fillCanvas();
    }

    // files processing
    setFile = (path) => {
        this.img.src = URL.createObjectURL(path);
    }

    getOriginalImage = (ext, callback) => {
        let buffer = new Image();
        buffer.crossOrigin = 'Anonymous';
        buffer.onload = function(){
            let buffCanvas = document.createElement("canvas");
            var context = buffCanvas.getContext("2d");
            buffCanvas.height = this.naturalHeight;
            buffCanvas.width = this.naturalWidth;
            context.drawImage(this, 0, 0);
            var dataURL = buffCanvas.toDataURL("image/" + ext);
            callback(dataURL);
        };
        buffer.src = this.img.src;
    }

    getProcessedImage = (ext, callback) => {
        let buffPostProcess = this.postProcess;

        let buffer = new Image();
        buffer.crossOrigin = 'Anonymous';
        buffer.onload = function(){
            let buffCanvas = document.createElement("canvas");
            let buffContext = buffCanvas.getContext("2d");
            buffCanvas.height = this.naturalHeight;
            buffCanvas.width = this.naturalWidth;
            buffContext.drawImage(this, 0, 0);
            buffPostProcess(buffCanvas, buffContext);
            var dataURL = buffCanvas.toDataURL("image/" + ext);
            callback(dataURL);
        };
        buffer.src = this.img.src;
        this.fillCanvas();
    }

    // color manipulation
    setModification = (modification) => {
        console.log("reset");
        this.setState({modification: modification});
        this.fillCanvas();
    }

    // draw
    showLast = () => {
        this.showAxes(this.lastPos.x, this.lastPos.y, this.fixedColor);
    }
    showAxes = (x, y, fixed) => {
        this.fixedColor = fixed;
        const canvas = this.canvasRef.current;
        const context = canvas.getContext('2d');
        this.reconvert = false;
        this.onImageLoaded();
        this.reconvert = true;
        if (x !== -1 && y !== -1)
            this.drawPixel(canvas, context, x, y);
    }

    drawPixel = (canvas, context, x, y) => {
        const size = 30;
        context.strokeStyle = "#078678";
        context.lineWidth = 3;
        context.setLineDash([10, 15]);
        context.moveTo(0, y);
        context.lineTo(x - size / 2, y);
        context.moveTo(canvas.width, y);
        context.lineTo(x + size / 2, y);
        context.moveTo(x, 0);
        context.lineTo(x, y - size / 2);
        context.moveTo(x, canvas.height);
        context.lineTo(x, y + size / 2);
        context.stroke();

        const imageData = context.getImageData(x - size/2, y - size/2, size, size);
        const rgb = context.getImageData(x, y, 1, 1).data;
        for(let i = 0; i < imageData.data.length; i += 4) {
            imageData.data[i] = rgb[0];
            imageData.data[i + 1] = rgb[1];
            imageData.data[i + 2] = rgb[2];
            imageData.data[i + 3] = rgb[3];
        }
        context.putImageData(imageData, x - size/2, y - size/2);
        context.setLineDash([]);
        context.strokeRect(x - size / 2, y - size / 2, size, size);
    }

    postProcess = (canvas, context) => {
        // change color mode
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let rgb, mid;
        for (let i = 0; i < pixels.length; i += 4) {
            rgb = { r: pixels[i] / 255, g: pixels[i + 1] / 255, b: pixels[i + 2] / 255 };
            mid = this.colorConverter.convert(rgb);
            if (this.state.modification) this.state.modification(mid);
            rgb = this.colorConverter.convertBack(mid);
            rgb.r *= 255; rgb.g *= 255; rgb.b *= 255;
            pixels[i] = rgb.r;
            pixels[i + 1] = rgb.g;
            pixels[i + 2] = rgb.b;
        }
        context.putImageData(imageData, 0, 0);
        this.convertedCache = imageData;
    }

    onImageLoaded = () => {
        const canvas = this.canvasRef.current;
        const context = canvas.getContext('2d');

        // adjust canvas size
        let distW, distH, fraction;
        fraction = this.img.width / this.desired.width;
        distW = this.desired.width;
        distH = this.img.height / fraction;
        if (distH > this.desired.height) {
            fraction = distH / this.desired.height;
            distH = this.desired.height;
            distW = distW / fraction;
        }
        canvas.width = distW;
        canvas.height = distH;
        
        // draw original image
        context.drawImage(this.img, 0, 0, this.img.width, this.img.height, 0, 0, distW, distH);

        // update colors
        if(this.img && this.colorConverter && this.state.convert) {
            if (this.reconvert || !this.convertedCache) {
                this.postProcess(canvas, context);
            } else {
                context.putImageData(this.convertedCache, 0, 0);
            }
        }

        this.render();
    }

    fillCanvas() {
        const buffer = this.img.src;
        this.img.src = "";
        this.img.src = buffer;
    }

    // component related
    componentDidMount() {
        const handleResize = e => {
            const parentElement = document.querySelector(".demo-img-container");
            this.desired.width = parentElement.clientWidth - __SHADOW_WIDTH_PX;
            this.desired.height = parentElement.clientHeight - __SHADOW_WIDTH_PX;
            this.fillCanvas();
        };
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }

    render() {
        const handleMouseMove = 
            (e) => {
                if (this.fixedColor) return;

                const canvas = this.canvasRef.current;
                const context = canvas.getContext('2d');

                const rect = this.canvasRef.current.getBoundingClientRect();
                const pX = e.clientX - rect.left;
                const pY = e.clientY - rect.top;
                this.lastPos = {x: pX, y: pY};
                const rgb = context.getImageData(pX, pY, 1, 1).data;
                
                if (this.updatePixelPos) this.updatePixelPos(pX, pY, false);
                if (this.sendInitial) this.sendInitial( {r: rgb[0], g: rgb[1], b: rgb[2]} );
            };

        const handleDoubleClick = 
            (e) => {
                //this.fixedColor = !this.fixedColor;
            }

        const handleSingleClick = 
            (e) => {
                //this.fixedColor = false;
            }

        const handleMouseOut = 
            (e) => {
                if(!this.fixedColor) {
                    this.lastPos = {x: -1, y: -1};
                    this.updatePixelPos(-1, -1, false);
                }
            }

        return (
            <canvas 
                ref={this.canvasRef}
                className={"img-canvas p-0" + 
                    (this.props.className ? " " + this.props.className : "")
                }
                onMouseMove={handleMouseMove}
                onDoubleClick={handleDoubleClick}
                onClick={handleSingleClick}
                onMouseOut={handleMouseOut}
            />
        );
    }
}

export default ImageCanvas;