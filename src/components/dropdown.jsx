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

  componentDidUpdate (prevProps, prevState) {
    const wasActive = (prevProps.active || prevState.active);
    const willBeActive = (this.props.active || this.state.active);

    if (
      (!wasActive && willBeActive) ||
      (willBeActive && (prevProps.attachment === 'detached' && this.props.attachment !== 'detached'))
    ) {
      this._startAutoUpdateContentStyle();
    }

    if (
      (wasActive && !willBeActive) ||
      (prevProps.attachment !== 'detached' && this.props.attachment === 'detached')
    ) {
      this._stopAutoUpdateContentStyle();
    }

    if (
      (!wasActive && willBeActive) ||
      (prevProps.attachment !== this.props.attachment)
    ) {
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

    if (attachment === 'detached') {
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

    const { attachment, avoidEdges, contentHorizontalEdge, contentVerticalEdge, positionHorizontal, positionVertical } = this.props;
    const triggerPosition = this.refs.trigger.getElement().getBoundingClientRect();
    const contentElement = this.refs.content.getElement();
    const contentHeight = getElementOuterHeight(contentElement);
    const contentWidth = getElementOuterWidth(contentElement);
    let horizontalOffset = 0;
    let verticalOffset = 0;

    if (attachment !== 'inline') {
      horizontalOffset += window.scrollX;
      verticalOffset += window.scrollY;
    }

    if (triggerPosition) {
      if (attachment !== 'inline') {
        horizontalOffset += triggerPosition.left;
        verticalOffset += triggerPosition.top;
      }

      if (positionHorizontal === 'center') {
        horizontalOffset += triggerPosition.width / 2;
      } else if (positionHorizontal === 'right') {
        horizontalOffset += triggerPosition.width;
      }

      if (positionVertical === 'bottom') {
        verticalOffset += triggerPosition.height;
      } else if (positionVertical === 'middle') {
        verticalOffset += triggerPosition.height / 2;
      }
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
      const windowTopEdge = window.scrollY;
      const windowRightEdge = window.scrollX + window.innerWidth;
      const windowBottomEdge = window.scrollY + window.innerHeight;
      const windowLeftEdge = window.scrollX;

      const contentTopEdge = attachment === 'inline'
        ? verticalOffset + (windowTopEdge + triggerPosition.top)
        : verticalOffset;
      const contentRightEdge = attachment === 'inline'
        ? horizontalOffset + contentWidth + (windowLeftEdge + triggerPosition.left)
        : horizontalOffset + contentWidth;
      const contentBottomEdge = attachment === 'inline'
        ? verticalOffset + contentHeight + (windowTopEdge + triggerPosition.top)
        : verticalOffset + contentHeight;
      const contentLeftEdge = attachment === 'inline'
        ? horizontalOffset + (windowLeftEdge + triggerPosition.left)
        : horizontalOffset;

      const beyondTopEdge = contentTopEdge < windowTopEdge;
      const beyondRightEdge = contentRightEdge > windowRightEdge;
      const beyondBottomEdge = contentBottomEdge > windowBottomEdge;
      const beyondLeftEdge = contentLeftEdge < windowLeftEdge;

      if (attachment === 'inline') {
        if (beyondBottomEdge) {
          verticalOffset = verticalOffset - 5 - (contentBottomEdge - windowBottomEdge);
        } else if (beyondTopEdge) {
          verticalOffset = verticalOffset + 5 + (windowTopEdge - contentTopEdge);
        }

        if (beyondLeftEdge) {
          horizontalOffset = horizontalOffset + 5 + (windowLeftEdge - contentLeftEdge);
        } else if (beyondRightEdge) {
          horizontalOffset = horizontalOffset - 5 - (contentRightEdge - windowRightEdge);
        }
      } else {
        if (beyondBottomEdge) {
          verticalOffset = windowBottomEdge - 5 - contentHeight;
        } else if (beyondTopEdge) {
          verticalOffset = windowTopEdge + 5;
        }

        if (beyondLeftEdge) {
          horizontalOffset = windowLeftEdge + 5;
        } else if (beyondRightEdge) {
          horizontalOffset = windowRightEdge - 5 - contentWidth;
        }
      }
    }

    this.setState({
      contentStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        transform: `translateX(${horizontalOffset}px) translateY(${verticalOffset}px)`
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
    const dropdownStyle = {
      position: renderInPortal ? null : 'relative'
    };

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
          const {
            contentStyle
          } = this.state;

          child = cloneElement(child, {
            ref: 'content',
            active,
            style: contentStyle
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
        className={`${dropdownClasses} ${className}`}
        style={dropdownStyle}>
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
