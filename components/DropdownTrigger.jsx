import React, { createClass, PropTypes } from 'react';

const DropdownTrigger = createClass({
  propTypes: {
    children: PropTypes.any,
    className: PropTypes.string,
    onClick: PropTypes.func
  },
  getDefaultProps: function(){
    return {
      className: ''
    };
  },
  render: function(){
    const { children, className, onClick } = this.props;
    const classes = 'dropdown__trigger ' + className;
    return (
      <a className={classes} href="#dropdown-trigger" onClick={onClick}>
        {children}
      </a>
    );
  }
});

export default DropdownTrigger;
