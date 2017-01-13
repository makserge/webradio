import React, { Component, PropTypes } from 'react';
import Slider from 'material-ui/Slider';

const containerStyle = {
  width: 600
};
const valueStyle = {
  display: "inline-block",
  verticalAlign: "middle",
  marginLeft: 20,
  marginRight: 20,
  fontSize: 14
};
const sliderStyle  = {
  display: "inline-block",
  verticalAlign: "middle",
  width: 450,
  height: 40,
  marginBottom: 25
};

class FrequencySlider extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value: this.props.value
    };
  }

  handleChange = (event, value) => {
    this.setState({ value: value });
  };

  handleDragStop = (event) => {
    this.props.onSave(this.state.value.toString());
  };

  focusInCurrentTarget = ({ relatedTarget, currentTarget }) => {
    if (relatedTarget === null) {
      return false;
    }
    let node = relatedTarget.parentNode;
    while (node !== null) {
      if (node === currentTarget) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  }

  handleBlur = (event) => {
    if (!focusInCurrentTarget(event)) {
      this.props.onSave(this.state.value.toString());
    }
  }

  render() {
    return (
      <div
        tabIndex="1"
        style={containerStyle}
        onBlur={this.handleBlur} >
        <div
          style={valueStyle} >
          {this.state.value}
        </div>
        <Slider
          style={sliderStyle}
          min={88.0}
          max={108.0}
          step={0.1}
          value={parseFloat(this.props.value)}
          onChange={this.handleChange}
          onDragStop={this.handleDragStop} />
      </div>
    );
  }
}
/*
<TextField
  onKeyDown={this.handleEnter.bind(this)}
  id='new-todo-input'
  style={defaultStyle}
  type="text"
  hintText={this.props.placeholder}
  autoFocus="true"
  value={this.state.text}
  errorText={this.props.errorText}
  onBlur={this.handleBlur.bind(this)}
  onChange={this.handleChange.bind(this)}
  */
FrequencySlider.propTypes = {
  onSave: PropTypes.func.isRequired,
  value: PropTypes.string
};

export default FrequencySlider;
