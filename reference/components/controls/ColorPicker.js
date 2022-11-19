import React from 'react'
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'

class ColorPicker extends React.Component {
  state = {
    displayColorPicker: false,
    color: {
      r: this.props.r,
      g: this.props.g,
      b: this.props.b,
      a: this.props.a,
    },
  };

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleChange = (color) => {
    this.setState({ color: color.rgb })
    this.setState({ r: color.rgb.r, g: color.rgb.g, b: color.rgb.b, a: color.rgb.a });
    this.props.onChanged(color.rgb.r, color.rgb.g, color.rgb.b, color.rgb.a);
  };

  render() {
    const styles = reactCSS({
      'default': {
        color: {
          width: '100%',
          height: '100%',
          borderRadius: '5px',
          background: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`,
        },
        swatch: {
          border: "1px solid #004A43",
          borderRadius: '5px',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
        },
        cover: {
            background: "none",
            position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
        },
      },
    });

    return (
      <div className="w-100 h-100">
        <div className="w-100 h-75 mt-2" style={ styles.swatch } onClick={ this.handleClick }>
          <div style={ styles.color } />
        </div>
        { this.state.displayColorPicker ? <div style={ styles.popover }>
          <div style={ styles.cover } onClick={ this.handleClose }/>
          <SketchPicker color={ this.state.color } onChange={ this.handleChange } />
        </div> : null }

      </div>
    )
  }
}

export default ColorPicker;