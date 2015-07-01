var test = require('tape');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var domClasses = require('dom-classes');
var hasClass = domClasses.has;

var DropdownContent = require('../../components/DropdownContent.js');

test( 'Merges classes from props with default element class', function( t ){
    t.plan( 2 );
    var dropdown_content = TestUtils.renderIntoDocument( React.createElement( DropdownContent, { className: 'test' } ) );
    var div_element = TestUtils.scryRenderedDOMComponentsWithClass( dropdown_content, 'dropdown__content' )[0];
    var div_element_dom_node = div_element.getDOMNode();
    t.ok( hasClass( div_element_dom_node, 'dropdown__content' ), 'has class `dropdown__content`' );
    t.ok( hasClass( div_element_dom_node, 'test' ), 'has class `test`' );
});