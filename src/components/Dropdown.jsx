import React, { cloneElement, createClass } from 'react';
import { findDOMNode } from 'react-dom';
import cx from 'classnames';

import DropdownTrigger from './DropdownTrigger.js';
import DropdownContent from './DropdownContent.js';

var Dropdown = createClass({
  displayName: 'Dropdown',

  getInitialState () {
    return {
      active: false
    };
  },

  getDefaultProps () {
    return {
      className: ''
    }
  },

  componentDidMount () {
    window.addEventListener( 'click', this._onWindowClick );
    window.addEventListener( 'touchstart', this._onWindowClick );
  },

  componentWillUnmount () {
    window.removeEventListener( 'click', this._onWindowClick );
    window.removeEventListener( 'touchstart', this._onWindowClick );
  },

  render () {
    const { children, className } = this.props;
    // create component classes
    const active = this.isActive();
    var dropdown_classes = cx({
      dropdown: true,
      'dropdown--active': active
    });
    dropdown_classes += ' ' + className;
    // stick callback on trigger element
    const bound_children = React.Children.map( children, child => {
      if( child.type === DropdownTrigger ){
        const originalOnClick = child.props.onClick;
        child = cloneElement( child, {
          ref: 'trigger',
          onClick: ( event ) => {
            this._onToggleClick( event );
            if( originalOnClick ){
              originalOnClick.apply( child, arguments );
            }
          }
        });
      }
      return child;
    });
    return (
      <div
        style={this.props.style}
        className={dropdown_classes}>
        {bound_children}
      </div>
    );
  },

  isActive () {
    return ( typeof this.props.active === 'boolean' ) ?
      this.props.active :
      this.state.active;
  },

  hide () {
    this.setState({
      active: false
    });
    if( this.props.onHide ){
      this.props.onHide();
    }
  },

  show () {
    this.setState({
      active: true
    });
    if( this.props.onShow ){
      this.props.onShow();
    }
  },

  _onWindowClick ( event ) {
    const dropdown_element = findDOMNode( this );
    if( event.target !== dropdown_element && !dropdown_element.contains( event.target ) && this.isActive() ){
      this.hide();
    }
  },

  _onToggleClick ( event ) {
    event.preventDefault();
    if( this.isActive() ){
      this.hide();
    } else {
      this.show();
    }
  }
});

export { DropdownTrigger, DropdownContent };
export default Dropdown;
