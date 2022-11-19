import React, { Component } from 'react';
import NavigationPanel from "./template_form/NavigationPanel";
import PageHeader from "./template_form/PageHeader";
import { Container } from "react-bootstrap";
import ImageCanvas from "./controls/ImageCanvas";
import EditableSlider from "./controls/EditableSlider";
import HSLConverter from "../util/colors/HSLConverter";
import CMYKConverter from "../util/colors/CMYKConverter";
import DisplayTest from "../images/broken_tv.png";
import "../styles/ColorSchemesStyle.css";

const showOriginalKey = "Shift";

class ColorSchemes extends Component {
    constructor(props) {
        super(props);
        this.uploadInput = React.createRef();
        this.hslImageCanvas = React.createRef();
        this.cmykImageCanvas = React.createRef();
        this.imgFileExt = /(?:\.([^.]+))?$/.exec(DisplayTest)[1];
        this.hslConverter = new HSLConverter();
        this.cmykConverter = new CMYKConverter();

        this.converted = true;

        this.state = {
            brightness: 0,
            hueFrom: 220,
            hueTo: 260,
            rgb: {r: 0, g: 0, b: 0},
            hsl: {h: 0, s: 0, l: 0},
            cmyk: {c: 0, m: 0, y: 0, k: 0}
        }

        let press = this.onKeyDown;
        let release = this.onKeyUp;
        window.addEventListener("keydown", function (event) {
            press(event);
        }, true);
        window.addEventListener("keyup", function (event) {
            release(event);
        }, true);
    }

    setRGB = (rgb) => {
        let newRGB = { r: rgb.r / 255, g: rgb.g / 255, b: rgb.b / 255 };
        this.setState({
            rgb: newRGB,
            hsl: this.hslConverter.convert(newRGB),
            cmyk: this.cmykConverter.convert(newRGB)
        });
    }
    setMod = () => {
        const from = this.state.hueFrom;
        const to = this.state.hueTo;
        const val = this.state.brightness;
        this.hslImageCanvas.current.setModification((hsl) => {
            if (hsl.h >= from && hsl.h <= to) {
                // hsl.l += val / 100;
                // if (hsl.l < 0) hsl.l = 0;
                // if (hsl.l > 1) hsl.l = 1;

                // convert to HSV
                let v = hsl.l + hsl.s * Math.min(hsl.l, 1 - hsl.l);
                let s = v === 0 ? 0 : 2 - 2 * hsl.l / v;
                
                // modify brightness
                v += val / 100;
                if (v < 0) v = 0;
                if (v > 1) v = 1;

                // convert back to HSL
                hsl.l = v - v * s / 2;
                hsl.s = hsl.l === 0 || hsl.l === 1 ? 0 :
                    (v - hsl.l) / Math.min(hsl.l, 1 - hsl.l)
            }
        });
        this.hslImageCanvas.current.render();
    }
    updatePixel = (x, y, fixed) => {
        if (x === -1 || y === -1) {
            this.setState({
                rgb: {r: 0, g: 0, b: 0},
                hsl: {h: 0, s: 0, l: 0},
                cmyk: {c: 0, m: 0, y: 0, k: 0}
            });
        }
        this.hslImageCanvas.current.showAxes(x, y, fixed);
        this.cmykImageCanvas.current.showAxes(x, y, fixed);
    }
    showLastPixel = () => {
        const hsl = this.hslImageCanvas.current.getLastPos();
        const cmyk = this.cmykImageCanvas.current.getLastPos();
        if (hsl.x === -1 || hsl.y === -1) {
            this.updatePixel(cmyk.x, cmyk.y, false);
        } else {
            this.updatePixel(hsl.x, hsl.y, false);
        }
    }

    onKeyDown = (e) => {
        if (e.key === showOriginalKey && this.converted) {
            this.hslImageCanvas.current.convert(false);
            this.converted = false;
            this.showLastPixel();
        }
    }
    onKeyUp = (e) => {
        if (e.key === showOriginalKey && !this.converted) {
            this.hslImageCanvas.current.convert(true);
            this.converted = true;
            this.showLastPixel();
        }
    }

