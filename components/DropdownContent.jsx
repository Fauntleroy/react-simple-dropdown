import React, { createClass, PropTypes } from 'react';

const DropdownContent = createClass({
  propTypes: {
    children: PropTypes.any,
    className: PropTypes.string
  },
  getDefaultProps: function(){
    return {
      className: ''
    }
  },
  render: function(){
    const { children, className } = this.props;
    const classes = 'dropdown__content ' + className;
    return <div className={classes}>{children}</div>;
  }
});

export default DropdownContent;
