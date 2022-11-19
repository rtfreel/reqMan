import React, { Component } from 'react';
import NavigationPanel from "./template_form/NavigationPanel";
import PageHeader from "./template_form/PageHeader";
import { Container } from "react-bootstrap";
import DemoCanvas from "./controls/DemoCanvas";
import EditableSlider from "./controls/EditableSlider";
import MatrixShift from "../util/transformations/MatrixShift";
import MatrixRotate from "../util/transformations/MatrixRotate";
import LabeledCheckbox from "./controls/LabeledCheckbox";

class Transformations extends Component {
    constructor(props) {
        super(props);
        this.demoRef = React.createRef();
        this.reversed = false;
        this.a = {x: -5, y: -2.88675};
        this.b = {x: 5,  y: -2.88675};
        this.state = {
            a: this.a,
            b: this.b
        }
        let calculatedPoints = this.updateTriangle();
        this.c = calculatedPoints.c;
        this.o = calculatedPoints.o;
        this.state.c = this.c;
        this.state.o = this.o;
        this.offX = 0;
        this.rotation = 0;
        this.link = false;
    }

    draw = (context, cellCost, zero) => {
        let getPoint = (initial) => {
            return {
                x: zero.x + initial.x * cellCost,
                y: zero.y - initial.y * cellCost
            }
        }

        // calculate transformations
        let transA = MatrixRotate.rotate(this.a, this.o, this.rotation);
        let transB = MatrixRotate.rotate(this.b, this.o, this.rotation);
        let transC = MatrixRotate.rotate(this.c, this.o, this.rotation);
        transA = MatrixShift.shift(transA,      this.offX * (this.link ? this.rotation : 1), 0);
        transB = MatrixShift.shift(transB,      this.offX * (this.link ? this.rotation : 1), 0);
        transC = MatrixShift.shift(transC,      this.offX * (this.link ? this.rotation : 1), 0);
        let transO = MatrixShift.shift(this.o,  this.offX * (this.link ? this.rotation : 1), 0);

        // map to canvas
        let ap = getPoint(transA);
        let bp = getPoint(transB);
        let cp = getPoint(transC);
        let op = getPoint(transO);

        // draw triangle
        context.beginPath();
        context.moveTo(ap.x, ap.y);
        context.lineTo(bp.x, bp.y);
        context.lineTo(cp.x, cp.y);
        context.lineTo(ap.x, ap.y);
        context.lineTo(bp.x, bp.y);
        context.lineWidth = 5;
        context.strokeStyle = "rgba(118, 197, 10, 1)";
        context.stroke();

        // draw point
        context.beginPath();
        context.arc(op.x, op.y, 5, 0, 2 * Math.PI);
        context.fillStyle = "#078678";
        context.fill();

        // draw lables
        let xMid = (Math.min(ap.x, bp.x, cp.x) + Math.max(ap.x, bp.x, cp.x)) / 2; 
        let yMid = (Math.min(ap.y, bp.y, cp.y) + Math.max(ap.y, bp.y, cp.y)) / 2; 
        const fontSize = 18;
        context.beginPath();
        context.fillStyle = "#A9A9A9";
        context.font = "bold " + fontSize + "px serif";
        let drawLetter = (letter, point) => {
            context.textAlign = point.x <= xMid ? "right" : "left";
            context.fillText(letter, point.x, point.y + fontSize * (point.y <= yMid ? -1 : 1.5));
        }
        drawLetter("A", ap);
        drawLetter("B", bp);
        drawLetter("C", cp);
    }

    updateTriangle = () => {
        let a = this.a;
        let b = this.b;

        // base vector
        let vBase = {
            x: b.x - a.x,
            y: b.y - a.y
        };

        // base length
        let baseLen = Math.sqrt(Math.pow(vBase.x, 2) + Math.pow(vBase.y, 2));

        // middle point of the base
        let baseCenter = { 
            x: (a.x + b.x) / 2,
            y: (a.y + b.y) / 2
        };

        // perpendicular vector to base
        let vMedian = { 
            x: vBase.y * (this.reversed ? 1 : -1),
            y: vBase.x * (this.reversed ? -1 : 1)
        };

        // calculate third triangle point and center
        let multiplier = baseLen * Math.sqrt(0.75 / 
            (Math.pow(vMedian.x, 2) + Math.pow(vMedian.y, 2))
        );
        let c = {
            x: baseCenter.x + vMedian.x * multiplier,
            y: baseCenter.y + vMedian.y * multiplier
        };
        let o = {
            x: (a.x + b.x + c.x) / 3,
            y: (a.y + b.y + c.y) / 3
        };

        return { c: c, o: o };
    }