    render() {
        let colorFrom = this.hslConverter.convertBack({h: this.state.hueFrom, s: 1, l: 0.5});
        let cfVal = "rgb(" + (colorFrom.r * 255) + "," + (colorFrom.g * 255) + "," + (colorFrom.b * 255) + ")";
        let colorTo = this.hslConverter.convertBack({h: this.state.hueTo, s: 1, l: 0.5});
        let ctVal = "rgb(" + (colorTo.r * 255) + "," + (colorTo.g * 255) + "," + (colorTo.b * 255) + ")";
        return (
            <div className="d-flex h-100 w-100" tabIndex="0">
                <NavigationPanel/>
                <Container className="page-content container-fluid w-100 d-flex flex-column">
                    <PageHeader name="COLOR SCHEMES"/>
                    <div className="interactive-area container-fluid h-100 w-100">
                        <div className="demo-area row">

                            {/* Images */}
                            <div className="col-7 p-0 d-flex flex-column h-100 justify-content-between">
                                <div className="demo-img-container h-50 text-center">
                                    <ImageCanvas 
                                        className="demo"
                                        ref={this.hslImageCanvas}
                                        sendInitial={this.setRGB}
                                        updatePixelPos={this.updatePixel}
                                        colorConverter={this.hslConverter}
                                    />
                                </div>
                                <div className="demo-img-container h-50 text-center">
                                    <ImageCanvas 
                                        className="demo"
                                        ref={this.cmykImageCanvas}
                                        sendInitial={this.setRGB}
                                        updatePixelPos={this.updatePixel}
                                        colorConverter={this.cmykConverter}
                                    />
                                </div>
                            </div>

                            {/* Coordinates 
                                TODO: small version of coordinates on resize
                                TODO: fix container getting smaller after shrinkning to the smallest
                                TODO: fix change of slider post-change (use non-state variable)
                            */}
                            <div className="coord-container col-5 d-flex flex-column justify-content-center fixed">
                                {/* HSL coordinates */}
                                <div className="my-4 d-flex flex-row justify-content-center">
                                    <div className="d-flex flex-column me-1">
                                        <h1 className="color-letter text-center">H</h1>
                                        <span className="single-coord text-center p-0">{ Math.round(this.state.hsl.h)  + "°"}</span>
                                    </div>
                                    <div className="d-flex flex-column mx-2">
                                        <h1 className="color-letter text-center">S</h1>
                                        <span className="single-coord text-center p-0">{ Math.round(this.state.hsl.s * 100) + "%" }</span>
                                    </div>
                                    <div className="d-flex flex-column ms-1">
                                        <h1 className="color-letter text-center">L</h1>
                                        <span className="single-coord text-center p-0">{ Math.round(this.state.hsl.l * 100) + "%" }</span>
                                    </div>
                                </div>
                                {/* RGB coordinates */}
                                <div className="my-4 d-flex flex-row justify-content-center">
                                    <div className="d-flex flex-column me-1">
                                        <h1 className="color-letter text-center">R</h1>
                                        <span className="single-coord text-center p-0">{ this.state.rgb.r * 255 }</span>
                                    </div>
                                    <div className="d-flex flex-column mx-2">
                                        <h1 className="color-letter text-center">G</h1>
                                        <span className="single-coord text-center p-0">{ this.state.rgb.g * 255 }</span>
                                    </div>
                                    <div className="d-flex flex-column ms-1">
                                        <h1 className="color-letter text-center">B</h1>
                                        <span className="single-coord text-center p-0">{ this.state.rgb.b * 255 }</span>
                                    </div>
                                </div>
                                {/* CMYK coordinates */}
                                <div className="my-4 d-flex flex-row justify-content-center">
                                    <div className="d-flex flex-column me-1">
                                        <h1 className="color-letter text-center">C</h1>
                                        <span className="single-coord text-center p-0">{ Math.round(this.state.cmyk.c * 255) }</span>
                                    </div>
                                    <div className="d-flex flex-column ms-2 me-1">
                                        <h1 className="color-letter text-center">M</h1>
                                        <span className="single-coord text-center p-0">{ Math.round(this.state.cmyk.m * 255) }</span>
                                    </div>
                                    <div className="d-flex flex-column mx-2">
                                        <h1 className="color-letter text-center">Y</h1>
                                        <span className="single-coord text-center p-0">{ Math.round(this.state.cmyk.y * 255) }</span>
                                    </div>
                                    <div className="d-flex flex-column ms-1">
                                        <h1 className="color-letter text-center">K</h1>
                                        <span className="single-coord text-center p-0">{ Math.round(this.state.cmyk.k * 255) }</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="controls-area row">
                            <div className="col">
                                <div className="h-100 d-flex flex-column justify-content-center">
                                    <p className="text-content m-0">
                                        Brightness of
                                        <input 
                                            className="num-input d-inline-block ms-3 mt-2 w-100 text-center"
                                            value={ this.state.hueFrom }
                                            onChange={(e) => {
                                                // TODO: add validation and canvas refresh
                                                this.setState({ hueFrom: e.target.value });
                                                this.setMod();
                                            }}
                                            style={ {backgroundColor: cfVal} }/>
                                        &nbsp; &le; Hue &le;
                                        <input 
                                            list="list"
                                            className="num-input d-inline-block ms-3 mt-2 w-100 text-center"
                                            value={ this.state.hueTo }
                                            onChange={(e) => {
                                                // TODO: add validation and canvas refresh
                                                this.setState({ hueTo: e.target.value });
                                                this.setMod();
                                            }}
                                            style={ {backgroundColor: ctVal} }/>
                                        <datalist id="list">
                                            <option value="260"> Blue </option>
                                        </datalist>
                                        &nbsp; : { this.state.brightness }
                                    </p>
                                    <EditableSlider 
                                        valueChanged={(value) => {
                                            this.setState({ brightness: value });
                                            this.setMod();
                                        }}
                                        min={-100}
                                        max={100}
                                        fixedBound={true}
                                        step={1}
                                        default={ this.brightness }
                                        marks/>
                                </div>
                            </div>
                        </div>
                        
                        
                        {/* Upload and export buttons */}
                        <div className="buttons-controls-area row">

                            {/* Upload button */}
                            <div className="col">
                                <input type="file"
                                    accept="image/png, image/gif, image/jpeg"
                                    ref={this.uploadInput} 
                                    style={{display: "none"}} 
                                    onChange={(e) => {
                                        let path = e.target.files[0];
                                        this.imgFileExt = /(?:\.([^.]+))?$/.exec(path.name)[1];
                                        this.hslImageCanvas.current.setFile(path);
                                        this.cmykImageCanvas.current.setFile(path);
                                    }}/>
                                <button className="lg-button secondary-button w-100 mt-2"
                                    onClick={(e) => {
                                        this.uploadInput.current.click();
                                    }}>
                                    Upload image
                                </button>
                            </div>
                            
                            {/* Export button dropdown */}
                            <div className="col">
                                <div className="btn-group dropup w-100 mt-2">
                                    <button 
                                        className="lg-button main-button dropdown-toggle w-100" 
                                        type="button"
                                        id="dropdownMenuButton"
                                        data-bs-toggle="dropdown" 
                                        aria-haspopup="true"
                                        aria-expanded="false">
                                        Export
                                    </button>
                                    <div className="dropdown-menu w-100 text-center" aria-labelledby="dropdownMenuButton">
                                        <a className="export-item dropdown-item"
                                            href="#/"
                                            onClick={(e) => {
                                                this.hslImageCanvas.current.getOriginalImage(this.imgFileExt, (data) => {
                                                    let aLoad = document.createElement('a');
                                                    aLoad.download = "Original RGB image." + this.imgFileExt;
                                                    aLoad.href = data;
                                                    aLoad.click();
                                                });
                                            }}>
                                            Download original
                                        </a>
                                        <a className="export-item dropdown-item"
                                            href="#/"
                                            onClick={(e) => {
                                                this.hslImageCanvas.current.getProcessedImage(this.imgFileExt, (data) => {
                                                    let aLoad = document.createElement('a');
                                                    aLoad.download = "Converted to HSL image." + this.imgFileExt;
                                                    aLoad.href = data;
                                                    aLoad.click();
                                                });
                                            }}>
                                            Export to HSL
                                        </a>
                                        <a className="export-item dropdown-item" 
                                            href="#/"
                                            onClick={(e) => {
                                                this.cmykImageCanvas.current.getProcessedImage(this.imgFileExt, (data) => {
                                                    let aLoad = document.createElement('a');
                                                    aLoad.download = "Converted to CMYK image." + this.imgFileExt;
                                                    aLoad.href = data;
                                                    aLoad.click();
                                                });
                                            }}>
                                            Export to CMYK
                                        </a>
                                    </div>
                                </div>
                            </div>
                        
                        </div>
                    </div>
                </Container>
            </div>
        );
    }
}

export default ColorSchemes;