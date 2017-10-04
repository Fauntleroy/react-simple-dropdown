import React, { cloneElement, Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import cx from 'classnames';
import Portal from 'react-minimalist-portal';

import DropdownTrigger from './DropdownTrigger.js';
import DropdownContent from './DropdownContent.js';

class Dropdown extends Component {
  displayName: 'Dropdown'

  componentDidMount () {
    window.addEventListener('click', this._onWindowClick);
    window.addEventListener('touchstart', this._onWindowClick);

    this._startAutoUpdateContentPosition();

    if (this.props.attachment === 'attached') {
      this._watchTriggerPosition();
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.attachment !== 'attached' && nextProps.attachment === 'attached') {
      this._watchTriggerPosition();
    } else if (this.props.attachment === 'attached' && nextProps.attachment !== 'attached') {
      this._unwatchTriggerPosition();
    }
  }

  componentWillUnmount () {
    window.removeEventListener('click', this._onWindowClick);
    window.removeEventListener('touchstart', this._onWindowClick);

    this._stopAutoUpdateContentStyle();
    this._unwatchTriggerPosition();
  }

  constructor (props) {
    super(props);

    this.state = {
      active: false,
      contentTop: 0,
      contentLeft: 0
    };

    this._onWindowClick = this._onWindowClick.bind(this);
    this._onToggleClick = this._onToggleClick.bind(this);
    this._setContentStyle = this._setContentStyle.bind(this);
    this._setTriggerPosition = this._setTriggerPosition.bind(this);
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
    this._setContentStyle();
    this.setState({
      active: true
    }, () => {
      if (this.props.onShow) {
        this.props.onShow();
      }
    });
  }

  _startAutoUpdateContentPosition () {
    if (!this._contentStyleUpdaterInterval) {
      this._contentStyleUpdaterInterval = window.setInterval(this._setContentStyle, 1000 / 120);
    }
  }

  _stopAutoUpdateContentStyle () {
    if (this._contentStyleUpdaterInterval) {
      clearInterval(this._contentStyleUpdaterInterval);
    }
  }

  _watchTriggerPosition () {
    if (!this._triggerPositionWatcherInterval) {
      this._triggerPositionWatcherInterval = window.setInterval(this._setTriggerPosition, 1000 / 120);
    }
  }

  _unwatchTriggerPosition () {
    if (this._triggerPositionWatcherInterval) {
      clearInterval(this._triggerPositionWatcherInterval);
    }
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

  _setTriggerPosition () {
    this.setState({
      triggerPosition: this.refs.trigger.getPosition()
    });
  }

  _setContentStyle () {
    let { contentHorizontalEdge, contentVerticalEdge } = this.props;
    const { avoidEdges, positionHorizontal, positionVertical } = this.props;
    const { triggerPosition } = this.state;

    if (!this.refs.content) {
      return;
    }

    let horizontalOffset = 0;
    let verticalOffset = 0;

    if (triggerPosition) {
      if (positionHorizontal === 'center') {
        horizontalOffset = triggerPosition.width / 2;
      } else if (positionHorizontal === 'right') {
        horizontalOffset = triggerPosition.width;
      }

      if (positionVertical === 'bottom') {
        verticalOffset = triggerPosition.height;
      } else if (positionVertical === 'middle') {
        verticalOffset = triggerPosition.height / 2;
      }

      horizontalOffset += triggerPosition.left;
      verticalOffset += triggerPosition.top;
    }

    if (avoidEdges && this.refs.content) {
      const contentPosition = this.refs.content.getPosition();
      const contentTopEdge = (contentVerticalEdge === 'bottom') ? verticalOffset - contentPosition.height : verticalOffset;
      const contentRightEdge = (contentHorizontalEdge === 'right') ? horizontalOffset : horizontalOffset + contentPosition.width;
      const contentBottomEdge = (contentVerticalEdge === 'bottom') ? verticalOffset : verticalOffset + contentPosition.height;
      const contentLeftEdge = (contentHorizontalEdge === 'right') ? horizontalOffset - contentPosition.width : horizontalOffset;

      const intersectsTopEdge = contentTopEdge < 0 && contentBottomEdge > 0;
      const intersectsRightEdge = contentRightEdge > window.innerWidth && contentLeftEdge < window.innerWidth;
      const intersectsBottomEdge = contentBottomEdge > window.innerHeight && contentTopEdge < window.innerHeight;
      const intersectsLeftEdge = contentLeftEdge < 0 && contentRightEdge > 0;

      if (intersectsBottomEdge && contentVerticalEdge === 'top' && positionVertical === 'bottom') {
        contentVerticalEdge = 'bottom';
        verticalOffset -= triggerPosition.height;
      } else if (intersectsTopEdge && contentVerticalEdge === 'bottom' && positionVertical === 'top') {
        contentVerticalEdge = 'top';
        verticalOffset += triggerPosition.height;
      }

      if (intersectsRightEdge && contentHorizontalEdge === 'left' && positionHorizontal === 'right') {
        contentHorizontalEdge = 'right';
        horizontalOffset -= triggerPosition.width;
      } else if (intersectsLeftEdge && contentHorizontalEdge === 'right' && positionHorizontal === 'left') {
        contentHorizontalEdge = 'left';
        horizontalOffset += triggerPosition.width;
      }
    }

    const transforms = [];
    if (contentHorizontalEdge === 'right') {
      transforms.push('translateX(-100%)');
    }
    if (contentVerticalEdge === 'bottom') {
      transforms.push('translateY(-100%)');
    }

    this.setState({
      contentStyle: {
        position: 'fixed',
        top: verticalOffset,
        left: horizontalOffset,
        transform: transforms.join(' ')
      }
    });
  }

  render () {
    const { attachment, children, className, disabled, removeElement } = this.props;
    // create component classes
    const active = this.isActive();
    const renderInPortal = (attachment === 'detached' || attachment === 'attached');
    const dropdownClasses = cx({
      dropdown: true,
      'dropdown--active': active,
      'dropdown--disabled': disabled
    });
    // stick callback on trigger element
    const boundChildren = React.Children.map(children, child => {
      if (child.type === DropdownTrigger) {
        const originalOnClick = child.props.onClick;
        child = cloneElement(child, {
          ref: 'trigger',
          onClick: (event) => {
            if (!disabled) {
              this._onToggleClick(event);
              if (originalOnClick) {
                originalOnClick.apply(child, arguments);
              }
            }
          }
        });
      } else if (child.type === DropdownContent) {
        if ((removeElement) && !active) {
          child = null;
        } else if (renderInPortal) {
          const { contentStyle } = this.state;

          child = cloneElement(child, {
            ref: 'content',
            active,
            style: contentStyle
          });
          child = (<Portal>{child}</Portal>);
        }
      }
      return child;
    });
    const cleanProps = { ...this.props };
    delete cleanProps.attachment;
    delete cleanProps.avoidEdges;
    delete cleanProps.active;
    delete cleanProps.contentHorizontalEdge;
    delete cleanProps.contentVerticalEdge;
    delete cleanProps.onShow;
    delete cleanProps.onHide;
    delete cleanProps.positionHorizontal;
    delete cleanProps.positionVertical;
    delete cleanProps.removeElement;

    return (
      <div
        {...cleanProps}
        className={`${dropdownClasses} ${className}`}>
        {boundChildren}
      </div>
    );
  }
}

Dropdown.propTypes = {
  attachment: PropTypes.oneOf(['attached', 'detached', 'inline']),
  avoidEdges: PropTypes.bool,
  disabled: PropTypes.bool,
  active: PropTypes.bool,
  onHide: PropTypes.func,
  onShow: PropTypes.func,
  positionHorizontal: PropTypes.oneOf(['left', 'center', 'right']),
  positionVertical: PropTypes.oneOf(['top', 'middle', 'bottom']),
  contentHorizontalEdge: PropTypes.oneOf(['left', 'right']),
  contentVerticalEdge: PropTypes.oneOf(['top', 'bottom']),
  children: PropTypes.node,
  className: PropTypes.string,
  removeElement: PropTypes.bool,
  style: PropTypes.object
};

Dropdown.defaultProps = {
  attachment: 'inline',
  avoidEdges: true,
  contentHorizontalEdge: 'left',
  contentVerticalEdge: 'top',
  className: '',
  positionHorizontal: 'left',
  positionVertical: 'bottom'
};

export { DropdownTrigger, DropdownContent };
export default Dropdown;