    updateParameters = () => {
        let calculatedPoints = this.updateTriangle();
        this.c = calculatedPoints.c;
        this.o = calculatedPoints.o;
        this.setState(calculatedPoints);
        this.demoRef.current.fillCanvas();
    }

    round = (num) => {
        return Math.round(num * 100) / 100;
    }

    render() {
        return (
            <div className="d-flex h-100 w-100">
                <NavigationPanel/>
                <Container className="page-content w-100 d-flex flex-column">
                    <PageHeader name="TRANSFORMATIONS"/>
                    <div className="interactive-area container-fluid h-100 w-100">
                        <div className="demo-container row" style={{height: "55%"}}>
                            <DemoCanvas
                                ref={this.demoRef} 
                                draw={this.draw}
                            />
                        </div>
                        <div className="row" style={{height: "45%"}}>
                            <div className="col w-50 d-flex flex-column justify-content-between text-content">
                                <p className="m-0">Equilateral triangle:</p>
                                <div className="row">
                                    {/* TODO: let user know in what exact field error happened */}
                                    <div className="col-2">A:</div>
                                    <div className="col-5">
                                        <div className="d-flex justify-content-center">
                                            (x: <input className="num-input w-100 mx-2 text-center" 
                                                onChange={(e) => {
                                                    this.a.x = +e.target.value;
                                                    this.setState({a: {x: e.target.value, y: this.state.a.y}});
                                                    this.updateParameters();
                                                }}
                                                value={this.state.a.x}/>;
                                        </div>
                                    </div>
                                    <div className="col-5">
                                        <div className="d-flex justify-content-center">
                                            y: <input className="num-input w-100 mx-2 text-center" 
                                                onChange={(e) => {
                                                    this.a.y = +e.target.value;
                                                    this.setState({a: {x: this.state.a.x, y: e.target.value}});
                                                    this.updateParameters();
                                                }}
                                                value={this.state.a.y}/> )
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-2">B:</div>
                                    <div className="col-5">
                                        <div className="d-flex justify-content-center">
                                            (x: <input className="num-input w-100 mx-2 text-center" 
                                                onChange={(e) => {
                                                    this.b.x = +e.target.value;
                                                    this.setState({b: {x: e.target.value, y: this.state.b.y}});
                                                    this.updateParameters();
                                                }}
                                                value={this.state.b.x}/>;
                                        </div>
                                    </div>
                                    <div className="col-5">
                                        <div className="d-flex justify-content-center">
                                            y: <input className="num-input w-100 mx-2 text-center" 
                                                onChange={(e) => {
                                                    this.b.y = +e.target.value;
                                                    this.setState({b: {x: this.state.b.x, y: e.target.value}});
                                                    this.updateParameters();
                                                }}
                                                value={this.state.b.y}/> )
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-2">C:</div>
                                    <div className="col-5">
                                        <div className="d-flex justify-content-center">
                                            (x: <span className="defined-num w-100 mx-2 text-center">{this.round(this.state.c.x)}</span>;    
                                        </div>
                                    </div>
                                    <div className="col-5">
                                        <div className="d-flex justify-content-center">
                                            y: <span className="defined-num w-100 mx-2 text-center">{this.round(this.state.c.y)}</span> )
                                        </div>
                                    </div>
                                </div>
                                <button className="lg-button secondary-button w-100 mb-2"
                                    onClick={(e) => {
                                        this.reversed = !this.reversed;
                                        this.updateParameters({reversed: this.reversed});
                                    }}>
                                    Flip triangle
                                </button>
                            </div>
                            <div className="col d-flex flex-column justify-content-between text-content">
                                <div>
                                    <EditableSlider
                                        valueChanged={(value)=>{
                                            this.rotation = value;
                                            this.demoRef.current.fillCanvas();
                                        }}
                                        name="Rotatation"
                                        min={0}
                                        max={360}
                                        step={1}
                                        fixedBound={true}
                                        default={0}
                                        marks/>
                                </div>
                                <div>
                                    <EditableSlider 
                                        valueChanged={(value)=>{
                                            this.offX = value;
                                            this.demoRef.current.fillCanvas();
                                        }}
                                        name="X offset"
                                        min={-10}
                                        max={10}
                                        step={1}
                                        default={0}
                                        marks/>
                                </div>
                                <LabeledCheckbox
                                    name="Attach offset to rotation"
                                    className="w-100"
                                    onChanged={(value) => {
                                        this.link = value;
                                        this.demoRef.current.fillCanvas();
                                    }}/>
                                <button className="lg-button main-button mb-2"
                                    onClick={(e) => {
                                        const imgData = document.querySelector(".demo").toDataURL("image/png");
                                        let aLoad = document.createElement('a');
                                        aLoad.download = "Triangle.png";
                                        aLoad.href = imgData;
                                        aLoad.click();
                                    }}>
                                    Export
                                </button>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }
}

export default Transformations;