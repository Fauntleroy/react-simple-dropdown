import React, { cloneElement, Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import cx from 'classnames';

import DropdownTrigger from './DropdownTrigger.js';
import DropdownContent from './DropdownContent.js';

class Dropdown extends Component {
  displayName: 'Dropdown'

  componentDidMount () {
    window.addEventListener('click', this._onWindowClick);
    window.addEventListener('touchstart', this._onWindowClick);
  }

  componentWillUnmount () {
    window.removeEventListener('click', this._onWindowClick);
    window.removeEventListener('touchstart', this._onWindowClick);
  }

  constructor (props) {
    super(props);

    this.state = {
      active: false
    };

    this._onWindowClick = this._onWindowClick.bind(this);
    this._onToggleClick = this._onToggleClick.bind(this);
  }

  isActive () {
    return (typeof this.props.active === 'boolean') ?
      this.props.active :
      this.state.active;
  }

  hide () {
    this.setState({
      active: false
    }, () => {
      if (this.props.onHide) {
        this.props.onHide();
      }
    });
  }

  show () {
    this.setState({
      active: true
    }, () => {
      if (this.props.onShow) {
        this.props.onShow();
      }
    });
  }

  _onWindowClick (event) {
    const dropdownElement = findDOMNode(this);
    if (event.target !== dropdownElement && !dropdownElement.contains(event.target) && this.isActive()) {
      this.hide();
    }
  }

  _onToggleClick (event) {
    event.preventDefault();
    if (this.isActive()) {
      this.hide();
    } else {
      this.show();
    }
  }

  render () {
    const {
      children,
      active,
      onShow,
      onHide,
      className,
      component,
      ...otherProps
    } = this.props;
    const Component = component;
    // create component classes
    const isActive = this.isActive();
    const activeClassName = Dropdown.customClasses.active

    const dropdownClasses = cx({
      dropdown: true,
      [activeClassName]: isActive
    });
    // stick callback on trigger element
    const boundChildren = React.Children.map(children, child => {
      if (child.type === DropdownTrigger) {
        const originalOnClick = child.props.onClick;
        child = cloneElement(child, {
          ref: 'trigger',
          onClick: (event) => {
            this._onToggleClick(event);
            if (originalOnClick) {
              originalOnClick.apply(child, arguments);
            }
          }
        });
      }
      return child;
    });

    return (
      <Component
        {...otherProps}
        className={`${dropdownClasses} ${className}`}>
        {boundChildren}
      </Component>
    );
  }
}

Dropdown.customClasses = {
  active: 'dropdown--active'
}

Dropdown.propTypes = {
  active: PropTypes.bool,
  onHide: PropTypes.func,
  onShow: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object
};

Dropdown.defaultProps = {
  className: '',
  component: 'div'
};

export { DropdownTrigger, DropdownContent };
export default Dropdown;
