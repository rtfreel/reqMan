import React, { Component } from 'react';

class StyleSelect extends Component {
    constructor(props) {
        super(props);
        this.styles = [
            {
                fill:       {enabled: true, r: 118, g: 197, b: 10, a: 1},
                outline:    {enabled: true, r: 0, g: 74, b: 67, a: 1, weight: 1},
                background: {enabled: false, r: 37, g: 37, b: 37, a: 1}
            },
            {
                fill:       {enabled: true, r: 118, g: 197, b: 10, a: 1},
                outline:    {enabled: true, r: 0, g: 74, b: 67, a: 1, weight: 1},
                background: {enabled: false, r: 37, g: 37, b: 37, a: 1}
            }
        ]
    }

    styleChange = (event) => {
        this.props.onStyleChanged(this.styles[event.target.options.selectedIndex]);
    }

    render() {
        return (
            <select className="control-select sub-text w-100 p-1"
                onChange={this.styleChange}>
                <option>CGLab</option>
            </select>
        );
    }
}

export default StyleSelect;