var test = require('tape');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var domClasses = require('dom-classes');
var hasClass = domClasses.has;

var Dropdown = require('../../components/Dropdown.js');
var DropdownTrigger = Dropdown.DropdownTrigger;
var DropdownContent = Dropdown.DropdownContent;

test( 'Merges classes from props with default element class', function( t ){
    t.plan( 2 );
    var dropdown_content = TestUtils.renderIntoDocument( (<Dropdown>
        <DropdownTrigger></DropdownTrigger>
        <DropdownContent></DropdownContent>
    </Dropdown>) );
    var div_element = TestUtils.scryRenderedDOMComponentsWithClass( dropdown_content, 'dropdown' )[0];
    var div_element_dom_node = div_element.getDOMNode();
    t.ok( hasClass( div_element_dom_node, 'dropdown' ), 'has class `dropdown`' );
    t.ok( hasClass( div_element_dom_node, 'test' ), 'has class `test`' );
});