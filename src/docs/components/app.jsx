const fs = require('fs');

import _ from 'lodash';
import React, { Component } from 'react';

import Highlight from 'react-highlight';

import AccountDropdown from './account-dropdown';

// eslint-disable-next-line no-sync
const accountDropdownCode = fs.readFileSync(`${__dirname}/account-dropdown.jsx`, 'utf8');

const ATTACHMENTS = ['inline', 'attached', 'detached'];
const POSITIONS_HORIZONTAL = ['left', 'center', 'right'];
const POSITIONS_VERTICAL = ['top', 'middle', 'bottom'];
const CONTENT_EDGES_HORIZONTAL = ['left', 'right'];
const CONTENT_EDGES_VERTICAL = ['top', 'bottom'];

function defaultDataGetter (event) {
  return event.target.value;
}

class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      attachment: ATTACHMENTS[0],
      avoidEdges: false,
      disabled: false,
      onHide: function () {},
      onShow: function () {},
      positionHorizontal: POSITIONS_HORIZONTAL[0],
      positionVertical: POSITIONS_VERTICAL[2],
      className: 'account-dropdown',
      removeElement: false
    };

    this.handleLinkClick = this.handleLinkClick.bind(this);
  }

  handleLinkClick () {
    this.refs.dropdown.hide();
  }

  createStateHandler (key, dataGetter = defaultDataGetter) {
    return (event) => {
      this.setState({
        [key]: dataGetter(event)
      });
    };
  }

  createStateUnsetter (key) {
    return () => {
      this.setState({
        // eslint-disable-next-line no-undefined
        [key]: undefined
      });
    };
  }

  render () {
    const {
      active,
      attachment,
      avoidEdges,
      contentHorizontalEdge,
      contentVerticalEdge,
      disabled,
      positionHorizontal,
      positionVertical,
      className,
      removeElement
    } = this.state;

    return (
      <div className="app">
        <ul>
          <li>
            <label>
              attachment
              <select onChange={this.createStateHandler('attachment')} value={attachment}>
                {_.map(ATTACHMENTS, selectedAttachment => (<option key={selectedAttachment}>{selectedAttachment}</option>))}
              </select>
            </label>
          </li>
          <li>
            <label>
              avoidEdges
              <input
                type="checkbox"
                onChange={this.createStateHandler('avoidEdges', (event) => event.target.checked)}
                value={avoidEdges} />
            </label>
          </li>
          <li>
            <label>
              disabled
              <input
                type="checkbox"
                onChange={this.createStateHandler('disabled', (event) => event.target.checked)}
                value={disabled} />
            </label>
          </li>
          <li>
            <label>
              active
              <input
                type="checkbox"
                onChange={this.createStateHandler('active', (event) => event.target.checked)}
                value={active} />
            </label>
            <button type="button" onClick={this.createStateUnsetter('active')}>Unset Active</button>
          </li>
          <li>
            <label>
              positionHorizontal
              <select onChange={this.createStateHandler('positionHorizontal')} value={positionHorizontal}>
                {_.map(POSITIONS_HORIZONTAL, position => (<option key={position}>{position}</option>))}
              </select>
            </label>
          </li>
          <li>
            <label>
              positionVertical
              <select onChange={this.createStateHandler('positionVertical')} value={positionVertical}>
                {_.map(POSITIONS_VERTICAL, position => (<option key={position}>{position}</option>))}
              </select>
            </label>
          </li>
          <li>
            <label>
              contentHorizontalEdge
              <select onChange={this.createStateHandler('contentHorizontalEdge')} value={contentHorizontalEdge}>
                {_.map(CONTENT_EDGES_HORIZONTAL, position => (<option key={position}>{position}</option>))}
              </select>
            </label>
          </li>
          <li>
            <label>
              contentVerticalEdge
              <select onChange={this.createStateHandler('contentVerticalEdge')} value={contentVerticalEdge}>
                {_.map(CONTENT_EDGES_VERTICAL, position => (<option key={position}>{position}</option>))}
              </select>
            </label>
          </li>
          <li>
            <label>
              className
              <input type="text" onChange={this.createStateHandler('className')} value={className} />
            </label>
          </li>
          <li>
            <label>
              removeElement
              <input
                type="checkbox"
                onChange={this.createStateHandler('removeElement', (event) => event.target.checked)}
                value={removeElement} />
            </label>
          </li>
        </ul>
        <div className="overflow-scroller">
          <div className="overflow-scroller__top-spacer" />
          <div className="overflow-scroller__bottom-spacer" />
          <AccountDropdown {...this.state} />
        </div>
        <div>
          <Highlight className="code jsx">{accountDropdownCode}</Highlight>
        </div>
      </div>
    );
  }
}

App.propTypes = {};

export default App;
