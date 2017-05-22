import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DropdownContent extends Component {
  render () {
    const { children, className, component, ...dropdownContentProps } = this.props;
    const Component = component
    dropdownContentProps.className = `dropdown__content ${className}`;

    return (
      <Component {...dropdownContentProps}>
        {children}
      </Component>
    );
  }
}

DropdownContent.displayName = 'DropdownContent';

DropdownContent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

DropdownContent.defaultProps = {
  className: '',
  component: 'div'
};

export default DropdownContent;
