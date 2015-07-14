var test = require('tape');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var domClasses = require('dom-classes');
var hasClass = domClasses.has;

var DropdownContent = require('../../components/DropdownContent.js');

var TestApp = React.createClass({
    getInitialState: function(){
        return {};
    },
    render: function(){
        return <DropdownContent className={this.state.className} />;
    }
});
var test_app = TestUtils.renderIntoDocument( <TestApp /> );
var dropdown_content = TestUtils.findRenderedComponentWithType( test_app, DropdownContent );
var dropdown_content_element = TestUtils.findRenderedDOMComponentWithClass( dropdown_content, 'dropdown__content' );
var dropdown_content_dom_node = React.findDOMNode( dropdown_content );

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