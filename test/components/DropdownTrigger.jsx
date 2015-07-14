var test = require('tape');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var domClasses = require('dom-classes');
var hasClass = domClasses.has;

var DropdownTrigger = require('../../components/DropdownTrigger.js');

var TestApp = React.createClass({
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
var test_app = TestUtils.renderIntoDocument( <TestApp /> );
var dropdown_trigger = TestUtils.findRenderedComponentWithType( test_app, DropdownTrigger );
var dropdown_trigger_element = TestUtils.findRenderedDOMComponentWithClass( dropdown_trigger, 'dropdown__trigger' );
var dropdown_trigger_dom_node = React.findDOMNode( dropdown_trigger );

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

test( 'Attaches onClick handler to element', function( t ){
    t.plan( 1 );
    var clickHandler = function(){};
    test_app.setState({
        onClick: clickHandler
    });
    t.equal( dropdown_trigger_element.props.onClick, clickHandler, '`clickHandler` passed to DropdownTrigger and attached to anchor element are equal' );
    test_app.setState({
        onClick: null
    });
});