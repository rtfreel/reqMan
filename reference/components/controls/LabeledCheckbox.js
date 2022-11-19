import React, { Component } from 'react';

class LabeledCheckbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: props.active
        }
    }

    render() {
        return (
            <div 
                className={"labeled-cb px-1 d-flex" 
                    + (this.props.className ? " " + this.props.className : "") 
                    + (this.props.col > 0 ? " col-" + this.props.col : "")} 
                onClick={(e) => {
                    this.props.onChanged(!this.state.active);
                    this.setState({active: !this.state.active});
                }}>
                <div className={"control-box my-auto mx-2 p-0" + (this.state.active ? "" : " inactive-control-box")}/>
                {this.props.name}
            </div>
        );
    }
}

export default LabeledCheckbox;