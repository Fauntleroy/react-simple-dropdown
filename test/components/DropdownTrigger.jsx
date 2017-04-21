import test from 'tape';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { findRenderedComponentWithType, renderIntoDocument } from 'react-dom/test-utils';
import domClasses, { has as hasClass } from 'dom-classes';

import DropdownTrigger from '../../lib/components/DropdownTrigger.js';

class TestApp extends Component {
  constructor () {
    super();

    this.state = {};
  }

  render () {
    return <DropdownTrigger {...this.state} />;
  }
}

const testApp = renderIntoDocument(<TestApp />);
const dropdownTrigger = findRenderedComponentWithType(testApp, DropdownTrigger);
const dropdownTriggerDomNode = findDOMNode(dropdownTrigger);

test('Merges classes from props with default element class', function (t) {
  t.plan(3);
  t.equal(domClasses(dropdownTriggerDomNode).length, 1, 'has one class when `className` is empty');
  testApp.setState({
    className: 'test'
  });
  t.ok(hasClass(dropdownTriggerDomNode, 'dropdown__trigger'), 'has class `dropdown__trigger`');
  t.ok(hasClass(dropdownTriggerDomNode, 'test'), 'has class `test`');
  testApp.setState({
    className: null
  });
});
