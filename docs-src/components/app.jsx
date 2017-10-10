const fs = require('fs');

import _ from 'lodash';
import React, { Component } from 'react';

import Highlight from 'react-highlight';

import Dropdown from '../../src/components/dropdown';
import ExampleDropdown from './example-dropdown';

// eslint-disable-next-line no-sync
const accountDropdownCode = fs.readFileSync(`${__dirname}/example-dropdown.jsx`, 'utf8');

const ATTACHMENTS = ['inline', 'attached', 'detached'];
const POSITIONS_HORIZONTAL = ['left', 'center', 'right'];
const POSITIONS_VERTICAL = ['top', 'middle', 'bottom'];
const CONTENT_EDGES_HORIZONTAL = ['left', 'center', 'right'];
const CONTENT_EDGES_VERTICAL = ['top', 'middle', 'bottom'];

function defaultDataGetter (event) {
  return event.target.value;
}

class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      ...Dropdown.defaultProps,
      mountDropdown: true
    };

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
        // eslint-disable-next-line no-undefined
        [key]: undefined
      });
    };
  }

  render () {
    const {
      mountDropdown,
      ...dropdownState
    } = this.state;
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
    } = dropdownState;

    return (
      <div className="app">
        <h2>React Simple Dropdown</h2>
        <h3>Props</h3>
        <ul className="props-manager">
          <li>
            <label>
              attachment
              <select onChange={this.createStateHandler('attachment')} value={attachment}>
                {_.map(ATTACHMENTS, currentAttachment => (<option key={currentAttachment} value={currentAttachment}>{currentAttachment}</option>))}
              </select>
            </label>
          </li>
          <li>
            <label>
              avoidEdges
              <input
                type="checkbox"
                onChange={this.createStateHandler('avoidEdges', (event) => event.target.checked)}
                checked={avoidEdges} />
            </label>
          </li>
          <li>
            <label>
              disabled
              <input
                type="checkbox"
                onChange={this.createStateHandler('disabled', (event) => event.target.checked)}
                checked={disabled} />
            </label>
          </li>
          <li>
            <label>
              active
              <input
                type="checkbox"
                onChange={this.createStateHandler('active', (event) => event.target.checked)}
                checked={active} />
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
                checked={removeElement} />
            </label>
          </li>
        </ul>
        <br />
        <label>
          Mount dropdown
          <input
            type="checkbox"
            onChange={this.createStateHandler('mountDropdown', (event) => event.target.checked)}
            checked={mountDropdown} />
        </label>
        <h3>Example</h3>
        <div className="overflow-scroller">
          <div className="overflow-scroller__top-spacer" />
          {mountDropdown && <ExampleDropdown {...dropdownState} />}
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
