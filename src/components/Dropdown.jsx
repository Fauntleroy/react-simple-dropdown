import React, { cloneElement, Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import cx from 'classnames';

import DropdownTrigger from './DropdownTrigger.js';
import DropdownContent from './DropdownContent.js';

class Dropdown extends Component {
  constructor (props) {
    super(props);

    this.state = {
      active: false
    };

    this._onWindowClick = this._onWindowClick.bind(this);
    this._onToggleClick = this._onToggleClick.bind(this);
  }

  displayName: 'Dropdown'

  componentDidMount () {
    window.addEventListener( 'click', this._onWindowClick );
    window.addEventListener( 'touchstart', this._onWindowClick );
  }

  componentWillUnmount () {
    window.removeEventListener( 'click', this._onWindowClick );
    window.removeEventListener( 'touchstart', this._onWindowClick );
  }

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
  }

  isActive () {
    return ( typeof this.props.active === 'boolean' ) ?
      this.props.active :
      this.state.active;
  }

  hide () {
    this.setState({
      active: false
    });
    if( this.props.onHide ){
      this.props.onHide();
    }
  }

  show () {
    this.setState({
      active: true
    });
    if( this.props.onShow ){
      this.props.onShow();
    }
  }

  _onWindowClick ( event ) {
    const dropdown_element = findDOMNode( this );
    if( event.target !== dropdown_element && !dropdown_element.contains( event.target ) && this.isActive() ){
      this.hide();
    }
  }

  _onToggleClick ( event ) {
    event.preventDefault();
    if( this.isActive() ){
      this.hide();
    } else {
      this.show();
    }
  }
}

Dropdown.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
}

Dropdown.defaultProps = {
  className: ''
};

export { DropdownTrigger, DropdownContent };
export default Dropdown;
