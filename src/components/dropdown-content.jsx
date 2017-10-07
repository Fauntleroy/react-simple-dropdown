import cx from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DropdownContent extends Component {
  getElement () {
    return this.refs.content;
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
