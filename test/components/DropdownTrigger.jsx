import test from 'tape';
import React, { createClass } from 'react';
import { findDOMNode } from 'react-dom';
import { findRenderedComponentWithType, findRenderedDOMComponentWithClass, renderIntoDocument } from 'react-addons-test-utils';
import domClasses, { has as hasClass } from 'dom-classes';

import DropdownTrigger from '../../lib/components/DropdownTrigger.js';

var TestApp = createClass({
  getInitialState: function(){
    return {};
  },
  render: function(){
    return (
      <DropdownTrigger
        className={this.state.className}
        onClick={this.state.onClick}
      />
    );
  }
});
var test_app = renderIntoDocument( <TestApp /> );
var dropdown_trigger = findRenderedComponentWithType( test_app, DropdownTrigger );
var dropdown_trigger_element = findRenderedDOMComponentWithClass( dropdown_trigger, 'dropdown__trigger' );
var dropdown_trigger_dom_node = findDOMNode( dropdown_trigger );

test( 'Merges classes from props with default element class', function( t ){
  t.plan( 3 );
  t.equal( domClasses( dropdown_trigger_dom_node ).length, 1, 'has one class when `className` is empty' );
  test_app.setState({
    className: 'test'
  });
  t.ok( hasClass( dropdown_trigger_dom_node, 'dropdown__trigger' ), 'has class `dropdown__trigger`' );
  t.ok( hasClass( dropdown_trigger_dom_node, 'test' ), 'has class `test`' );
  test_app.setState({
    className: null
  });
});
