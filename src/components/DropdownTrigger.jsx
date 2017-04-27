import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DropdownTrigger extends Component {
  render () {
    const { children, className, component = 'a', ...dropdownTriggerProps } = this.props;
    const Component = component;
    dropdownTriggerProps.className = `dropdown__trigger ${className}`;

    return (
      <Component {...dropdownTriggerProps}>
        {children}
      </Component>
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
