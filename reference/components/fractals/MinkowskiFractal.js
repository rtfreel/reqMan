import React, { Component } from 'react';
import NavigationPanel from "../template_form/NavigationPanel";
import PageHeader from "../template_form/PageHeader";
import DemoCanvas from "../controls/DemoCanvas";
import EditableSlider from "../controls/EditableSlider";
import ColorPicker from "../controls/ColorPicker";
import LabeledCheckbox from "../controls/LabeledCheckbox";
import StyleSelect from "../controls/StyleSelect";

const DIR_UP = 0;
const DIR_RIGHT = 1;
const DIR_DOWN = 2;
const DIR_LEFT = 3;

class Node {
    constructor(x, y, dir) {
        this.x = x;
        this.y = y;
        this.dir = dir;
    }
}

class MinkowskiFractal extends Component {
    constructor(props) {
        super(props);
        this.demoRef = React.createRef();
        this.size = 10;
        this.iterations = 0;
        this.center = {x: 0, y: 0};
        this.state = {x: 0, y: 6};
        this.axes = true;
        this.grid = true;
        this.lables = true;
        this.fill = {enabled: true, r: 118, g: 197, b: 10, a: 1};
        this.outline = {enabled: true, r: 0, g: 74, b: 67, a: 1, weight: 1};
        this.background = {enabled: false, r: 37, g: 37, b: 37, a: 1};
    }

    draw = (context, cellCost, zero) => {
        let size = this.size * cellCost;
        let l = zero.x - size/2 + this.center.x * cellCost;
        let r = zero.x + size/2 + this.center.x * cellCost;
        let u = zero.y - size/2 - this.center.y * cellCost;
        let b = zero.y + size/2 - this.center.y * cellCost;
        let cur = [ new Node(l, u, DIR_RIGHT), 
                    new Node(r, u, DIR_DOWN),
                    new Node(r, b, DIR_LEFT),
                    new Node(l, b, DIR_UP) ];
        let next;
        for (let i = 0; i < this.iterations; i++) {
            size /= 4;
            next = [];
            for(let node of cur) {
                next.push(node);
                switch(node.dir) {
                case DIR_RIGHT:
                    next.push(new Node(node.x + size    , node.y           , DIR_DOWN ));
                    next.push(new Node(node.x + size    , node.y + size    , DIR_RIGHT));
                    next.push(new Node(node.x + 2 * size, node.y + size    , DIR_UP   ));
                    next.push(new Node(node.x + 2 * size, node.y           , DIR_UP   ));
                    next.push(new Node(node.x + 2 * size, node.y - size    , DIR_RIGHT));
                    next.push(new Node(node.x + 3 * size, node.y - size    , DIR_DOWN ));
                    next.push(new Node(node.x + 3 * size, node.y           , DIR_RIGHT));
                    break;
                case DIR_DOWN:
                    next.push(new Node(node.x           , node.y + size    , DIR_LEFT ));
                    next.push(new Node(node.x - size    , node.y + size    , DIR_DOWN ));
                    next.push(new Node(node.x - size    , node.y + 2 * size, DIR_RIGHT));
                    next.push(new Node(node.x           , node.y + 2 * size, DIR_RIGHT));
                    next.push(new Node(node.x + size    , node.y + 2 * size, DIR_DOWN ));
                    next.push(new Node(node.x + size    , node.y + 3 * size, DIR_LEFT ));
                    next.push(new Node(node.x           , node.y + 3 * size, DIR_DOWN ));
                    break;
                case DIR_LEFT:
                    next.push(new Node(node.x - size    , node.y           , DIR_UP   ));
                    next.push(new Node(node.x - size    , node.y - size    , DIR_LEFT ));
                    next.push(new Node(node.x - 2 * size, node.y - size    , DIR_DOWN ));
                    next.push(new Node(node.x - 2 * size, node.y           , DIR_DOWN ));
                    next.push(new Node(node.x - 2 * size, node.y + size    , DIR_LEFT ));
                    next.push(new Node(node.x - 3 * size, node.y + size    , DIR_UP   ));
                    next.push(new Node(node.x - 3 * size, node.y           , DIR_LEFT ));
                    break;
                default:
                    next.push(new Node(node.x           , node.y - size    , DIR_RIGHT));
                    next.push(new Node(node.x + size    , node.y - size    , DIR_UP   ));
                    next.push(new Node(node.x + size    , node.y - 2 * size, DIR_LEFT ));
                    next.push(new Node(node.x           , node.y - 2 * size, DIR_LEFT ));
                    next.push(new Node(node.x - size    , node.y - 2 * size, DIR_UP   ));
                    next.push(new Node(node.x - size    , node.y - 3 * size, DIR_RIGHT));
                    next.push(new Node(node.x           , node.y - 3 * size, DIR_UP   ));
                    break;
                }
            }
            cur = [...next];
        }

        context.beginPath();
        context.moveTo(cur[0].x, cur[0].y);
        for(let node of cur)
            context.lineTo(node.x, node.y);
        context.lineTo(cur[0].x, cur[0].y);

        if(this.fill.enabled && this.fill.a) {
            context.fillStyle = "rgba(" + 
                this.fill.r + ", " + 
                this.fill.g + ", " + 
                this.fill.b + ", " + 
                this.fill.a;
            context.fill();
        }

        if(this.outline.enabled && this.outline.a) {
            context.lineWidth = this.outline.weight;
            context.strokeStyle = "rgba(" + 
                this.outline.r + ", " + 
                this.outline.g + ", " + 
                this.outline.b + ", " + 
                this.outline.a;
            context.stroke();
        }
    }

