import React, { cloneElement, Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Portal from 'react-minimalist-portal';

import DropdownTrigger from './dropdown-trigger';
import DropdownContent from './dropdown-content';

import { getElementOuterWidth, getElementOuterHeight } from '../utils/dom';

class Dropdown extends Component {
  displayName: 'Dropdown'

  componentDidMount () {
    this._watchClicks();

    if (this.props.attachment === 'attached' && this.isActive()) {
      this._startAutoUpdateContentStyle();
    }
  }

  componentWillUpdate (nextProps, nextState) {
    const wasActive = (this.props.active || this.state.active);
    const willBeActive = (nextProps.active || nextState.active);

    if (
      ((!wasActive && willBeActive) && nextProps.attachment === 'attached') ||
      (willBeActive && (nextProps.attachment === 'attached' && this.props.attachment !== 'attached'))
    ) {
      this._startAutoUpdateContentStyle();
    }

    if (
      (wasActive && !willBeActive) ||
      (nextProps.attachment !== 'attached' && this.props.attachment === 'attached')
    ) {
      this._stopAutoUpdateContentStyle();
    }

    if (!wasActive && willBeActive) {
      this._setContentStyle();
    }
  }

  componentWillUnmount () {
    this._unwatchClicks();
    this._stopAutoUpdateContentStyle();
  }

  constructor (props) {
    super(props);

    this.state = {
      active: false
    };

    this._onWindowClick = this._onWindowClick.bind(this);
    this._onToggleClick = this._onToggleClick.bind(this);
    this._onAnimationFrame = this._onAnimationFrame.bind(this);
    this._setContentStyle = this._setContentStyle.bind(this);
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
      this._setContentStyle();
      if (this.props.onShow) {
        this.props.onShow();
      }
    });
  }

  _watchClicks () {
    window.addEventListener('click', this._onWindowClick);
    window.addEventListener('touchstart', this._onWindowClick);
  }

  _unwatchClicks () {
    window.removeEventListener('click', this._onWindowClick);
    window.removeEventListener('touchstart', this._onWindowClick);
  }

  _startAutoUpdateContentStyle () {
    if (!this._contentStyleUpdaterRafId) {
      this._contentStyleUpdaterRafId = requestAnimationFrame(this._onAnimationFrame);
    }
  }

  _stopAutoUpdateContentStyle () {
    if (this._contentStyleUpdaterRafId) {
      cancelAnimationFrame(this._contentStyleUpdaterRafId);
      delete this._contentStyleUpdaterRafId;
    }
  }

  _onAnimationFrame () {
    const { attachment } = this.props;

    if (attachment !== 'attached') {
      return;
    }

    this._setContentStyle();
    this._contentStyleUpdaterRafId = requestAnimationFrame(this._onAnimationFrame);
  }

  _onWindowClick (event) {
    if (!this.refs.content) {
      return;
    }

    const dropdownContentElement = this.refs.content.getElement();
    const dropdownTriggerElement = this.refs.trigger.getElement();
    const isInContent = (event.target === dropdownContentElement || dropdownContentElement.contains(event.target));
    const isInTrigger = (event.target === dropdownTriggerElement || dropdownTriggerElement.contains(event.target));

    if ((!isInContent && !isInTrigger) && this.isActive()) {
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

  _setContentStyle () {
    if (!this.refs.content) {
      return;
    }

    const { avoidEdges, contentHorizontalEdge, contentVerticalEdge, positionHorizontal, positionVertical } = this.props;
    const triggerPosition = this.refs.trigger.getElement().getBoundingClientRect();
    const contentElement = this.refs.content.getElement();
    const contentHeight = getElementOuterHeight(contentElement);
    const contentWidth = getElementOuterWidth(contentElement);
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

    if (contentVerticalEdge === 'bottom') {
      verticalOffset -= contentHeight;
    } else if (contentVerticalEdge === 'middle') {
      verticalOffset -= contentHeight / 2;
    }

    if (contentHorizontalEdge === 'right') {
      horizontalOffset -= contentWidth;
    } else if (contentHorizontalEdge === 'center') {
      horizontalOffset -= contentWidth / 2;
    }

    if (avoidEdges) {
      const contentTopEdge = verticalOffset;
      const contentRightEdge = horizontalOffset + contentWidth;
      const contentBottomEdge = verticalOffset + contentHeight;
      const contentLeftEdge = horizontalOffset;

      const beyondTopEdge = contentTopEdge < 0;
      const beyondRightEdge = contentRightEdge > window.innerWidth;
      const beyondBottomEdge = contentBottomEdge > window.innerHeight;
      const beyondLeftEdge = contentLeftEdge < 0;

      if (beyondBottomEdge) {
        verticalOffset = window.innerHeight - 5 - contentHeight;
      } else if (beyondTopEdge) {
        verticalOffset = 5;
      }

      if (beyondLeftEdge) {
        horizontalOffset = 5;
      } else if (beyondRightEdge) {
        horizontalOffset = window.innerWidth - 5 - contentWidth;
      }
    }

    this.setState({
      contentStyle: {
        position: 'fixed',
        top: `${verticalOffset}px`,
        left: `${horizontalOffset}px`
      }
    });
  }

  render () {
    const {
      attachment,
      children,
      className,
      disabled,
      removeElement
    } = this.props;
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
          const {
            // for short periods the style may not be ready
            // at that time just hide the dropdown content for a bit
            contentStyle = {
              visibility: 'hidden'
            }
          } = this.state;

          child = cloneElement(child, {
            ref: 'content',
            active,
            style: contentStyle
          });

          child = (<Portal>{child}</Portal>);
        } else {
          child = cloneElement(child, {
            ref: 'content',
            active
          });
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
  contentHorizontalEdge: PropTypes.oneOf(['left', 'center', 'right']),
  contentVerticalEdge: PropTypes.oneOf(['top', 'middle', 'bottom']),
  children: PropTypes.node,
  className: PropTypes.string,
  removeElement: PropTypes.bool,
  style: PropTypes.object
};

Dropdown.defaultProps = {
  attachment: 'attached',
  avoidEdges: true,
  contentHorizontalEdge: 'left',
  contentVerticalEdge: 'top',
  className: '',
  positionHorizontal: 'left',
  positionVertical: 'bottom'
};

export { DropdownTrigger, DropdownContent };
export default Dropdown;
