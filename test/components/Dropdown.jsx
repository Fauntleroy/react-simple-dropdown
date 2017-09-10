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

function renderTestApp () {
  const testApp = renderIntoDocument(<TestApp />);
  const dropdown = findRenderedComponentWithType(testApp, Dropdown);
  const dropdownElement = findRenderedDOMComponentWithClass(dropdown, 'dropdown');
  const dropdownElementDomNode = findDOMNode(dropdownElement);
  const trigger = findRenderedComponentWithType(testApp, DropdownTrigger);
  const triggerElement = findRenderedDOMComponentWithClass(trigger, 'dropdown__trigger');
  const content = findRenderedComponentWithType(testApp, DropdownContent);
  const contentElement = findRenderedDOMComponentWithClass(content, 'dropdown__content');
  const contentElementDomNode = findDOMNode(contentElement);

  return {
    testApp,
    dropdown,
    dropdownElement,
    dropdownElementDomNode,
    trigger,
    triggerElement,
    content,
    contentElement,
    contentElementDomNode
  };
}

test('Merges classes from props with default element class', function (t) {
  t.plan(3);

  const { testApp, dropdownElementDomNode } = renderTestApp();

  t.equal(domClasses(dropdownElementDomNode).length, 1, 'has one class when `className` is empty');

  testApp.setState({
    className: 'test'
  });

  t.ok(hasClass(dropdownElementDomNode, 'dropdown'), 'has class `dropdown`');
  t.ok(hasClass(dropdownElementDomNode, 'test'), 'has class `test`');
});

test('Transfers props to base element', function (t) {
  t.plan(5);

  const id = 'test';
  const className = 'test';
  const dataTest = 'test';
  const onClick = smock.stub();

  const { testApp, dropdownElementDomNode } = renderTestApp();

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
});

test('Dropdown is toggled when DropdownTrigger is clicked', function (t) {
  t.plan(4);

  const { testApp, dropdownElementDomNode, triggerElement } = renderTestApp();

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
});

test('Dropdown is firing onShow only after the dropdown is shown', function (t) {
  t.plan(1);

  const { testApp, dropdownElementDomNode, triggerElement } = renderTestApp();

  const onShowCallback = smock.stub(() => {
    t.ok(hasClass(dropdownElementDomNode, 'dropdown--active'), 'has class `dropdown--active` when onShow callback is called.');
  });

  testApp.setState({
    onShow: onShowCallback
  });

  Simulate.click(triggerElement);
});

test('Dropdown is firing onHide only after the dropdown is hidden', function (t) {
  t.plan(1);

  const { testApp, dropdownElementDomNode, triggerElement } = renderTestApp();

  const onHideCallback = smock.stub(() => {
    t.notOk(hasClass(dropdownElementDomNode, 'dropdown--active'), 'does not have class `dropdown--active` when onHide callback is called.');
  });

  testApp.setState({
    onHide: onHideCallback
  });

  Simulate.click(triggerElement); // first click to show the dropdown
  Simulate.click(triggerElement); // second click to hide the dropdown
});

test('Custom onClick handler is called when DropDownTrigger is clicked', function (t) {
  t.plan(1);

  const { testApp, triggerElement } = renderTestApp();

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

  const { testApp, dropdownElementDomNode } = renderTestApp();

  testApp.setState({
    active: true
  });

  t.ok(hasClass(dropdownElementDomNode, 'dropdown--active'), 'has class `dropdown--active` when `active` is set to `true`');

  testApp.setState({
    active: false
  });

  t.notOk(hasClass(dropdownElementDomNode, 'dropdown--active'), 'does not have class `dropdown--active` when `active` is set to `false`');
});

test('Dropdown hides itself when area outside dropdown is clicked', function (t) {
  t.plan(2);

  const { dropdown, contentElement, dropdownElementDomNode } = renderTestApp();

  dropdown.setState({
    active: true
  });

  Simulate.click(contentElement);
  t.ok(hasClass(dropdownElementDomNode, 'dropdown--active'), 'has class `dropdown--active` after content element is clicked');
  document.body.click();
  t.notOk(hasClass(dropdownElementDomNode, 'dropdown--active'), 'does not have class `dropdown--active` after document body is clicked');
});

test('Dropdown Content element is removed when removeElement is set', function (t) {
  t.plan(2);

  const { testApp } = renderTestApp();

  testApp.setState({
    active: false,
    removeElement: true
  });

  try {
    findRenderedDOMComponentWithClass(testApp, 'dropdown__content');
  } catch (error) {
    t.ok(true, 'content element is not rendered when dropdown is not active');
  }

  testApp.setState({
    active: true
  });

  try {
    findRenderedDOMComponentWithClass(testApp, 'dropdown__content');
  } catch (error) {
    t.fail('content element is rendered when dropdown is active');
  } finally {
    t.pass('content element is rendered when dropdown is active');
  }
});

test('DropdownTrigger should do nothing when disabled', function (t) {
  t.plan(3);

  const { testApp, dropdown, dropdownElementDomNode, triggerElement } = renderTestApp();
  const customOnClickHandler = smock.stub();

  testApp.setState({
    disabled: true,
    onTriggerClick: customOnClickHandler
  });

  t.ok(hasClass(dropdownElementDomNode, 'dropdown--disabled'), 'has class `dropdown--disabled` when disabled is set');

  const onToggleClickStub = smock.mock(dropdown, '_onToggleClick');

  Simulate.click(triggerElement);

  t.equal(onToggleClickStub.callCount, 0, 'prevents _onToggleClick call');
  t.equal(customOnClickHandler.callCount, 0, 'prevents custom onClick call');

  smock.restore();
});