    sizeChange = (value) => {
        this.size = value;
        this.demoRef.current.fillCanvas();
    }

    detailsChange = (value) => {
        this.iterations = value;
        this.demoRef.current.fillCanvas();
    }

    centerXChange = (event) => {
        this.center.x = event.target.value;
        this.setState({x: event.target.value});
        this.demoRef.current.fillCanvas();
    }

    centerYChange = (event) => {
        this.center.y = event.target.value;
        this.setState({y: event.target.value});
        this.demoRef.current.fillCanvas();
    }

    axesChange = (value) => {
        this.axes = value;
        this.demoRef.current.showUnits(value, this.grid, this.lables);
        this.demoRef.current.fillCanvas();
    }

    gridChange = (value) => {
        this.grid = value;
        this.demoRef.current.showUnits(this.axes, value, this.lables);
        this.demoRef.current.fillCanvas();
    }

    lablesChange = (value) => {
        this.lables = value;
        this.demoRef.current.showUnits(this.axes, this.grid, value);
        this.demoRef.current.fillCanvas();
    }

    fillToggle = (value) => {
        this.fill.enabled = value;
        this.demoRef.current.fillCanvas();
    }

    outlineToggle = (value) => {
        this.outline.enabled = value;
        this.demoRef.current.fillCanvas();
    }

    backgroundToggle = (value) => {
        this.background.enabled = value;
        this.demoRef.current.setBG(this.background);
        this.demoRef.current.fillCanvas();
    }
    
    fillChanged = (r, g, b, a) => {
        this.fill.r = r;
        this.fill.g = g;
        this.fill.b = b;
        this.fill.a = a;
        this.demoRef.current.fillCanvas();
    }

    outlineChanged = (r, g, b, a) => {
        this.outline.r = r;
        this.outline.g = g;
        this.outline.b = b;
        this.outline.a = a;
        this.demoRef.current.fillCanvas();
    }

    backgroundChanged = (r, g, b, a) => {
        this.background.r = r;
        this.background.g = g;
        this.background.b = b;
        this.background.a = a;
        this.demoRef.current.setBG(this.background);
        this.demoRef.current.fillCanvas();
    }

    outlineWeightChanged = (event) => {
        this.outline.weight = event.target.value;
        this.setState({outWeight: event.target.value});
        this.demoRef.current.fillCanvas();
    }

