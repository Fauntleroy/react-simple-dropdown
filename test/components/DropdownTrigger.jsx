import test from 'tape';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { findRenderedComponentWithType, renderIntoDocument, Simulate } from 'react-dom/test-utils';
import smock from 'simple-mock';
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

function renderTestApp () {
  const testApp = renderIntoDocument(<TestApp />);
  const dropdownTrigger = findRenderedComponentWithType(testApp, DropdownTrigger);
  const dropdownTriggerDomNode = findDOMNode(dropdownTrigger);

  return {
    testApp,
    dropdownTrigger,
    dropdownTriggerDomNode
  };
}

test('Merges classes from props with default element class', function (t) {
  t.plan(3);

  const { testApp, dropdownTriggerDomNode } = renderTestApp();

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

test('Transfers props to base element', function (t) {
  t.plan(5);

  const { testApp, dropdownTriggerDomNode } = renderTestApp();

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

  Simulate.click(dropdownTriggerDomNode);

  t.ok(hasClass(dropdownTriggerDomNode, 'dropdown__trigger'), 'has class `dropdown`');
  t.ok(hasClass(dropdownTriggerDomNode, 'test'), 'has class `test`');
  t.equal(dropdownTriggerDomNode.getAttribute('id'), id, 'passes id prop as an attribute to base element');
  t.equal(dropdownTriggerDomNode.getAttribute('data-test'), dataTest, 'passes arbitrary prop as an attribute to base element');
  t.equal(onClick.callCount, 1, 'passes event handlers');

  testApp.setState({
    id: null,
    className: null,
    onClick: null
  });
});
