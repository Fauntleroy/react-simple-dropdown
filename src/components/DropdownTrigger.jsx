import React, { Component, PropTypes } from 'react';

class DropdownTrigger extends Component {
  render () {
    const { children, className } = this.props;
    const dropdownTriggerProps = {
      ...this.props,
      className: `dropdown__trigger ${className}`
    };

    return (
      <a {...dropdownTriggerProps}>
        {children}
      </a>
    );
  }
}

DropdownTrigger.displayName = 'DropdownTrigger';

DropdownTrigger.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

DropdownTrigger.defaultProps = {
  className: ''
};

export default DropdownTrigger;
