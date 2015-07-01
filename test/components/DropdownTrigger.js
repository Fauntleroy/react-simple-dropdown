var test = require('tape');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var domClasses = require('dom-classes');
var hasClass = domClasses.has;

var DropdownTrigger = require('../../components/DropdownTrigger.js');

test( 'Merges classes from props with default element class', function( t ){
    t.plan( 2 );
    var dropdown_trigger = TestUtils.renderIntoDocument( React.createElement( DropdownTrigger, { className: 'test' } ) );
    var dropdown_trigger_element = TestUtils.findRenderedDOMComponentWithClass( dropdown_trigger, 'dropdown__trigger' );
    var dropdown_trigger_element_dom_node = React.findDOMNode( dropdown_trigger_element );
    t.ok( hasClass( dropdown_trigger_element_dom_node, 'dropdown__trigger' ), 'has class `dropdown__trigger`' );
    t.ok( hasClass( dropdown_trigger_element_dom_node, 'test' ), 'has class `test`' );
});

test( 'Attaches onClick handler to element', function( t ){
    t.plan( 1 );
    var clickHandler = function(){};
    var dropdown_trigger = TestUtils.renderIntoDocument( React.createElement( DropdownTrigger, { onClick: clickHandler } ) );
    var dropdown_trigger_element = TestUtils.findRenderedDOMComponentWithClass( dropdown_trigger, 'dropdown__trigger' );
    t.equal( dropdown_trigger_element.props.onClick, clickHandler, 'clickHandler passed to DropdownTrigger and attached to anchor element are equal' );
});