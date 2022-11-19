import React, { Component } from 'react';

class DemoCanvas extends Component {

    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();

        this.state = {
            cellCost: 20,
            draw: props.draw
        };
        
        this.gridStroke = 0.1;
        this.axesStroke = 2;
        
        this.zoomBounds = [0.1, 1000];

        this.detailsLimits = {
            1: 1000,
            3: 100,
            24: 10
        }

        this.background = {enabled: false, r: 37, g: 37, b: 37, a: 1};

        this.dragging = false;
    }

    // incapsulation
    getCellCost() {
        return this.state.cellCost;
    }

    getZero() {
        return { 
            x: (this.state.cellCost * (0 - this.xLim.from)), 
            y: (this.state.cellCost * this.yLim.to)
        };
    }

    setBG(bg) {
        this.background.enabled = bg.enabled;
        this.background.r = bg.r;
        this.background.g = bg.g;
        this.background.b = bg.b;
        this.background.a = bg.a;
    }

    setCenter(x, y, cellCost) {
        this.center = {x: x, y: y};
        //TODO: this.setState({cellCost: cellCost});
    }

    setDraw(draw) {
        this.setState({draw: draw});
    }

    shiftCenter(dx, dy) {
        this.center.x += dx / this.state.cellCost;
        this.center.y += dy / this.state.cellCost;
    }

    showUnits(axes, grid, lables) {
        this.axes = axes;
        this.grid = grid;
        this.lables = lables;
    }


    // draw
    drawAxes(context) {
        const w = context.canvas.width;
        const h = context.canvas.height;
        const xAxes = h / 2 + this.center.y * this.state.cellCost;
        const yAxes = w / 2 - this.center.x * this.state.cellCost;

        context.beginPath();

        // draw x Axes with arrow
        if (xAxes => 0 && xAxes <= h) {
            context.moveTo(0, xAxes);
            context.lineTo(w, xAxes);
            context.moveTo(w - 10, xAxes + 3);
            context.lineTo(w, xAxes);
            context.moveTo(w - 10, xAxes - 3);
            context.lineTo(w, xAxes);
        }

        // draw y Axes with arrow
        if (yAxes => 0 && yAxes <= w) {
            context.moveTo(yAxes, 0);
            context.lineTo(yAxes, h);
            context.moveTo(yAxes + 3, 10);
            context.lineTo(yAxes, 0);
            context.moveTo(yAxes - 3, 10);
            context.lineTo(yAxes, 0);
        }

        context.lineWidth = this.axesStroke;
        context.strokeStyle = "#A9A9A9";
        context.stroke();
    }

    drawGrid(context) {
        const w = context.canvas.width;
        const h = context.canvas.height;

        const xVal = Math.ceil(this.xLim.from),
              yVal = Math.floor(this.yLim.to);
        let xBegin = xVal,
            yBegin = yVal,
            delta = 1;
        for (let limit in this.detailsLimits) {
            if (this.state.cellCost < limit) {
                delta = this.detailsLimits[limit];
                xBegin = xVal - delta - (xVal%delta);
                yBegin = yVal + delta - (yVal%delta);
                break;
            }
        }

        const xFirst = (xBegin - this.xLim.from) * this.state.cellCost, 
            yFirst = (this.yLim.to - yBegin) * this.state.cellCost;

        context.beginPath();

        // draw vertical lines
        for(let x = xFirst; x < w; x += this.state.cellCost * delta) {
            context.moveTo(x, 0);
            context.lineTo(x, h);
        }

        // draw horizontal lines
        for(let y = yFirst; y < h; y += this.state.cellCost * delta) {
            context.moveTo(0, y);
            context.lineTo(w, y);
        }
        
        context.lineWidth = this.gridStroke;
        context.strokeStyle = "#A9A9A9";
        context.stroke();
    }

    drawLables(context) {
        const fontSize = 14;
        const w = context.canvas.width;
        const h = context.canvas.height;
        const xAxes = h / 2 + this.center.y * this.state.cellCost;
        const yAxes = w / 2 - this.center.x * this.state.cellCost;

        const xVal = Math.ceil(this.xLim.from),
            yVal = Math.floor(this.yLim.to);
        let xBegin = xVal,
            yBegin = yVal,
            delta = 1;
        for (let limit in this.detailsLimits) {
            if (this.state.cellCost < limit) {
                delta = this.detailsLimits[limit];
                xBegin = xVal - delta - (xVal%delta);
                yBegin = yVal + delta - (yVal%delta);
                break;
            }
        }

        const   xFirst = (xBegin - this.xLim.from) * this.state.cellCost, 
                yFirst = (this.yLim.to - yBegin) * this.state.cellCost;

        context.fillStyle = "#A9A9A9";
        context.font = fontSize + "px serif";
        context.textAlign = "right";

        // draw vertical numbers
        for(let x = xFirst-3; x < w; x += this.state.cellCost * delta) {
            context.fillText(xBegin, x, xAxes + fontSize);
            xBegin += delta;
        }

        // draw horizontal numbers
        for(let y = yFirst; y < h; y += this.state.cellCost * delta) {
            context.fillText(yBegin, yAxes - 3, y + fontSize);
            yBegin -= delta;
        }

        context.fillText("x", w - 3, xAxes - 10);

        context.textAlign = "left";
        context.fillText("y", yAxes + 10, 0 + fontSize);
    }

    fillCanvas() {
        const canvas = this.canvasRef.current;
        const context = canvas.getContext('2d');

        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        if(this.background.enabled && this.background.a) {
            context.fillStyle = "rgba(" + 
                this.background.r + ", " + 
                this.background.g + ", " + 
                this.background.b + ", " + 
                this.background.a;
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        }

        this.calculateLimits();
        if (this.axes) this.drawAxes(context);
        if (this.grid) this.drawGrid(context);
        if (this.lables) this.drawLables(context);

        const zero = this.getZero();

        this.state.draw(context, this.state.cellCost, zero);
    }

    // internal methods
    calculateLimits() {
        const canvas = this.canvasRef.current;
        const context = canvas.getContext('2d');

        const w = context.canvas.width;
        const h = context.canvas.height;

        const xLen = w / (this.state.cellCost * 2);
        const yLen = h / (this.state.cellCost * 2);

        this.yLim = {from: this.center.y - yLen, to: this.center.y + yLen};
        this.xLim = {from: this.center.x - xLen, to: this.center.x + xLen};
    }

    // component related
    componentDidMount() {
        const canvas = this.canvasRef.current;
        const context = canvas.getContext('2d');

        this.showUnits(true, true, true);
        this.setCenter(0, 0, 20);

        const handleResize = e => {
            const parentElement = document.querySelector(".demo-container");
            context.canvas.width = parentElement.clientWidth;
            context.canvas.height = parentElement.clientHeight;
            this.fillCanvas();
        };
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }

    render = () => {
        const handleWheel = 
            (e) => {
                if (e.deltaY > 0 && this.state.cellCost >= this.zoomBounds[0]) {
                    this.setState({cellCost: this.state.cellCost * 0.9});
                } else if (e.deltaY < 0 && this.state.cellCost <= this.zoomBounds[1]) {
                    this.setState({cellCost: this.state.cellCost * 1.1});
                }
                this.fillCanvas();
            };

        const handleMouseDown = 
            (e) => {
                this.dragging = true;
                this.prevMouse = {x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY};
            };

        const handleMouseMove = 
            (e) => {
                if (this.dragging) {
                    this.shiftCenter(this.prevMouse.x - e.nativeEvent.offsetX,
                        e.nativeEvent.offsetY - this.prevMouse.y);
                    this.fillCanvas();
                    this.prevMouse = {x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY};
                }
            };

        const handleMouseUp = 
            (e) => {
                this.dragging = false;
                this.prevMove = undefined;
            };
        
        // fix sudden change of canvas (use non-state variable for scale change)
        return (
            <canvas className="demo h-100 w-100 p-0" 
                ref={this.canvasRef} 
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            />
        );
    }
}

export default DemoCanvas;