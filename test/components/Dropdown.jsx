import test from 'tape';
import React, { createClass } from 'react';
import { findDOMNode } from 'react-dom';
import { findRenderedComponentWithType, findRenderedDOMComponentWithClass, renderIntoDocument, Simulate } from 'react-addons-test-utils';
import smock from 'simple-mock';
import domClasses, { has as hasClass } from 'dom-classes';

import Dropdown, { DropdownTrigger, DropdownContent } from '../../lib/components/Dropdown.js';

var TestApp = createClass({
  getInitialState: function(){
    return {};
  },
  render: function(){
    const { className, active, onShow, onHide, onTriggerClick } = this.state;
    return (
      <Dropdown
        className={className}
        active={active}
        onShow={onShow}
        onHide={onHide}
      >
        <DropdownTrigger onClick={onTriggerClick} />
        <DropdownContent />
      </Dropdown>
    );
  }
});
var test_app = renderIntoDocument( <TestApp /> );
var dropdown = findRenderedComponentWithType( test_app, Dropdown );
var dropdown_element = findRenderedDOMComponentWithClass( dropdown, 'dropdown' );
var dropdown_element_dom_node = findDOMNode( dropdown_element );
var trigger = findRenderedComponentWithType( test_app, DropdownTrigger );
var trigger_element = findRenderedDOMComponentWithClass( trigger, 'dropdown__trigger' );
var content = findRenderedComponentWithType( test_app, DropdownContent );
var content_element = findRenderedDOMComponentWithClass( content, 'dropdown__content' );

test( 'Merges classes from props with default element class', function( t ){
  t.plan( 3 );
  t.equal( domClasses( dropdown_element_dom_node ).length, 1, 'has one class when `className` is empty' );
  test_app.setState({
    className: 'test'
  });
  t.ok( hasClass( dropdown_element_dom_node, 'dropdown' ), 'has class `dropdown`' );
  t.ok( hasClass( dropdown_element_dom_node, 'test' ), 'has class `test`' );
  test_app.setState({
    className: null
  });
});

test( 'Dropdown is toggled when DropdownTrigger is clicked', function( t ){
  t.plan( 4 );
  var onShowCallback = smock.stub();
  var onHideCallback = smock.stub();
  test_app.setState({
    onShow: onShowCallback,
    onHide: onHideCallback
  });
  Simulate.click( trigger_element );
  t.ok( hasClass( dropdown_element_dom_node, 'dropdown--active' ), 'has class `dropdown--active` after trigger is clicked' );
  t.equal( onShowCallback.callCount, 1, '`onShow` function was called' );
  Simulate.click( trigger_element );
  t.notOk( hasClass( dropdown_element_dom_node, 'dropdown--active' ), 'does not have class `dropdown--active` after trigger is clicked again' );
  t.equal( onHideCallback.callCount, 1, '`onHide` function was called' );
  test_app.setState({
    onShow: null,
    onHide: null
  });
});

test( 'Custom onClick handler is called when DropDownTrigger is clicked', function( t ){
  t.plan( 1 );
  var onTriggerClickCallback = smock.stub();
  test_app.setState({
    onTriggerClick: onTriggerClickCallback
  });
  Simulate.click( trigger_element );
  t.equal( onTriggerClickCallback.callCount, 1, 'click handler called when trigger is clicked');
});

test( 'Dropdown state can be manually set with props', function( t ){
  t.plan( 2 );
  test_app.setState({
    active: true
  });
  t.ok( hasClass( dropdown_element_dom_node, 'dropdown--active' ), 'has class `dropdown--active` when `active` is set to `true`' );
  test_app.setState({
    active: false
  });
  t.notOk( hasClass( dropdown_element_dom_node, 'dropdown--active' ), 'does not have class `dropdown--active` when `active` is set to `false`' );
  test_app.setState({
    active: null
  });
});

test( 'Dropdown hides itself when area outside dropdown is clicked', function( t ){
  t.plan( 2 );
  dropdown.setState({
    active: true
  });
  Simulate.click( content_element );
  t.ok( hasClass( dropdown_element_dom_node, 'dropdown--active' ), 'has class `dropdown--active` after content element is clicked' );
  document.body.click();
  t.notOk( hasClass( dropdown_element_dom_node, 'dropdown--active' ), 'does not have class `dropdown--active` after document body is clicked' );
});
