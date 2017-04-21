import test from 'tape';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { findRenderedComponentWithType, renderIntoDocument } from 'react-dom/test-utils';
import domClasses, { has as hasClass } from 'dom-classes';

import DropdownContent from '../../lib/components/DropdownContent.js';

class TestApp extends Component {
  constructor () {
    super();

    this.state = {};
  }

  render () {
    return <DropdownContent {...this.state} />;
  }
}

const testApp = renderIntoDocument(<TestApp />);
const dropdownContent = findRenderedComponentWithType(testApp, DropdownContent);
const dropdownContentDomNode = findDOMNode(dropdownContent);

test('Merges classes from props with default element class', function (t) {
  t.plan(3);
  t.equal(domClasses(dropdownContentDomNode).length, 1, 'has one class when `className` is empty');
  testApp.setState({
    className: 'test'
  });
  t.ok(hasClass(dropdownContentDomNode, 'dropdown__content'), 'has class `dropdown__content`');
  t.ok(hasClass(dropdownContentDomNode, 'test'), 'has class `test`');
  testApp.setState({
    className: null
  });
});
