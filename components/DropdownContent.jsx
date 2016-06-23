import React, { createClass, PropTypes } from 'react';

const DropdownContent = createClass({
  displayName: 'DropdownContent',

  propTypes: {
    children: PropTypes.element,
    className: PropTypes.string
  },

  getDefaultProps () {
    return {
      className: ''
    }
  },

  render () {
    const { children, className } = this.props;
    const props = {
      ...this.props,
      className: `dropdown__content ${className}`
    };

    return (
      <div {...props}>
        {children}
      </div>
    )
  }
});

export default DropdownContent;
