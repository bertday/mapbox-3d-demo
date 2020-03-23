/*
this is a generic/reusable component i wrote to allow static text to be
editable inline by clicking on it. calls a callback when the input changes.
supports validation and custom error messages.
*/

import React from 'react';
import './EditableLabel.css';

class EditableLabel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      validationFailed: false,
      value: props.value,
    };
  }

  // set internal state based on props and make it reactive
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.value !== prevState.value) {
      return { value: nextProps.value };
    }

    return null;
  }

  render() {
    return (
      <div className="editable-label-container">
        {this.innerComponent()}
      </div>
    );
  }

  innerComponent() {
    if (this.state.isEditing) {
      return (
        <input
          className="editable-label-input"
          defaultValue={this.state.value}
          onBlur={this.handleDidStopEditing.bind(this)}
          onKeyPress={this.handleKeyPress}
        />
      );
    }

    let className = 'editable-label';

    if (this.state.validationFailed) {
      className += ' editable-label-error';
    }

    return (
      <div
        className={className}
        onClick={this.handleClick.bind(this)}
      >
        {
          this.state.validationFailed ?
            this.props.errorMessage :
            this.state.value
        }
      </div>
    );
  }

  handleClick() {
    // TODO focus
    this.setState({ isEditing: true });
  }

  handleKeyPress(e) {
    // listen for enter key to stop editing
    const isEnter = e.nativeEvent.keyCode === 13;

    if (isEnter) {
      e.target.blur();
    }
  }

  handleDidStopEditing(e) {
    let nextValue = e.target.value;

    // validate input
    const isValid = this.props.validator(nextValue);

    // set internal state
    this.setState({
      isEditing: false,
      validationFailed: !isValid,
    });

    // pass event up to parent
    if (isValid) {
      this.props.onUpdate(nextValue);
    }
  }
}

export default EditableLabel;
