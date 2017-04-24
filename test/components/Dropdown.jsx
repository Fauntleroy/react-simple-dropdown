import test from 'tape';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { findRenderedComponentWithType, findRenderedDOMComponentWithClass, renderIntoDocument, Simulate } from 'react-dom/test-utils';
import smock from 'simple-mock';
import domClasses, { has as hasClass } from 'dom-classes';

import Dropdown, { DropdownTrigger, DropdownContent } from '../../lib/components/Dropdown.js';

const DEFAULT_TEST_APP_STATE = {};

class TestApp extends Component {
  constructor () {
    super();

    this.state = DEFAULT_TEST_APP_STATE;
  }

  render () {
    const { onTriggerClick, ...dropdownState } = this.state;

    return (
      <Dropdown
        {...dropdownState}>
        <DropdownTrigger onClick={onTriggerClick} />
        <DropdownContent />
      </Dropdown>
    );
  }
}

const testApp = renderIntoDocument(<TestApp />);
const dropdown = findRenderedComponentWithType(testApp, Dropdown);
const dropdownElement = findRenderedDOMComponentWithClass(dropdown, 'dropdown');
const dropdownElementDomNode = findDOMNode(dropdownElement);
const trigger = findRenderedComponentWithType(testApp, DropdownTrigger);
const triggerElement = findRenderedDOMComponentWithClass(trigger, 'dropdown__trigger');
const content = findRenderedComponentWithType(testApp, DropdownContent);
const contentElement = findRenderedDOMComponentWithClass(content, 'dropdown__content');

test('Merges classes from props with default element class', function (t) {
  t.plan(3);

  t.equal(domClasses(dropdownElementDomNode).length, 1, 'has one class when `className` is empty');

  testApp.setState({
    className: 'test'
  });

  t.ok(hasClass(dropdownElementDomNode, 'dropdown'), 'has class `dropdown`');
  t.ok(hasClass(dropdownElementDomNode, 'test'), 'has class `test`');

  testApp.setState({
    className: null
  });
});

test('Transfers props to base element', function (t) {
  t.plan(5);

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

  Simulate.click(dropdownElementDomNode);

  t.ok(hasClass(dropdownElementDomNode, 'dropdown'), 'has class `dropdown`');
  t.ok(hasClass(dropdownElementDomNode, 'test'), 'has class `test`');
  t.equal(dropdownElementDomNode.getAttribute('id'), id, 'passes id prop as an attribute to base element');
  t.equal(dropdownElementDomNode.getAttribute('data-test'), dataTest, 'passes arbitrary prop as an attribute to base element');
  t.equal(onClick.callCount, 1, 'passes event handlers');

  testApp.setState({
    id: null,
    className: null,
    onClick: null
  });
});

test('Dropdown is toggled when DropdownTrigger is clicked', function (t) {
  t.plan(4);

  const onShowCallback = smock.stub();
  const onHideCallback = smock.stub();

  testApp.setState({
    onShow: onShowCallback,
    onHide: onHideCallback
  });

  Simulate.click(triggerElement);
  t.ok(hasClass(dropdownElementDomNode, 'dropdown--active'), 'has class `dropdown--active` after trigger is clicked');
  t.equal(onShowCallback.callCount, 1, '`onShow` function was called');
  Simulate.click(triggerElement);
  t.notOk(hasClass(dropdownElementDomNode, 'dropdown--active'), 'does not have class `dropdown--active` after trigger is clicked again');
  t.equal(onHideCallback.callCount, 1, '`onHide` function was called');

  testApp.setState({
    onShow: null,
    onHide: null
  });
});

test('Custom onClick handler is called when DropDownTrigger is clicked', function (t) {
  t.plan(1);

  const onTriggerClickCallback = smock.stub();
  testApp.setState({
    onTriggerClick: onTriggerClickCallback
  });
  Simulate.click(triggerElement);
  Simulate.click(triggerElement);
  Simulate.click(triggerElement);

  t.equal(onTriggerClickCallback.callCount, 3, 'click handler called when trigger is clicked');
});

test('Dropdown state can be manually set with props', function (t) {
  t.plan(2);

  testApp.setState({
    active: true
  });

  t.ok(hasClass(dropdownElementDomNode, 'dropdown--active'), 'has class `dropdown--active` when `active` is set to `true`');

  testApp.setState({
    active: false
  });

  t.notOk(hasClass(dropdownElementDomNode, 'dropdown--active'), 'does not have class `dropdown--active` when `active` is set to `false`');

  testApp.setState({
    active: null
  });
});

test('Dropdown hides itself when area outside dropdown is clicked', function (t) {
  t.plan(2);

  dropdown.setState({
    active: true
  });

  Simulate.click(contentElement);
  t.ok(hasClass(dropdownElementDomNode, 'dropdown--active'), 'has class `dropdown--active` after content element is clicked');
  document.body.click();
  t.notOk(hasClass(dropdownElementDomNode, 'dropdown--active'), 'does not have class `dropdown--active` after document body is clicked');
});