    render() {
        return (
            <div className="d-flex h-100 w-100">
                <NavigationPanel/>
                <div className="page-content container-fluid w-100 d-flex flex-column">
                    <PageHeader name="MINKOWSKI ISLAND"/>
                    <div className="interactive-area container-fluid h-100 w-100">
                        <div className="demo-container row h-50">
                            <DemoCanvas 
                                ref={this.demoRef} 
                                draw={this.draw}
                            />
                        </div>
                        <div className="row h-50">
                            <div className="col w-50 d-flex flex-column">
                                <div className="h-100 d-flex flex-column justify-content-center">
                                    <p className="text-content m-0">Center:</p>
                                    <div className="inputs-row text-content m-0 d-flex flex-row justify-content-between">
                                        <div className="text-content m-0 d-flex flex-row w-50">
                                            <span className="ms-3">x:</span>
                                            <input 
                                                className="num-input d-inline-block ms-3 mt-2 w-100 text-center"
                                                onChange={this.centerXChange}
                                                value={this.center.x}/>
                                        </div>
                                        <div className="text-content m-0 d-flex flex-row justify-content-end w-50">
                                            <span className="ms-3">y:</span>
                                            <input 
                                                className="num-input d-inline-block ms-3 mt-2 w-100 text-center" 
                                                onChange={this.centerYChange}
                                                value={this.center.y}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-100 d-flex flex-column justify-content-center">
                                    <EditableSlider 
                                        valueChanged={this.sizeChange}
                                        name="Initial size"
                                        min={1}
                                        max={20}
                                        step={1}
                                        default={this.size}
                                        marks/>
                                </div>
                                <div className="h-100 d-flex flex-column justify-content-center">
                                    <EditableSlider 
                                        valueChanged={this.detailsChange}
                                        name="Iterations"
                                        min={0}
                                        max={5}
                                        step={1}
                                        default={this.iterations}
                                        marks/>
                                </div>
                            </div>
                            <div className="col d-flex flex-column">
                                <div className="h-100 d-flex flex-column justify-content-around text-content">
                                    <div className="d-flex flex-row">
                                        <LabeledCheckbox
                                            col={0}
                                            name="Axes"
                                            className="w-100"
                                            onChanged={this.axesChange}
                                            active
                                            />
                                        <LabeledCheckbox
                                            col={0}
                                            name="Grid"
                                            className="w-100"
                                            onChanged={this.gridChange}
                                            active
                                            />
                                        <LabeledCheckbox
                                            col={0}
                                            name="Labels"
                                            className="w-100"
                                            onChanged={this.lablesChange}
                                            active
                                            />
                                    </div>
                                    <div className="container-fluid">
                                        <div className="row">
                                            <div className="col-3">Style:</div>
                                            <div className="col-9">
                                                <StyleSelect/>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <LabeledCheckbox
                                                col={8}
                                                name="Fill"
                                                onChanged={this.fillToggle}
                                                active
                                                />
                                            <div className="col-4">
                                                <ColorPicker
                                                    ref={this.fillRef}
                                                    onChanged={this.fillChanged}
                                                    r={118} g={197} b={10} a={1}/>
                                                </div>
                                        </div>
                                        <div className="row">
                                            <LabeledCheckbox
                                                col={6}
                                                name="Outline"
                                                onChanged={this.outlineToggle}
                                                active
                                                />
                                            <div className="col-2">
                                                <input 
                                                    className="num-input d-inline-block mx-auto w-100 text-center"
                                                    onChange={this.outlineWeightChanged}
                                                    value={this.outline.weight}/>
                                            </div>
                                            <div className="col-4">
                                                <ColorPicker
                                                    ref={this.outRef}
                                                    onChanged={this.outlineChanged}
                                                    r={0} g={74} b={67} a={1}/>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <LabeledCheckbox
                                                col={8}
                                                name="Background"
                                                onChanged={this.backgroundToggle}
                                                />
                                            <div className="col-4">
                                                <ColorPicker
                                                    ref={this.backRef}
                                                    onChanged={this.backgroundChanged}
                                                    r={37} g={37} b={37} a={0}/>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="lg-button main-button"
                                        onClick={(e) => {
                                            const imgData = document.querySelector(".demo").toDataURL("image/png");
                                            let aLoad = document.createElement('a');
                                            aLoad.download = "Minkowski island.png";
                                            aLoad.href = imgData;
                                            aLoad.click();
                                        }}>
                                        Export
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MinkowskiFractal;