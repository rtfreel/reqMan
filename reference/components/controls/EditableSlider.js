import React, { Component } from 'react';
import Slider from "material-ui-slider/es5/src/slider";
import "../../styles/SliderStyle.css";

class EditableSlider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            minVal: props.min, 
            maxVal: props.max,
            curVal: props.default
        };
    }

    handleMin = (event) => {
        this.setState({ minVal: event.target.value});
        if(event.target.value < this.state.minVal) {
            this.handleChange(this.state.minVal);
        }
    }

    handleMax = (event) => {
        this.setState({ maxVal: event.target.value});
        if(event.target.value > this.state.maxVal) {
            this.handleChange(this.state.maxVal);
        }
    }

    handleChange = (value) => {
        this.setState({ curVal: value });
        this.props.valueChanged(value);
    }

    render() {
        return (
            <>
                { this.props.name ? <p className="text-content m-0">{this.props.name + ": " + this.state.curVal}</p> : ""}
                <div className="my-0 w-100 d-flex flex-row justify-content-between">
                    {
                        this.props.fixedBound ?
                        <label className="sub-num d-inline-block w-100 text-center">{this.state.minVal}</label> :
                        <input className="num-input sub-num d-inline-block w-100 text-center" 
                            onChange={this.handleMin}
                            value={this.state.minVal}/>
                    }
                    <Slider 
                        className="my-auto mx-3 w-100"
                        onChange={this.handleChange}
                        min={this.state.minVal}
                        max={this.state.maxVal}
                        value={this.props.default}
                        step={this.props.step}
                        color="#078678"
                        marks/>
                    {
                        this.props.fixedBound ?
                        <label className="sub-num d-inline-block w-100 text-center">{this.state.maxVal}</label> :
                        <input className="num-input sub-num d-inline-block w-100 text-center"
                            onChange={this.handleMax}
                            value={this.state.maxVal}/>
                    }
                </div>
            </>
        );
    }
}

export default EditableSlider;