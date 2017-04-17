import React, { Component, PropTypes } from 'react';

class DropdownContent extends Component {
  render () {
    const { children, className } = this.props;
    const dropdownContentProps = {
      ...this.props,
      className: `dropdown__content ${className}`
    };

    return (
      <div {...dropdownContentProps}>
        {children}
      </div>
    )
  }
}

DropdownContent.displayName = 'DropdownContent';

DropdownContent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

DropdownContent.defaultProps = {
  className: ''
};

export default DropdownContent;
