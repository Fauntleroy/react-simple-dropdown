const fs = require('fs');

import _ from 'lodash';
import React, { Component } from 'react';

import Highlight from 'react-highlight';

import ExampleDropdown from './example-dropdown';

// eslint-disable-next-line no-sync
const accountDropdownCode = fs.readFileSync(`${__dirname}/example-dropdown.jsx`, 'utf8');

const ATTACHMENTS = ['inline', 'attached', 'detached'];
const POSITIONS_HORIZONTAL = ['left', 'center', 'right'];
const POSITIONS_VERTICAL = ['top', 'middle', 'bottom'];
const CONTENT_EDGES_HORIZONTAL = ['left', 'right'];
const CONTENT_EDGES_VERTICAL = ['top', 'bottom'];

const attachments = [{
  name: 'undefined'
}, ...ATTACHMENTS.map(attachment => ({ name: attachment, value: attachment }))];

function defaultDataGetter (event) {
  return event.target.value;
}

class App extends Component {
  constructor (props) {
    super(props);

    this.state = {};

    this.handleLinkClick = this.handleLinkClick.bind(this);
  }

  handleLinkClick () {
    this.refs.dropdown.hide();
  }

  createStateHandler (key, dataGetter = defaultDataGetter) {
    return (event) => {
      const newData = dataGetter(event);
      const newState = {
        ...this.state
      };
      if (typeof newData !== 'undefined') {
        newState[key] = newData;
      }

      this.setState(newState);
    };
  }

  createStateUnsetter (key) {
    return () => {
      this.setState({
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
        <h2>A Simple Account Dropdown</h2>
        <h3>Props</h3>
        <ul>
          <li>
            <label>
              attachment
              <select onChange={this.createStateHandler('attachment')} value={attachment}>
                {_.map(attachments, currentAttachment => (<option key={currentAttachment.name} value={currentAttachment.value}>{currentAttachment.name}</option>))}
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
            <button type="button" onClick={this.createStateUnsetter('avoidEdges')}>Unset avoidEdges</button>
          </li>
          <li>
            <label>
              disabled
              <input
                type="checkbox"
                onChange={this.createStateHandler('disabled', (event) => event.target.checked)}
                value={disabled} />
            </label>
            <button type="button" onClick={this.createStateUnsetter('disabled')}>Unset disabled</button>
          </li>
          <li>
            <label>
              active
              <input
                type="checkbox"
                onChange={this.createStateHandler('active', (event) => event.target.checked)}
                value={active} />
            </label>
            <button type="button" onClick={this.createStateUnsetter('active')}>Unset active</button>
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
              <button type="button" onClick={this.createStateUnsetter('removeElement')}>Unset removeElement</button>
            </label>
          </li>
        </ul>
        <h3>Example</h3>
        <div className="overflow-scroller">
          <div className="overflow-scroller__top-spacer" />
          <ExampleDropdown {...this.state} />
          <div className="overflow-scroller__bottom-spacer" />
        </div>
        <h3>Code</h3>
        <div>
          <Highlight className="code jsx">{accountDropdownCode}</Highlight>
        </div>
      </div>
    );
  }
}

App.propTypes = {};

export default App;
