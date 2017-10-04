import cx from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DropdownContent extends Component {
  getPosition () {
    // invisibly show element so we can get real size information
    const originalDisplay = this.refs.content.style.display;
    const originalVisibility = this.refs.content.style.visibility;
    this.refs.content.style.visibility = 'hidden';
    this.refs.content.style.display = 'block';
    const elementPosition = this.refs.content.getBoundingClientRect();
    this.refs.content.style.visibility = originalVisibility;
    this.refs.content.style.display = originalDisplay;
    return elementPosition;
  }

  render () {
    const { active, children, className, ...dropdownContentProps } = this.props;
    const dropdownContentClassNames = cx({
      'dropdown__content': true,
      'dropdown__content--active': active
    });
    dropdownContentProps.className = `${dropdownContentClassNames} ${className}`;

    return (
      <div {...dropdownContentProps} ref="content">
        {children}
      </div>
    );
  }
}

DropdownContent.displayName = 'DropdownContent';

DropdownContent.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string
};

DropdownContent.defaultProps = {
  active: false,
  className: ''
};

export default DropdownContent;
