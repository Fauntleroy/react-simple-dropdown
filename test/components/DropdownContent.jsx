import test from 'tape';
import React, { createClass } from 'react';
import { findDOMNode } from 'react-dom';
import { findRenderedComponentWithType, findRenderedDOMComponentWithClass, renderIntoDocument } from 'react-addons-test-utils';
import domClasses, { has as hasClass } from 'dom-classes';

import DropdownContent from '../../lib/components/DropdownContent.js';

var TestApp = createClass({
  getInitialState: function(){
    return {};
  },
  render: function(){
    return <DropdownContent className={this.state.className} />;
  }
});
var test_app = renderIntoDocument( <TestApp /> );
var dropdown_content = findRenderedComponentWithType( test_app, DropdownContent );
var dropdown_content_element = findRenderedDOMComponentWithClass( dropdown_content, 'dropdown__content' );
var dropdown_content_dom_node = findDOMNode( dropdown_content );

test( 'Merges classes from props with default element class', function( t ){
  t.plan( 3 );
  t.equal( domClasses( dropdown_content_dom_node ).length, 1, 'has one class when `className` is empty' );
  test_app.setState({
    className: 'test'
  });
  t.ok( hasClass( dropdown_content_dom_node, 'dropdown__content' ), 'has class `dropdown__content`' );
  t.ok( hasClass( dropdown_content_dom_node, 'test' ), 'has class `test`' );
  test_app.setState({
    className: null
  });
});
