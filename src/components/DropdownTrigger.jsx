import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DropdownTrigger extends Component {
  getPosition () {
    return this.refs.trigger.getBoundingClientRect();
  }

  render () {
    const { children, className, ...dropdownTriggerProps } = this.props;
    dropdownTriggerProps.className = `dropdown__trigger ${className}`;

    return (
      <a {...dropdownTriggerProps} ref="trigger">
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
