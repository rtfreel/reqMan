import React, { Component } from 'react';
import NavigationPanel from "../template_form/NavigationPanel";
import PageHeader from "../template_form/PageHeader";
import DemoCanvas from "../controls/DemoCanvas";
import "../../styles/FractalStyle.css"
import EditableSlider from "../controls/EditableSlider";
import ColorPicker from "../controls/ColorPicker";
import LabeledCheckbox from "../controls/LabeledCheckbox";
import StyleSelect from "../controls/StyleSelect";

class PythagorasFractal extends Component {
    constructor(props) {
        super(props);
        this.demoRef = React.createRef();
        this.size = 4;
        this.iterations = 0;
        this.center = {x: 0, y: 6};
        this.state = {x: 0, y: 6};
        this.axes = true;
        this.grid = true;
        this.lables = true;
        this.fill = {enabled: true, r: 118, g: 197, b: 10, a: 1};
        this.outline = {enabled: true, r: 0, g: 74, b: 67, a: 1, weight: 1};
        this.background = {enabled: false, r: 37, g: 37, b: 37, a: 1};
    }

    draw = (context, cellCost, zero, iteration, size, px, py) => {
        if(!size) {
            size = this.size * cellCost;
            let left = zero.x - (this.size / 2 - this.center.x) * cellCost;
            let up = zero.y + (this.center.y - this.size / 2) * cellCost;
            if(this.fill.enabled && this.fill.a) {
                context.fillStyle = "rgba(" + 
                    this.fill.r + ", " + 
                    this.fill.g + ", " + 
                    this.fill.b + ", " + 
                    this.fill.a;
                context.fillRect(left, up, size, size);
            }
            if(this.outline.enabled && this.outline.a) {
                context.lineWidth = this.outline.weight;
                context.strokeStyle = "rgba(" + 
                    this.outline.r + ", " + 
                    this.outline.g + ", " + 
                    this.outline.b + ", " + 
                    this.outline.a;
                context.strokeRect(left, up, size, size);
            }
            this.draw(context, 0, null, 0, size * Math.sqrt(2) / 2, left + (size / 2), up - (size / 2));
            return;
        }
        if (iteration === this.iterations) return;
        iteration++;
        context.save();
        context.translate(px, py);
        context.rotate(Math.PI / 4);
        if(this.fill.enabled && this.fill.a)
            context.fillRect(0, 0 - size, size, size);
        if(this.outline.enabled && this.outline.a)
            context.strokeRect(0, 0 - size, size, size);
        this.draw(context, cellCost, zero, iteration, size * Math.sqrt(2) / 2, size / 2, 0 - (3*size / 2));
        context.rotate(-Math.PI / 2);
        if(this.fill.enabled && this.fill.a)
            context.fillRect(0 - size, 0 - size, size, size);
        if(this.outline.enabled && this.outline.a)
            context.strokeRect(0 - size, 0 - size, size, size);
        this.draw(context, cellCost, zero, iteration, size * Math.sqrt(2) / 2, -size / 2, 0 - (3*size / 2));
        context.restore();
        return;
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
                    <PageHeader name="PYTHAGORAS TREE"/>
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
                                                value={this.state.x}/>
                                        </div>
                                        <div className="text-content m-0 d-flex flex-row justify-content-end w-50">
                                            <span className="ms-3">y:</span>
                                            <input 
                                                className="num-input d-inline-block ms-3 mt-2 w-100 text-center" 
                                                onChange={this.centerYChange}
                                                value={this.state.y}/>
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
                                        max={14}
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
                                            aLoad.download = "Pythagoras tree.png";
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

export default PythagorasFractal;