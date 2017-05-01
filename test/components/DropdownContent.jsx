import test from 'tape';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { findRenderedComponentWithType, renderIntoDocument, Simulate } from 'react-dom/test-utils';
import smock from 'simple-mock';
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

function renderTestApp () {
  const testApp = renderIntoDocument(<TestApp />);
  const dropdownContent = findRenderedComponentWithType(testApp, DropdownContent);
  const dropdownContentDomNode = findDOMNode(dropdownContent);

  return {
    testApp,
    dropdownContent,
    dropdownContentDomNode
  };
}

test('Merges classes from props with default element class', function (t) {
  t.plan(3);

  const { testApp, dropdownContentDomNode } = renderTestApp();

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

test('Transfers props to base element', function (t) {
  t.plan(5);

  const { testApp, dropdownContentDomNode } = renderTestApp();
  const id = 'test';
  const className = 'test';
  const dataTest = 'test';
  const onClick = smock.stub();

  testApp.setState({
    id,
    className,
    'data-test': dataTest,
    onClick
  });

  Simulate.click(dropdownContentDomNode);

  t.ok(hasClass(dropdownContentDomNode, 'dropdown__content'), 'has class `dropdown`');
  t.ok(hasClass(dropdownContentDomNode, 'test'), 'has class `test`');
  t.equal(dropdownContentDomNode.getAttribute('id'), id, 'passes id prop as an attribute to base element');
  t.equal(dropdownContentDomNode.getAttribute('data-test'), dataTest, 'passes arbitrary prop as an attribute to base element');
  t.equal(onClick.callCount, 1, 'passes event handlers');

  testApp.setState({
    id: null,
    className: null,
    onClick: null
  });
});
